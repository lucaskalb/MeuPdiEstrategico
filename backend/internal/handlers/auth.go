package handlers

import (
	"meu-pdi-estrategico/backend/internal/models"
	"meu-pdi-estrategico/backend/internal/services"
	"net/http"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type LoginHandler struct {
	userService *services.UserService
}

func NewLoginHandler(userService *services.UserService) *LoginHandler {
	return &LoginHandler{userService: userService}
}

func (h *LoginHandler) Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Dados inválidos",
		})
	}

	user, err := h.userService.GetUserByEmail(req.Email)
	if err != nil {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "E-mail incorreto",
		})
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Senha incorreta",
		})
	}

	return generateToken(c, user)
}

func (h *LoginHandler) RefreshToken(c *fiber.Ctx) error {
	requestUserID := c.Locals("user_id").(string)
	if requestUserID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Usuário não autenticado",
		})
	}

	userID, err := uuid.Parse(requestUserID)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "ID de usuário não reconhecido",
		})
	}

	user, err := h.userService.GetUserById(userID)
	if err != nil {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Usuário não encontrado",
		})
	}

  return generateToken(c, user);
}

func generateToken(c *fiber.Ctx, user *models.User) error {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  user.ID,
		"email":    user.Email,
		"nickname": user.Nickname,
		"exp":      time.Now().Add(time.Hour * 1).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao gerar token",
		})
	}

	return c.Status(http.StatusCreated).JSON(LoginResponse{
		Token: tokenString,
	})
}
 