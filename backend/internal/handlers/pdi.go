package handlers

import (
	"meu-pdi-estrategico/backend/internal/services"

	"github.com/gofiber/fiber/v2"
)

type PDIHandler struct {
	pdiService *services.PDIService
}

func NewPDIHandler(pdiService *services.PDIService) *PDIHandler {
	return &PDIHandler{pdiService: pdiService}
}

func (h *PDIHandler) GetUserPDIs(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(string)
	if userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "usuário não autenticado",
		})
	}

	pdis, err := h.pdiService.GetUserPDIs(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(pdis)
}

func (h *PDIHandler) CreatePDI(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(string)
	if userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "usuário não autenticado",
		})
	}

	var req services.CreatePDIRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	pdi, err := h.pdiService.CreatePDI(userID, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(pdi)
}

func (h *PDIHandler) UpdatePDI(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(string)
	if userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "usuário não autenticado",
		})
	}

	pdiID := c.Params("id")
	if pdiID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ID do PDI não fornecido",
		})
	}

	var req services.UpdatePDIRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	pdi, err := h.pdiService.UpdatePDI(userID, pdiID, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(pdi)
}

func (h *PDIHandler) GetPDIByID(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(string)
	if userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "usuário não autenticado",
		})
	}

	pdiID := c.Params("id")
	if pdiID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ID do PDI não fornecido",
		})
	}

	pdi, err := h.pdiService.GetPDIByID(userID, pdiID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(pdi)
} 