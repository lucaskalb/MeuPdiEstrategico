package models

import (
	"testing"

	"github.com/google/uuid"
)

func TestUser_BeforeCreate(t *testing.T) {
	user := &User{}
	err := user.BeforeCreate(nil)
	if err != nil {
		t.Errorf("BeforeCreate() error = %v", err)
	}
	if user.ID == uuid.Nil {
		t.Error("ID não foi gerado")
	}
} 