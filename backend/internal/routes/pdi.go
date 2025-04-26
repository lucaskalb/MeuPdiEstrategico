package routes

import (
	"meu-pdi-estrategico/backend/internal/handlers"
	"meu-pdi-estrategico/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupPDIRoutes(app *fiber.App, pdiHandler *handlers.PDIHandler) {
	pdiGroup := app.Group("/api/pdis", middleware.AuthMiddleware())
	
	pdiGroup.Get("", pdiHandler.GetUserPDIs)
	pdiGroup.Post("", pdiHandler.CreatePDI)
	pdiGroup.Get("/:id", pdiHandler.GetPDIByID)
	pdiGroup.Patch("/:id", pdiHandler.UpdatePDI)
	pdiGroup.Delete("/:id", pdiHandler.DeletePDI)
} 