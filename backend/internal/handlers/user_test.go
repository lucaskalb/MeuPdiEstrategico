package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"meu-pdi-estrategico/backend/internal/models"
	"meu-pdi-estrategico/backend/internal/services"
)

func setupTestApp() *fiber.App {
	app := fiber.New()
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&models.User{})
	userService := services.NewUserService(db)
	userHandler := NewUserHandler(userService)

	app.Post("/api/users/register", userHandler.Register)

	return app
}

func TestUserHandler_Register(t *testing.T) {
	app := setupTestApp()

	tests := []struct {
		name           string
		payload        map[string]string
		expectedStatus int
		expectedError  string
	}{
		{
			name: "Registro bem-sucedido",
			payload: map[string]string{
				"email":    "teste@exemplo.com",
				"password": "Senha@123",
				"nickname": "teste",
			},
			expectedStatus: http.StatusCreated,
			expectedError:  "",
		},
		{
			name: "Email inválido",
			payload: map[string]string{
				"email":    "emailinvalido",
				"password": "Senha@123",
				"nickname": "teste",
			},
			expectedStatus: http.StatusUnprocessableEntity,
			expectedError:  "email inválido",
		},
		{
			name: "Senha inválida",
			payload: map[string]string{
				"email":    "teste@exemplo.com",
				"password": "senhafraca",
				"nickname": "teste",
			},
			expectedStatus: http.StatusUnprocessableEntity,
			expectedError:  "senha inválida. A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
		},
		{
			name: "Nickname inválido",
			payload: map[string]string{
				"email":    "teste@exemplo.com",
				"password": "Senha@123",
				"nickname": "a",
			},
			expectedStatus: http.StatusUnprocessableEntity,
			expectedError:  "nickname inválido. O nickname deve ter pelo menos 2 caracteres",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			payload, _ := json.Marshal(tt.payload)
			req := httptest.NewRequest(http.MethodPost, "/api/users/register", bytes.NewBuffer(payload))
			req.Header.Set("Content-Type", "application/json")

			resp, err := app.Test(req)
			if err != nil {
				t.Fatalf("Erro ao fazer requisição: %v", err)
			}

			if resp.StatusCode != tt.expectedStatus {
				t.Errorf("Status esperado %v, recebido %v", tt.expectedStatus, resp.StatusCode)
			}

			if tt.expectedError != "" {
				var response map[string]string
				if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
					t.Fatalf("Erro ao decodificar resposta: %v", err)
				}

				if response["error"] != tt.expectedError {
					t.Errorf("Erro esperado '%v', recebido '%v'", tt.expectedError, response["error"])
				}
			} else {
				var response RegisterResponse
				if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
					t.Fatalf("Erro ao decodificar resposta: %v", err)
				}

				if response.Email != tt.payload["email"] {
					t.Errorf("Email esperado %v, recebido %v", tt.payload["email"], response.Email)
				}
				if response.Nickname != tt.payload["nickname"] {
					t.Errorf("Nickname esperado %v, recebido %v", tt.payload["nickname"], response.Nickname)
				}
			}
		})
	}
} 