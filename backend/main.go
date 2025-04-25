package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"meu-pdi-estrategico/backend/internal/handlers"
	"meu-pdi-estrategico/backend/internal/middleware"
	"meu-pdi-estrategico/backend/internal/routes"
	"meu-pdi-estrategico/backend/internal/services"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func loadEnv() error {
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}

	if err := godotenv.Load(fmt.Sprintf(".env.%s", env)); err != nil {
		if err := godotenv.Load(); err != nil {
			return fmt.Errorf("erro ao carregar arquivo .env: %v", err)
		}
	}
	return nil
}

func setupDatabase() (*gorm.DB, error) {
	gormLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_SSL_MODE"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger:      gormLogger,
		PrepareStmt: true,
		NowFunc: func() time.Time {
			return time.Now().UTC()
		},
	})

	if err != nil {
		return nil, fmt.Errorf("erro ao conectar com o banco de dados: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("erro ao obter conexão SQL: %v", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("Conexão com o banco de dados estabelecida com sucesso")
	log.Println("Nota: Execute './migrate.sh up' para aplicar as migrações do banco de dados")
	return db, nil
}

func main() {
	if err := loadEnv(); err != nil {
		log.Fatalf("Erro ao carregar variáveis de ambiente: %v", err)
	}

	app := fiber.New(fiber.Config{
		AppName:      "Meu PDI Estratégico",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
		MaxAge:           300,
	}))

	db, err := setupDatabase()
	if err != nil {
		log.Fatal(err)
	}

	userService := services.NewUserService(db)
	pdiService := services.NewPDIService(db)
	chatService := services.NewChatService(db)
	openaiService := services.NewOpenAIService(db)

	// Configurar middleware de autenticação
	middleware.SetJWTSecret(os.Getenv("JWT_SECRET"))

	routes.SetupAuthRoutes(app, handlers.NewLoginHandler(userService))
	routes.SetupUserRoutes(app, userService)
	routes.SetupPDIRoutes(app, handlers.NewPDIHandler(pdiService))
	routes.SetupChatRoutes(app, handlers.NewChatHandler(chatService, openaiService, pdiService))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Servidor iniciado na porta %s", port)
	log.Fatal(app.Listen(fmt.Sprintf(":%s", port)))
}
