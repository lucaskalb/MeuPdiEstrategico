package routes

import (
	"meu-pdi-estrategico/backend/internal/handlers"
	"meu-pdi-estrategico/backend/internal/services"

	"github.com/gofiber/fiber/v2"
)

func SetupUserRoutes(app *fiber.App, userService *services.UserService) {
	userHandler := handlers.NewUserHandler(userService)

	userGroup := app.Group("/api/users")
	userGroup.Post("/register", userHandler.Register)
	userGroup.Post("/login", userHandler.Login)
} 
