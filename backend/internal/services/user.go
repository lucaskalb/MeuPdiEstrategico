package services

import (
	"errors"
	"regexp"
	"time"
	"unicode"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"meu-pdi-estrategico/backend/internal/models"
)

var (
	ErrInvalidEmail       = errors.New("email inválido")
	ErrInvalidPassword    = errors.New("senha inválida")
	ErrInvalidNickname    = errors.New("nickname inválido")
	ErrUserAlreadyExists  = errors.New("usuário já existe")
	ErrUserNotFound       = errors.New("usuário não encontrado")
	ErrUserNotActivated   = errors.New("usuário não ativado")
	ErrAccountLocked      = errors.New("conta bloqueada temporariamente")
)

type UserService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{db: db}
}

func (s *UserService) validateEmail(email string) error {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(email) {
		return ErrInvalidEmail
	}
	return nil
}

func (s *UserService) validatePassword(password string) error {
	var (
		hasMinLen  = false
		hasUpper   = false
		hasLower   = false
		hasNumber  = false
		hasSpecial = false
	)

	if len(password) >= 8 {
		hasMinLen = true
	}

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	if !hasMinLen || !hasUpper || !hasLower || !hasNumber || !hasSpecial {
		return ErrInvalidPassword
	}

	return nil
}

func (s *UserService) validateNickname(nickname string) error {
	if len(nickname) < 2 {
		return ErrInvalidNickname
	}
	return nil
}

func (s *UserService) hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

func (s *UserService) CreateUser(email, password, nickname string) (*models.User, error) {
	// Validar campos
	if err := s.validateEmail(email); err != nil {
		return nil, err
	}

	if err := s.validatePassword(password); err != nil {
		return nil, err
	}

	if err := s.validateNickname(nickname); err != nil {
		return nil, err
	}

	var existingUser models.User
	result := s.db.Where("email = ? AND activated", email).First(&existingUser)
	if result.Error == nil {
		return nil, ErrUserAlreadyExists
	}
	if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, result.Error
	}

	hashedPassword, err := s.hashPassword(password)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:     email,
		Password:  hashedPassword,
		Nickname:  nickname,
		Activated: true,
	}

	if err := s.db.Create(user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	result := s.db.Where("email = ? AND activated", email).First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, result.Error
	}

	if !user.Activated {
		return nil, ErrUserNotActivated
	}

	if user.AccountLockedUntil != nil && user.AccountLockedUntil.After(time.Now()) {
		return nil, ErrAccountLocked
	}

	return &user, nil
} 
