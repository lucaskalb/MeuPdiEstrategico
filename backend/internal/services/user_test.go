package services

import (
	"testing"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"meu-pdi-estrategico/backend/internal/models"
)

func setupTestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&models.User{})

	return db
}

func TestUserService_CreateUser(t *testing.T) {
	db := setupTestDB()
	service := NewUserService(db)

	tests := []struct {
		name        string
		email       string
		password    string
		nickname    string
		wantErr     bool
		expectedErr error
	}{
		{
			name:        "Criar usuário válido",
			email:       "teste@exemplo.com",
			password:    "Senha@123",
			nickname:    "teste",
			wantErr:     false,
			expectedErr: nil,
		},
		{
			name:        "Email inválido",
			email:       "emailinvalido",
			password:    "Senha@123",
			nickname:    "teste",
			wantErr:     true,
			expectedErr: ErrInvalidEmail,
		},
		{
			name:        "Senha inválida",
			email:       "teste@exemplo.com",
			password:    "senhafraca",
			nickname:    "teste",
			wantErr:     true,
			expectedErr: ErrInvalidPassword,
		},
		{
			name:        "Nickname inválido",
			email:       "teste@exemplo.com",
			password:    "Senha@123",
			nickname:    "a",
			wantErr:     true,
			expectedErr: ErrInvalidNickname,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			user, err := service.CreateUser(tt.email, tt.password, tt.nickname)

			if tt.wantErr {
				if err == nil {
					t.Errorf("CreateUser() error = %v, wantErr %v", err, tt.wantErr)
				}
				if err != tt.expectedErr {
					t.Errorf("CreateUser() error = %v, expectedErr %v", err, tt.expectedErr)
				}
			} else {
				if err != nil {
					t.Errorf("CreateUser() error = %v, wantErr %v", err, tt.wantErr)
				}
				if user.Email != tt.email {
					t.Errorf("CreateUser() email = %v, want %v", user.Email, tt.email)
				}
				if user.Nickname != tt.nickname {
					t.Errorf("CreateUser() nickname = %v, want %v", user.Nickname, tt.nickname)
				}
			}
		})
	}
}

func TestUserService_GetUserByEmail(t *testing.T) {
	db := setupTestDB()
	service := NewUserService(db)

	_, err := service.CreateUser("teste@exemplo.com", "Senha@123", "teste")
	if err != nil {
		t.Fatalf("Erro ao criar usuário para teste: %v", err)
	}

	tests := []struct {
		name        string
		email       string
		wantErr     bool
		expectedErr error
	}{
		{
			name:        "Usuário existente",
			email:       "teste@exemplo.com",
			wantErr:     false,
			expectedErr: nil,
		},
		{
			name:        "Usuário não existente",
			email:       "naoexiste@exemplo.com",
			wantErr:     true,
			expectedErr: ErrUserNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			user, err := service.GetUserByEmail(tt.email)

			if tt.wantErr {
				if err == nil {
					t.Errorf("GetUserByEmail() error = %v, wantErr %v", err, tt.wantErr)
				}
				if err != tt.expectedErr {
					t.Errorf("GetUserByEmail() error = %v, expectedErr %v", err, tt.expectedErr)
				}
			} else {
				if err != nil {
					t.Errorf("GetUserByEmail() error = %v, wantErr %v", err, tt.wantErr)
				}
				if user.Email != tt.email {
					t.Errorf("GetUserByEmail() email = %v, want %v", user.Email, tt.email)
				}
			}
		})
	}
} 
