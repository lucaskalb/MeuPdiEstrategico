package services

import (
	"errors"
	"meu-pdi-estrategico/backend/internal/models"

	"gorm.io/gorm"
)

type PDIService struct {
	db *gorm.DB
}

func NewPDIService(db *gorm.DB) *PDIService {
	return &PDIService{db: db}
}

type CreatePDIRequest struct {
	Name   string      `json:"name" binding:"required"`
	Status models.PDIStatus `json:"status" binding:"required"`
}

type UpdatePDIRequest struct {
	Name string `json:"name" binding:"required"`
}

func (s *PDIService) CreatePDI(userID string, req CreatePDIRequest) (*models.PDI, error) {
	pdi := &models.PDI{
		Name:   req.Name,
		UserID: userID,
		Status: req.Status,
    Content: "{}",
	}

	if err := s.db.Create(pdi).Error; err != nil {
		return nil, err
	}

	return pdi, nil
}

func (s *PDIService) GetUserPDIs(userID string) ([]models.PDI, error) {
	var pdis []models.PDI
	if err := s.db.Where("user_id = ? AND activated = ?", userID, true).Find(&pdis).Error; err != nil {
		return nil, err
	}
	return pdis, nil
}

func (s *PDIService) UpdatePDI(userID, pdiID string, req UpdatePDIRequest) (*models.PDI, error) {
	var pdi models.PDI
	if err := s.db.Where("id = ? AND user_id = ? AND activated = ?", pdiID, userID, true).First(&pdi).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("PDI não encontrado")
		}
		return nil, err
	}

	pdi.Name = req.Name
	if err := s.db.Save(&pdi).Error; err != nil {
		return nil, err
	}

	return &pdi, nil
}

func (s *PDIService) GetPDIByID(userID, pdiID string) (*models.PDI, error) {
	var pdi models.PDI
	if err := s.db.Where("id = ? AND user_id = ? AND activated = ?", pdiID, userID, true).First(&pdi).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("PDI não encontrado")
		}
		return nil, err
	}
	return &pdi, nil
} 
