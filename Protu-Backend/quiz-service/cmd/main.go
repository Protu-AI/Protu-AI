package main

import (
	"context"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"protu.ai/quiz-service/cmd/api/handlers"
	"protu.ai/quiz-service/cmd/api/routes"
	"protu.ai/quiz-service/config"
	"protu.ai/quiz-service/internal/db"
	"protu.ai/quiz-service/internal/middleware"
	"protu.ai/quiz-service/internal/repository"
	"protu.ai/quiz-service/internal/service"
)

func main() {
	cfg, err := config.LoadConfig(".")
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	log.Printf("Connecting to MongoDB at %s...", cfg.MongoURI)
	client, err := db.ConnectMongoDB(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	defer client.Disconnect(ctx)

	database := client.Database(cfg.MongoDB)

	if err := db.RunMigrations(client, cfg.MongoDB); err != nil {
		log.Fatalf("Failed to run database migrations: %v", err)
	}

	quizRepo := repository.NewQuizRepository(database)
	attemptRepo := repository.NewAttemptRepository(database)
	attemptResultRepo := repository.NewAttemptResultRepository(database)
	userRepo := repository.NewUserRepository(database)

	courseRepo, err := repository.NewCourseRepository(&cfg)
	if err != nil {
		log.Printf("WARNING: Failed to initialize course repository: %v", err)
		log.Printf("Course recommendations will not be available")
		courseRepo = nil
	} else {
		defer courseRepo.Close()
	}

	quizService := service.NewQuizService(quizRepo)
	attemptService := service.NewAttemptService(attemptRepo, quizRepo)
	dashboardService := service.NewDashboardService(quizRepo, attemptRepo)
	aiService := service.NewAIService(&cfg)

	autoFailService := service.NewAutoFailService(attemptRepo, quizRepo)

	rabbitmqURL := cfg.RabbitMQURL
	rabbitMQService := service.NewRabbitMQService(rabbitmqURL, userRepo)

	err = rabbitMQService.Connect()
	if err != nil {
		log.Printf("Warning: Failed to connect to RabbitMQ: %v", err)
		log.Println("Continuing without RabbitMQ user event listening...")
	} else {
		err = rabbitMQService.StartListening()
		if err != nil {
			log.Printf("Warning: Failed to start RabbitMQ listener: %v", err)
		} else {
			log.Println("RabbitMQ user event listener started successfully")
		}
	}

	quizService.SetAttemptRepo(attemptRepo)
	quizHandler := handlers.NewQuizHandler(quizService, aiService)
	attemptHandler := handlers.NewAttemptHandler(attemptService, quizService, aiService, courseRepo, attemptResultRepo)
	dashboardHandler := handlers.NewDashboardHandler(dashboardService)

	router := gin.New()

	router.Use(gin.Logger())
	router.Use(middleware.ErrorHandler())

	routes.SetupRoutes(router, &cfg, quizHandler, attemptHandler, dashboardHandler)

	appCtx := context.Background()
	autoFailService.StartAutoFailChecker(appCtx)
	defer autoFailService.StopAutoFailChecker()

	log.Println("Auto-fail service for expired quiz attempts has been started")

	log.Printf("Starting quiz service on %s", cfg.HTTPServerAddress)
	if err := router.Run(cfg.HTTPServerAddress); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
