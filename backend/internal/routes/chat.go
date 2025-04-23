
package routes

import (
	"meu-pdi-estrategico/backend/internal/handlers"
	"meu-pdi-estrategico/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupChatRoutes(app *fiber.App, handler *handlers.ChatHandler) {
	pdiGroup := app.Group("/api/pdis", middleware.AuthMiddleware())
	
	pdiGroup.Get("/:id/chat", handler.GetMessages)
	pdiGroup.Post("/:id/chat", handler.CreateMessage)
} 
