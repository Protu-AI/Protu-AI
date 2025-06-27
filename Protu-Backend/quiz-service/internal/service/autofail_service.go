package service

import (
	"context"
	"log"
	"time"

	"protu.ai/quiz-service/internal/models"
	"protu.ai/quiz-service/internal/repository"
)

type AutoFailService struct {
	attemptRepo *repository.AttemptRepository
	quizRepo    *repository.QuizRepository
	ticker      *time.Ticker
	stopChan    chan bool
}

func NewAutoFailService(
	attemptRepo *repository.AttemptRepository,
	quizRepo *repository.QuizRepository,
) *AutoFailService {
	return &AutoFailService{
		attemptRepo: attemptRepo,
		quizRepo:    quizRepo,
		stopChan:    make(chan bool),
	}
}

// StartAutoFailChecker starts the background task to check for expired attempts
// It runs every minute to check for attempts that have exceeded their time limit
func (s *AutoFailService) StartAutoFailChecker(ctx context.Context) {
	// Check every minute for expired attempts
	s.ticker = time.NewTicker(1 * time.Minute)

	go func() {
		log.Println("Auto-fail service started - checking for expired attempts every minute")

		// Run initial check
		s.checkAndFailExpiredAttempts(ctx)

		for {
			select {
			case <-s.ticker.C:
				s.checkAndFailExpiredAttempts(ctx)
			case <-s.stopChan:
				log.Println("Auto-fail service stopped")
				return
			case <-ctx.Done():
				log.Println("Auto-fail service stopped due to context cancellation")
				return
			}
		}
	}()
}

// StopAutoFailChecker stops the background auto-fail checker
func (s *AutoFailService) StopAutoFailChecker() {
	if s.ticker != nil {
		s.ticker.Stop()
	}
	close(s.stopChan)
}

// checkAndFailExpiredAttempts checks for in-progress attempts that have exceeded their time limit
func (s *AutoFailService) checkAndFailExpiredAttempts(ctx context.Context) {
	// Get all in-progress attempts
	attempts, err := s.attemptRepo.GetExpiredInProgressAttempts(ctx)
	if err != nil {
		log.Printf("Error fetching in-progress attempts: %v", err)
		return
	}

	if len(attempts) == 0 {
		// Log this less frequently to avoid spam
		return
	}

	log.Printf("Found %d in-progress attempts to check for expiration", len(attempts))

	expiredCount := 0
	for _, attempt := range attempts {
		// Get the quiz to check the time limit
		quiz, err := s.quizRepo.GetQuizByID(ctx, attempt.QuizID.Hex())
		if err != nil {
			log.Printf("Error fetching quiz %s for attempt %s: %v", attempt.QuizID.Hex(), attempt.ID.Hex(), err)
			continue
		}

		// Calculate elapsed time for debugging
		elapsed := time.Now().Sub(attempt.StartedAt)

		log.Printf("Checking attempt %s: started at %s, elapsed %.2f minutes, time limit %d minutes + 30s grace",
			attempt.ID.Hex(),
			attempt.StartedAt.Format("15:04:05"),
			elapsed.Minutes(),
			quiz.TimeLimit)

		// Check if the attempt has exceeded the time limit
		if s.isAttemptExpired(attempt, quiz) {
			// Calculate time taken for the failed attempt
			timeTaken := int(time.Now().Sub(attempt.StartedAt).Seconds())

			log.Printf("Attempt %s is EXPIRED - auto-failing now", attempt.ID.Hex())

			// Auto-fail the attempt
			err = s.autoFailAttempt(ctx, attempt, timeTaken)
			if err != nil {
				log.Printf("Error auto-failing attempt %s: %v", attempt.ID.Hex(), err)
				continue
			}

			expiredCount++
			log.Printf("Auto-failed expired attempt %s for user %s on quiz %s (time limit: %d minutes, elapsed: %.2f minutes)",
				attempt.ID.Hex(),
				attempt.UserID,
				quiz.Title,
				quiz.TimeLimit,
				elapsed.Minutes())
		} else {
			log.Printf("Attempt %s is NOT expired yet (%.2f min elapsed, limit is %d min + 0.5 min grace)",
				attempt.ID.Hex(),
				elapsed.Minutes(),
				quiz.TimeLimit)
		}
	}

	if expiredCount > 0 {
		log.Printf("Auto-failed %d expired attempts", expiredCount)
	} else {
		log.Printf("No attempts were expired this check")
	}
}

// isAttemptExpired checks if an attempt has exceeded the quiz time limit
func (s *AutoFailService) isAttemptExpired(attempt *models.QuizAttempt, quiz *models.Quiz) bool {
	// Calculate elapsed time since the attempt started
	elapsed := time.Now().Sub(attempt.StartedAt)

	// Convert quiz time limit from minutes to duration with a 30-second grace period
	// This prevents race conditions where a user might submit just as the time expires
	timeLimit := time.Duration(quiz.TimeLimit)*time.Minute + 30*time.Second

	// Check if elapsed time exceeds the time limit (with grace period)
	return elapsed > timeLimit
}

// autoFailAttempt fails an attempt automatically with score 0
func (s *AutoFailService) autoFailAttempt(ctx context.Context, attempt *models.QuizAttempt, timeTaken int) error {
	now := time.Now()

	// Update the attempt with failure data
	attempt.CompletedAt = now
	attempt.Answers = []models.Answer{} // Empty answers since no submission was made
	attempt.Score = 0.0
	attempt.Passed = false
	attempt.TimeTaken = timeTaken
	attempt.Status = models.AttemptStatusCompleted // Keep as completed since it's a finished attempt, just auto-failed

	// Save the updated attempt
	return s.attemptRepo.UpdateAttempt(ctx, attempt)
}
