package service

import (
	"context"
	"sort"
	"strings"

	"protu.ai/quiz-service/internal/models"
	"protu.ai/quiz-service/internal/repository"
)

type DashboardService struct {
	quizRepo    *repository.QuizRepository
	attemptRepo *repository.AttemptRepository
}

type QuizCard struct {
	ID        string  `json:"id"`
	Title     string  `json:"title"`
	Topic     string  `json:"topic"`
	Score     float64 `json:"score"`
	DateTaken string  `json:"dateTaken"`
	TimeTaken int     `json:"timeTaken"`
}

type QuizList struct {
	Quizzes    []QuizCard         `json:"quizzes"`
	Pagination PaginationMetadata `json:"pagination"`
}

type DashboardSummary struct {
	TotalQuizzes   int     `json:"totalQuizzes"`
	AverageScore   float64 `json:"averageScore"`
	SuccessRate    float64 `json:"successRate"`
	DraftedQuizzes int     `json:"draftedQuizzes"`
}

type PaginationMetadata struct {
	CurrentPage int `json:"currentPage"`
	PageSize    int `json:"pageSize"`
	TotalItems  int `json:"totalItems"`
	TotalPages  int `json:"totalPages"`
}

type FilterOptions struct {
	Page      int    `json:"page"`
	PageSize  int    `json:"pageSize"`
	SortBy    string `json:"sortBy"`
	SortOrder string `json:"sortOrder"`
	Topic     string `json:"topic"`
}

func NewDashboardService(
	quizRepo *repository.QuizRepository,
	attemptRepo *repository.AttemptRepository,
) *DashboardService {
	return &DashboardService{
		quizRepo:    quizRepo,
		attemptRepo: attemptRepo,
	}
}

func normalizePaginationOptions(options *FilterOptions) {
	if options.Page < 1 {
		options.Page = 1
	}
	if options.PageSize < 1 {
		options.PageSize = 10
	} else if options.PageSize > 100 {
		options.PageSize = 100
	}
}

func convertToFloat64(value interface{}) float64 {
	if value == nil {
		return 0
	}

	switch v := value.(type) {
	case float64:
		return v
	case float32:
		return float64(v)
	case int:
		return float64(v)
	case int32:
		return float64(v)
	case int64:
		return float64(v)
	default:
		return 0
	}
}

func (s *DashboardService) GetDashboardSummary(ctx context.Context, userID string) (*DashboardSummary, error) {
	passedAttempts, _, err := s.attemptRepo.GetBestAttemptsByUserIDWithPagination(
		ctx, userID, nil, 1, 1000, "completedAt", "desc", // Get all attempts without pagination
	)
	if err != nil {
		return nil, err
	}

	totalQuizzes := len(passedAttempts)
	passedCount := 0
	totalScore := 0.0

	for _, attempt := range passedAttempts {
		totalScore += attempt.Score
		if attempt.Passed {
			passedCount++
		}
	}

	averageScore := 0.0
	if totalQuizzes > 0 {
		averageScore = totalScore / float64(totalQuizzes)
	}

	successRate := 0.0
	if totalQuizzes > 0 {
		successRate = float64(passedCount) / float64(totalQuizzes) * 100
	}

	draftStatuses := []string{models.QuizStatusDraftStage1, models.QuizStatusDraft}
	draftQuizzes, _, err := s.quizRepo.GetQuizzesByUserIDAndStatusesPaginated(ctx, userID, draftStatuses, 1, 1000, "", "", "")
	if err != nil {
		return nil, err
	}

	attemptedQuizIDs := make(map[string]bool)
	for _, attempt := range passedAttempts {
		attemptedQuizIDs[attempt.QuizID.Hex()] = true
	}

	draftedQuizzesCount := 0
	for _, quiz := range draftQuizzes {
		if !attemptedQuizIDs[quiz.ID.Hex()] {
			draftedQuizzesCount++
		}
	}

	return &DashboardSummary{
		TotalQuizzes:   totalQuizzes,
		AverageScore:   averageScore,
		SuccessRate:    successRate,
		DraftedQuizzes: draftedQuizzesCount,
	}, nil
}

func (s *DashboardService) GetPassedQuizzes(ctx context.Context, userID string, options FilterOptions) (*QuizList, error) {
	normalizePaginationOptions(&options)

	passed := true

	var actualPage, actualPageSize int
	var needsAppLevelSorting bool

	if options.SortBy == "topic" || options.Topic != "" {
		needsAppLevelSorting = true
		actualPage = 1
		actualPageSize = 1000
	} else {
		actualPage = options.Page
		actualPageSize = options.PageSize
	}

	attempts, totalCount, err := s.attemptRepo.GetBestAttemptsByUserIDWithPagination(
		ctx, userID, &passed, actualPage, actualPageSize, options.SortBy, options.SortOrder,
	)
	if err != nil {
		return nil, err
	}

	quizIDs := make([]string, len(attempts))
	for i, attempt := range attempts {
		quizIDs[i] = attempt.QuizID.Hex()
	}

	quizzes, err := s.quizRepo.GetQuizzesByIDs(ctx, quizIDs)
	if err != nil {
		return nil, err
	}

	quizMap := make(map[string]*models.Quiz)
	for _, quiz := range quizzes {
		quizMap[quiz.ID.Hex()] = quiz
	}

	allCards := make([]QuizCard, 0)
	for _, attempt := range attempts {
		quiz, exists := quizMap[attempt.QuizID.Hex()]
		if !exists {
			continue
		}

		if options.Topic != "" && !strings.EqualFold(quiz.Topic, options.Topic) {
			continue
		}

		allCards = append(allCards, QuizCard{
			ID:        attempt.QuizID.Hex(),
			Title:     quiz.Title,
			Topic:     quiz.Topic,
			Score:     attempt.Score,
			DateTaken: attempt.CompletedAt.Format("2006-01-02T15:04:05Z"),
			TimeTaken: attempt.TimeTaken,
		})
	}

	if needsAppLevelSorting && options.SortBy == "topic" {
		sort.Slice(allCards, func(i, j int) bool {
			if options.SortOrder == "asc" {
				return strings.ToLower(allCards[i].Topic) < strings.ToLower(allCards[j].Topic)
			}
			return strings.ToLower(allCards[i].Topic) > strings.ToLower(allCards[j].Topic)
		})
	}

	finalCards := allCards
	adjustedTotalCount := int64(len(allCards))

	if needsAppLevelSorting || options.Topic != "" {
		startIndex := (options.Page - 1) * options.PageSize
		endIndex := startIndex + options.PageSize

		if startIndex > len(allCards) {
			finalCards = []QuizCard{}
		} else {
			if endIndex > len(allCards) {
				endIndex = len(allCards)
			}
			finalCards = allCards[startIndex:endIndex]
		}
	} else {
		adjustedTotalCount = totalCount
	}

	totalPages := 0
	if adjustedTotalCount > 0 {
		totalPages = int((adjustedTotalCount + int64(options.PageSize) - 1) / int64(options.PageSize))
	}

	return &QuizList{
		Quizzes: finalCards,
		Pagination: PaginationMetadata{
			CurrentPage: options.Page,
			PageSize:    options.PageSize,
			TotalItems:  int(adjustedTotalCount),
			TotalPages:  totalPages,
		},
	}, nil
}

func (s *DashboardService) GetFailedQuizzes(ctx context.Context, userID string, options FilterOptions) (*QuizList, error) {
	normalizePaginationOptions(&options)

	passed := false

	var actualPage, actualPageSize int
	var needsAppLevelSorting bool

	if options.SortBy == "topic" || options.Topic != "" {
		needsAppLevelSorting = true
		actualPage = 1
		actualPageSize = 1000
	} else {
		actualPage = options.Page
		actualPageSize = options.PageSize
	}

	attempts, totalCount, err := s.attemptRepo.GetBestAttemptsByUserIDWithPagination(
		ctx, userID, &passed, actualPage, actualPageSize, options.SortBy, options.SortOrder,
	)
	if err != nil {
		return nil, err
	}

	quizIDs := make([]string, len(attempts))
	for i, attempt := range attempts {
		quizIDs[i] = attempt.QuizID.Hex()
	}

	quizzes, err := s.quizRepo.GetQuizzesByIDs(ctx, quizIDs)
	if err != nil {
		return nil, err
	}

	quizMap := make(map[string]*models.Quiz)
	for _, quiz := range quizzes {
		quizMap[quiz.ID.Hex()] = quiz
	}

	allCards := make([]QuizCard, 0)
	for _, attempt := range attempts {
		quiz, exists := quizMap[attempt.QuizID.Hex()]
		if !exists {
			continue
		}

		if options.Topic != "" && !strings.EqualFold(quiz.Topic, options.Topic) {
			continue
		}

		allCards = append(allCards, QuizCard{
			ID:        attempt.QuizID.Hex(),
			Title:     quiz.Title,
			Topic:     quiz.Topic,
			Score:     attempt.Score,
			DateTaken: attempt.CompletedAt.Format("2006-01-02T15:04:05Z"),
			TimeTaken: attempt.TimeTaken,
		})
	}

	if needsAppLevelSorting && options.SortBy == "topic" {
		sort.Slice(allCards, func(i, j int) bool {
			if options.SortOrder == "asc" {
				return strings.ToLower(allCards[i].Topic) < strings.ToLower(allCards[j].Topic)
			}
			return strings.ToLower(allCards[i].Topic) > strings.ToLower(allCards[j].Topic)
		})
	}

	finalCards := allCards
	adjustedTotalCount := int64(len(allCards))

	if needsAppLevelSorting || options.Topic != "" {
		startIndex := (options.Page - 1) * options.PageSize
		endIndex := startIndex + options.PageSize

		if startIndex > len(allCards) {
			finalCards = []QuizCard{}
		} else {
			if endIndex > len(allCards) {
				endIndex = len(allCards)
			}
			finalCards = allCards[startIndex:endIndex]
		}
	} else {
		adjustedTotalCount = totalCount
	}

	totalPages := 0
	if adjustedTotalCount > 0 {
		totalPages = int((adjustedTotalCount + int64(options.PageSize) - 1) / int64(options.PageSize))
	}

	return &QuizList{
		Quizzes: finalCards,
		Pagination: PaginationMetadata{
			CurrentPage: options.Page,
			PageSize:    options.PageSize,
			TotalItems:  int(adjustedTotalCount),
			TotalPages:  totalPages,
		},
	}, nil
}

func (s *DashboardService) GetDraftQuizzes(ctx context.Context, userID string, options FilterOptions) (*QuizList, error) {
	normalizePaginationOptions(&options)

	draftStatuses := []string{models.QuizStatusDraftStage1, models.QuizStatusDraft}

	quizzes, totalCount, err := s.quizRepo.GetQuizzesByUserIDAndStatusesPaginated(
		ctx, userID, draftStatuses, options.Page, options.PageSize, options.Topic, options.SortBy, options.SortOrder,
	)
	if err != nil {
		return nil, err
	}

	attempts, err := s.attemptRepo.GetAttemptsByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	attemptedQuizIDs := make(map[string]bool)
	for _, attempt := range attempts {
		if attempt.Status == models.AttemptStatusCompleted {
			attemptedQuizIDs[attempt.QuizID.Hex()] = true
		}
	}

	filteredCards := make([]QuizCard, 0)
	for _, quiz := range quizzes {
		if attemptedQuizIDs[quiz.ID.Hex()] {
			continue
		}

		filteredCards = append(filteredCards, QuizCard{
			ID:        quiz.ID.Hex(),
			Title:     quiz.Title,
			Topic:     quiz.Topic,
			Score:     0,
			DateTaken: quiz.CreatedAt.Format("2006-01-02T15:04:05Z"),
			TimeTaken: 0,
		})
	}

	totalPages := 0
	if totalCount > 0 {
		totalPages = int((totalCount + int64(options.PageSize) - 1) / int64(options.PageSize))
	}

	return &QuizList{
		Quizzes: filteredCards,
		Pagination: PaginationMetadata{
			CurrentPage: options.Page,
			PageSize:    options.PageSize,
			TotalItems:  int(totalCount),
			TotalPages:  totalPages,
		},
	}, nil
}
