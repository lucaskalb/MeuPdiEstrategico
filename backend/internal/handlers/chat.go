package handlers

import (
	"meu-pdi-estrategico/backend/internal/models"
	"meu-pdi-estrategico/backend/internal/services"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type ChatHandler struct {
	chatService   *services.ChatService
	openaiService *services.OpenAIService
	pdiService    *services.PDIService
}

func NewChatHandler(chatService *services.ChatService, openaiService *services.OpenAIService, pdiService *services.PDIService) *ChatHandler {
	return &ChatHandler{
		chatService:   chatService,
		openaiService: openaiService,
		pdiService:    pdiService,
	}
}

type RequestChat struct {
	Content string `json:"content"`
	Role    string `json:"role"`
}

type ResponseChat struct {
	ID        uuid.UUID `json:"id"`
	Content   string    `json:"content"`
	Role      string    `json:"role"`
	Status    string    `json:"status"`
	CreatedAt string    `json:"created_at"`
}

type ResponseChatList struct {
	Messages []ResponseChat `json:"messages"`
}

func (h *ChatHandler) CreateMessage(c *fiber.Ctx) error {
	pdiID := c.Params("id")
	if pdiID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ID do PDI é obrigatório",
		})
	}

	userID := c.Locals("user_id").(string)
	if userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Usuário não autenticado",
		})
	}

	// Validar se o PDI existe e está ativo
	pdi, err := h.pdiService.GetPDIByID(userID, pdiID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "PDI não encontrado",
		})
	}

	if !pdi.Activated {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "PDI não está ativo",
		})
	}

	var request RequestChat
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Erro ao processar a mensagem",
		})
	}

	// Criar mensagem do usuário
	userMessage := &models.Message{
		PDIID:   pdiID,
		Content: request.Content,
		Role:    request.Role,
	}

	// Salvar mensagem do usuário
	createdMessage, err := h.chatService.CreateMessage(userMessage)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao criar mensagem",
		})
	}

	// Processar mensagem com OpenAI
	assistantMessage, err := h.openaiService.ProcessMessage(c.Context(), userMessage, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao processar mensagem com OpenAI",
		})
	}

	// Retornar ambas as mensagens
	response := []ResponseChat{
		{
			ID:        createdMessage.ID,
			Content:   createdMessage.Content,
			Role:      createdMessage.Role,
			Status:    string(createdMessage.Status),
			CreatedAt: createdMessage.CreatedAt.Format("2006-01-02 15:04:05"),
		},
		{
			ID:        assistantMessage.ID,
			Content:   assistantMessage.Content,
			Role:      assistantMessage.Role,
			Status:    string(assistantMessage.Status),
			CreatedAt: assistantMessage.CreatedAt.Format("2006-01-02 15:04:05"),
		},
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}

func (h *ChatHandler) GetMessages(c *fiber.Ctx) error {
	pdiID := c.Params("id")
	if pdiID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ID do PDI é obrigatório",
		})
	}

	userID := c.Locals("user_id").(string)
	if userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Usuário não autenticado",
		})
	}

	// Validar se o PDI existe e está ativo
	pdi, err := h.pdiService.GetPDIByID(userID, pdiID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "PDI não encontrado",
		})
	}

	if !pdi.Activated {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "PDI não está ativo",
		})
	}

	messages, err := h.chatService.GetMessagesByPDIID(pdiID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao buscar mensagens",
		})
	}

	response := ResponseChatList{
		Messages: make([]ResponseChat, len(messages)),
	}

	for i, msg := range messages {
		response.Messages[i] = ResponseChat{
			ID:        msg.ID,
			Content:   msg.Content,
			Role:      msg.Role,
			Status:    string(msg.Status),
			CreatedAt: msg.CreatedAt.Format("2006-01-02 15:04:05"),
		}
	}

	return c.Status(fiber.StatusOK).JSON(response)
} 
