package routes

import (
	"testing"

	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"meu-pdi-estrategico/backend/internal/services"
)

func TestSetupUserRoutes(t *testing.T) {
	app := fiber.New()
	
	// Configurar banco de dados em memória para testes
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Erro ao conectar com o banco de dados: %v", err)
	}

	userService := services.NewUserService(db)
	SetupUserRoutes(app, userService)

	// Verificar se as rotas foram configuradas
	if len(app.Stack()) == 0 {
		t.Error("Nenhuma rota foi configurada")
	}
} 