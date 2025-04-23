package services

import (
	"context"
	"fmt"
	"meu-pdi-estrategico/backend/internal/models"
	"os"

	openai "github.com/sashabaranov/go-openai"
	"gorm.io/gorm"
)

type OpenAIService struct {
	client *openai.Client
	db     *gorm.DB
}

func NewOpenAIService(db *gorm.DB) *OpenAIService {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		panic("OPENAI_API_KEY não configurada")
	}

	client := openai.NewClient(apiKey)
	return &OpenAIService{
		client: client,
		db:     db,
	}
}

func (s *OpenAIService) ProcessMessage(ctx context.Context, message *models.Message) (*models.Message, error) {
	// Buscar histórico de mensagens do PDI
	var messages []*models.Message
	if err := s.db.Where("pdi_id = ? AND deleted_at IS NULL", message.PDIID).
		Order("created_at ASC").
		Find(&messages).Error; err != nil {
		return nil, fmt.Errorf("erro ao buscar histórico: %v", err)
	}

	// Preparar mensagens para a OpenAI
	openaiMessages := make([]openai.ChatCompletionMessage, 0)
	
	// Adicionar mensagens do histórico
	for _, msg := range messages {
		role := openai.ChatMessageRoleUser
		if msg.Role == "assistant" {
			role = openai.ChatMessageRoleAssistant
		}
		openaiMessages = append(openaiMessages, openai.ChatCompletionMessage{
			Role:    role,
			Content: msg.Content,
		})
	}

	// Adicionar a nova mensagem do usuário
	openaiMessages = append(openaiMessages, openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleUser,
		Content: message.Content,
	})

	// Configurar e fazer a chamada para a OpenAI
	resp, err := s.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model:    openai.GPT4TurboPreview,
			Messages: openaiMessages,
			Temperature: 0.7,
			MaxTokens: 1000,
		},
	)
	if err != nil {
		return nil, fmt.Errorf("erro ao processar mensagem com OpenAI: %v", err)
	}

	// Criar resposta do assistente
	assistantMessage := &models.Message{
		PDIID:     message.PDIID,
		Content:   resp.Choices[0].Message.Content,
		Role:      "assistant",
		Status:    models.MessageStatusCompleted,
	}

	// Salvar a resposta no banco de dados
	if err := s.db.Create(assistantMessage).Error; err != nil {
		return nil, fmt.Errorf("erro ao salvar resposta: %v", err)
	}

	return assistantMessage, nil
} 
