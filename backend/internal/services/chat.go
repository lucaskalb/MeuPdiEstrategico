package services

import (
	"fmt"
	"meu-pdi-estrategico/backend/internal/models"

	"gorm.io/gorm"
)

type ChatService struct {
	db *gorm.DB
}

func NewChatService(db *gorm.DB) *ChatService {
	return &ChatService{
		db: db,
	}
}

func (s *ChatService) CreateMessage(message *models.Message) (*models.Message, error) {
	if err := s.db.Create(message).Error; err != nil {
		return nil, fmt.Errorf("erro ao criar mensagem: %v", err)
	}

	return message, nil
}

func (s *ChatService) GetMessagesByPDIID(pdiID string) ([]*models.Message, error) {
	var messages []*models.Message
	if err := s.db.Where("pdi_id = ? AND deleted_at IS NULL", pdiID).
		Order("created_at ASC").
		Find(&messages).Error; err != nil {
		return nil, fmt.Errorf("erro ao buscar mensagens: %v", err)
	}

	return messages, nil
}

func (s *ChatService) UpdateMessageStatus(messageID string, status models.MessageStatus) error {
	if err := s.db.Model(&models.Message{}).
		Where("id = ?", messageID).
		Update("status", status).Error; err != nil {
		return fmt.Errorf("erro ao atualizar status da mensagem: %v", err)
	}

	return nil
}

