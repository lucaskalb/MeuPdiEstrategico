package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID                  uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	Nickname            string         `gorm:"type:text;not null" json:"nickname"`
	Password            string         `gorm:"type:text;not null" json:"-"`
	Email               string         `gorm:"type:text;not null;uniqueIndex:idx_user_email_deleted" json:"email"`
	CreatedAt           time.Time      `json:"created_at"`
	UpdatedAt           time.Time      `json:"updated_at"`
	DeletedAt           gorm.DeletedAt `json:"-"`
	Activated           bool           `gorm:"default:true" json:"activated"`
	EmailVerified       bool           `gorm:"default:false" json:"email_verified"`
	VerificationToken   string         `json:"-"`
	LastLogin           *time.Time     `json:"last_login"`
	FailedLoginAttempts int            `gorm:"default:0" json:"-"`
	AccountLockedUntil  *time.Time     `json:"-"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
} 
