package routes

import (
	"meu-pdi-estrategico/backend/internal/handlers"
	"meu-pdi-estrategico/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupAuthRoutes(app *fiber.App, authHandler *handlers.LoginHandler) {
	authGroup := app.Group("/api/auth")
	
	authGroup.Post("/login", authHandler.Login)
	authGroup.Get("/refresh", middleware.AuthMiddleware(), authHandler.RefreshToken)
} 
