package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MessageStatus string

const (
	MessageStatusPending   MessageStatus = "pending"
	MessageStatusCompleted MessageStatus = "completed"
	MessageStatusFailed    MessageStatus = "failed"
)

type Message struct {
	ID        uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	PDIID     string         `gorm:"not null" json:"pdi_id"`
	Content   string         `gorm:"type:text;not null" json:"content"`
	Role      string         `gorm:"not null" json:"role"`
	Status    MessageStatus  `gorm:"type:varchar(20);not null;default:'pending'" json:"status"`
	CreatedAt time.Time      `gorm:"not null" json:"created_at"`
	UpdatedAt time.Time      `gorm:"not null" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (m *Message) BeforeCreate(tx *gorm.DB) error {
	if m.ID == uuid.Nil {
		m.ID = uuid.New()
	}
	return nil
} 
