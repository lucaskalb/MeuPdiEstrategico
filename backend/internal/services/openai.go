package services

import (
	"context"
	"fmt"
	"log"
	"meu-pdi-estrategico/backend/internal/models"
	"os"
	"time"

	openai "github.com/sashabaranov/go-openai"
	"gorm.io/gorm"
)

type OpenAIService struct {
	client      *openai.Client
	db          *gorm.DB
	assistantID string
	pdiService  *PDIService
}

func NewOpenAIService(db *gorm.DB) *OpenAIService {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		panic("OPENAI_API_KEY não configurada")
	}
	assistantID := os.Getenv("OPENAI_ASSISTANT_ID")
	if assistantID == "" {
		panic("OPENAI_ASSISTANT_ID não configurada")
	}

	client := openai.NewClient(apiKey)
	return &OpenAIService{
		assistantID: assistantID,
		client:      client,
		db:          db,
		pdiService:  NewPDIService(db),
	}
}

func (s *OpenAIService) ProcessMessage(ctx context.Context, message *models.Message, userID string) (*models.Message, error) {
	log.Printf("[OpenAI] Iniciando processamento de mensagem. UserID: %s, PDI ID: %s", userID, message.PDIID)

	// Buscar o PDI
	pdi, err := s.pdiService.GetPDIByID(userID, message.PDIID)
	if err != nil {
		log.Printf("[OpenAI] Erro ao buscar PDI: %v", err)
		return nil, fmt.Errorf("erro ao buscar PDI: %v", err)
	}
	log.Printf("[OpenAI] PDI encontrado. Nome: %s, Ativo: %v, ThreadID: %s", pdi.Name, pdi.Activated, pdi.ThreadID)

	if !pdi.Activated {
		log.Printf("[OpenAI] PDI não está ativo")
		return nil, fmt.Errorf("PDI não está ativo")
	}

	var threadID string
	if pdi.ThreadID == "" {
		log.Printf("[OpenAI] ThreadID não encontrado. Criando novo thread...")
		// Criar novo thread se não existir
		thread, err := s.client.CreateThread(ctx, openai.ThreadRequest{})
		if err != nil {
			log.Printf("[OpenAI] Erro ao criar thread: %v", err)
			return nil, fmt.Errorf("erro ao criar thread: %v", err)
		}
		log.Printf("[OpenAI] Novo thread criado com ID: %s", thread.ID)

		// Atualizar o PDI com o novo ThreadID usando Updates para evitar hooks
    pdi.ThreadID = thread.ID

		result := s.db.Model(&pdi).
			Where("id = ?", pdi.ID).
			Updates(&pdi)
		
		if result.Error != nil {
			log.Printf("[OpenAI] Erro ao atualizar thread_id do PDI: %v", result.Error)
			return nil, fmt.Errorf("erro ao atualizar thread_id do PDI: %v", result.Error)
		}

		if result.RowsAffected == 0 {
			log.Printf("[OpenAI] Nenhum PDI foi atualizado")
			return nil, fmt.Errorf("PDI não encontrado para atualização")
		}

		log.Printf("[OpenAI] PDI atualizado com novo ThreadID")
		threadID = thread.ID
	} else {
		threadID = pdi.ThreadID
		log.Printf("[OpenAI] Usando thread existente: %s", threadID)
	}

	// Adicionar a mensagem do usuário ao thread
	log.Printf("[OpenAI] Adicionando mensagem do usuário ao thread...")
	_, err = s.client.CreateMessage(ctx, threadID, openai.MessageRequest{
		Role:    "user",
		Content: message.Content,
	})
	if err != nil {
		log.Printf("[OpenAI] Erro ao adicionar mensagem ao thread: %v", err)
		return nil, fmt.Errorf("erro ao adicionar mensagem ao thread: %v", err)
	}
	log.Printf("[OpenAI] Mensagem do usuário adicionada com sucesso")

	// Criar e executar o run
	log.Printf("[OpenAI] Criando run com AssistantID: %s", s.assistantID)
	run, err := s.client.CreateRun(ctx, threadID, openai.RunRequest{
		AssistantID: s.assistantID,
	})
	if err != nil {
		log.Printf("[OpenAI] Erro ao criar run: %v", err)
		return nil, fmt.Errorf("erro ao criar run: %v", err)
	}
	log.Printf("[OpenAI] Run criado com ID: %s", run.ID)

	// Aguardar a conclusão do run
	log.Printf("[OpenAI] Aguardando processamento do run...")
	for run.Status == openai.RunStatusQueued || run.Status == openai.RunStatusInProgress || run.Status == openai.RunStatusRequiresAction {
		run, err = s.client.RetrieveRun(ctx, threadID, run.ID)
		if err != nil {
			log.Printf("[OpenAI] Erro ao verificar status do run: %v", err)
			return nil, fmt.Errorf("erro ao processar mensagem com OpenAI: %v", err)
		}
		log.Printf("[OpenAI] Status atual do run: %s", run.Status)

		if run.Status == openai.RunStatusRequiresAction {
			log.Printf("[OpenAI] Run requer ação. Respondendo automaticamente...")
			
			// Submeter resposta para todas as ferramentas requeridas
			var toolOutputs []openai.ToolOutput
			for _, tool := range run.RequiredAction.SubmitToolOutputs.ToolCalls {
				if tool.Type == openai.ToolTypeFunction {
					// Salvar os goals no PDI
					if tool.Function.Name == "save_pdi" {
						pdi.Content = tool.Function.Arguments
						if err := s.db.Model(&pdi).Where("id = ?", pdi.ID).Update("content", pdi.Content).Error; err != nil {
							log.Printf("[OpenAI] Erro ao salvar goals do PDI: %v", err)
							return nil, fmt.Errorf("erro ao salvar goals do PDI: %v", err)
						}
						log.Printf("[OpenAI] Goals do PDI salvos com sucesso")
					}

					toolOutputs = append(toolOutputs, openai.ToolOutput{
						ToolCallID: tool.ID,
						Output: "ok", // Resposta automática para todas as ferramentas
					})
				}
			}

			// Submeter as respostas
			run, err = s.client.SubmitToolOutputs(ctx, threadID, run.ID, openai.SubmitToolOutputsRequest{
				ToolOutputs: toolOutputs,
			})
			if err != nil {
				log.Printf("[OpenAI] Erro ao submeter respostas das ferramentas: %v", err)
				return nil, fmt.Errorf("erro ao submeter respostas das ferramentas: %v", err)
			}
			log.Printf("[OpenAI] Respostas das ferramentas submetidas com sucesso")
		}

		time.Sleep(100 * time.Millisecond)
	}

	if run.Status != openai.RunStatusCompleted {
		log.Printf("[OpenAI] Run falhou com status: %s %s", run.Status, run.LastError.Message)
		return nil, fmt.Errorf("erro ao processar com status na OpenAI: %v", run.Status)
	}
	log.Printf("[OpenAI] Run concluído com sucesso")

	// Buscar a última mensagem do assistente
	log.Printf("[OpenAI] Buscando resposta do assistente...")
	numMessages := 1
	iaMessages, err := s.client.ListMessage(ctx, threadID, &numMessages, nil, nil, nil, nil)
	if err != nil {
		log.Printf("[OpenAI] Erro ao buscar mensagem do assistente: %v", err)
		return nil, fmt.Errorf("erro ao buscar mensagem do assistente: %v", err)
	}
	log.Printf("[OpenAI] Resposta do assistente recebida")

	// Criar resposta do assistente
	assistantMessage := &models.Message{
		PDIID:   message.PDIID,
		Content: iaMessages.Messages[0].Content[0].Text.Value,
		Role:    "assistant",
		Status:  models.MessageStatusCompleted,
	}

	// Salvar a resposta no banco de dados
	log.Printf("[OpenAI] Salvando resposta no banco de dados...")
	if err := s.db.Create(assistantMessage).Error; err != nil {
		log.Printf("[OpenAI] Erro ao salvar resposta: %v", err)
		return nil, fmt.Errorf("erro ao salvar resposta: %v", err)
	}
	log.Printf("[OpenAI] Resposta salva com sucesso")

	return assistantMessage, nil
}
