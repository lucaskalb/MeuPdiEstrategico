package handlers

import (
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func (h *UserHandler) Login(c *fiber.Ctx) error {
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

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  user.ID,
		"email":    user.Email,
		"nickname": user.Nickname,
		"exp":      time.Now().Add(time.Hour * 1).Unix(),
	})

	tokenString, err := token.SignedString([]byte("seu-segredo-super-secreto"))
	if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Erro ao gerar token",
			})
	}

	return c.Status(http.StatusCreated).JSON(LoginResponse{
    Token: tokenString,
	})
} 
