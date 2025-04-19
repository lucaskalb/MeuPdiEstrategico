package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"meu-pdi-estrategico/backend/internal/services"
)

type UserHandler struct {
	userService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Nickname string `json:"nickname"`
}

type RegisterResponse struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Nickname string `json:"nickname"`
}

func (h *UserHandler) Register(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "dados inválidos",
		})
	}

	user, err := h.userService.CreateUser(req.Email, req.Password, req.Nickname)
	if err != nil {
		switch err {
		case services.ErrInvalidEmail:
			return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
				"error": "email inválido",
			})
		case services.ErrInvalidPassword:
			return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
				"error": "senha inválida. A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
			})
		case services.ErrInvalidNickname:
			return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
				"error": "nickname inválido. O nickname deve ter pelo menos 2 caracteres",
			})
		case services.ErrUserAlreadyExists:
			return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
				"error": "usuário já existe",
			})
		default:
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "erro ao criar usuário",
			})
		}
	}

	return c.Status(http.StatusCreated).JSON(RegisterResponse{
		ID:       user.ID.String(),
		Email:    user.Email,
		Nickname: user.Nickname,
	})
} 