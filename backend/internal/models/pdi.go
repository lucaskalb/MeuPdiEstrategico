package models

import (
	"time"

	"gorm.io/gorm"
	"github.com/google/uuid"
	"errors"
	"fmt"
)

type PDIStatus string

const (
	PDIStatusDraft      PDIStatus = "DRAFT"
	PDIStatusPending    PDIStatus = "PENDING"
	PDIStatusInProgress PDIStatus = "IN_PROGRESS"
	PDIStatusDone       PDIStatus = "DONE"
)

type PDI struct {
	ID        string     `gorm:"type:uuid;primary_key" json:"id"`
	Name      string     `gorm:"type:text;not null" json:"name"`
	UserID    string     `gorm:"type:uuid;not null" json:"user_id"`
	Activated bool       `gorm:"default:true" json:"activated"`
	Status    PDIStatus  `gorm:"type:varchar(20);not null;default:'DRAFT'" json:"status"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `gorm:"index" json:"deleted_at,omitempty"`
}

func (p *PDI) BeforeCreate(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = uuid.New().String()
	}
	return nil
}

func (p *PDI) BeforeSave(tx *gorm.DB) error {
	if p.Name == "" {
		return errors.New("nome é obrigatório")
	}

	if p.UserID == "" {
		return errors.New("ID do usuário é obrigatório")
	}

	// Verifica se já existe um PDI ativo com o mesmo nome para o mesmo usuário
	var count int64
	query := tx.Model(&PDI{}).Where("name = ? AND user_id = ? AND activated = true", p.Name, p.UserID)
	
	// Só adiciona a condição do ID se ele não estiver vazio
	if p.ID != "" {
		query = query.Where("id != ?", p.ID)
	}
	
	if err := query.Count(&count).Error; err != nil {
		return fmt.Errorf("erro ao verificar PDI existente: %v", err)
	}

	if count > 0 {
		return errors.New("já existe um PDI ativo com este nome")
	}

	return nil
} 
