package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"meu-pdi-estrategico/backend/internal/models"
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

	// Tenta carregar o arquivo .env específico do ambiente
	if err := godotenv.Load(fmt.Sprintf(".env.%s", env)); err != nil {
		// Se não encontrar, tenta carregar o .env padrão
		if err := godotenv.Load(); err != nil {
			return fmt.Errorf("erro ao carregar arquivo .env: %v", err)
		}
	}
	return nil
}

func setupDatabase() (*gorm.DB, error) {
	// Configurar logger do GORM
	gormLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	// Construir DSN a partir das variáveis de ambiente
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_SSL_MODE"),
	)

	// Configurar conexão com o banco de dados
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: gormLogger,
		// Configurações de pool de conexões
		PrepareStmt: true,
		// Timeout para operações
		NowFunc: func() time.Time {
			return time.Now().UTC()
		},
	})

	if err != nil {
		return nil, fmt.Errorf("erro ao conectar com o banco de dados: %v", err)
	}

	// Configurar pool de conexões
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("erro ao obter conexão SQL: %v", err)
	}

	// Configurar pool de conexões
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// Migrar esquema
	if err := db.AutoMigrate(&models.User{}); err != nil {
		return nil, fmt.Errorf("erro ao migrar esquema: %v", err)
	}

	log.Println("Conexão com o banco de dados estabelecida com sucesso")
	return db, nil
}

func main() {
	// Carregar variáveis de ambiente
	if err := loadEnv(); err != nil {
		log.Fatalf("Erro ao carregar variáveis de ambiente: %v", err)
	}

	// Configurar aplicação Fiber
	app := fiber.New(fiber.Config{
		AppName:      "Meu PDI Estratégico",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	})

	// Configurar CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Configurar banco de dados
	db, err := setupDatabase()
	if err != nil {
		log.Fatal(err)
	}

	// Inicializar serviços
	userService := services.NewUserService(db)

	// Configurar rotas
	routes.SetupUserRoutes(app, userService)

	// Iniciar servidor
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Servidor iniciado na porta %s", port)
	log.Fatal(app.Listen(fmt.Sprintf(":%s", port)))
} 