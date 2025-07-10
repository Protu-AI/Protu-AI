package handlers

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"protu.ai/quiz-service/internal/dto/request"
	"protu.ai/quiz-service/internal/dto/response"
	"protu.ai/quiz-service/internal/middleware"
	"protu.ai/quiz-service/internal/models"
	"protu.ai/quiz-service/internal/repository"
	"protu.ai/quiz-service/internal/service"
	"protu.ai/quiz-service/pkg/errors"
	apiResponse "protu.ai/quiz-service/pkg/response"
	"protu.ai/quiz-service/pkg/validator"
)

type AttemptHandler struct {
	attemptService          *service.AttemptService
	quizService             *service.QuizService
	aiService               *service.AIService
	courseRepository        *repository.CourseRepository
	attemptResultRepository *repository.AttemptResultRepository
}

func NewAttemptHandler(attemptService *service.AttemptService, quizService *service.QuizService, aiService *service.AIService, courseRepository *repository.CourseRepository, attemptResultRepository *repository.AttemptResultRepository) *AttemptHandler {
	return &AttemptHandler{
		attemptService:          attemptService,
		quizService:             quizService,
		aiService:               aiService,
		courseRepository:        courseRepository,
		attemptResultRepository: attemptResultRepository,
	}
}

func (h *AttemptHandler) PreviewQuiz(c *gin.Context) {
	quizID := c.Param("quizId")
	if quizID == "" {
		apiResponse.Error(c, errors.BadRequestError("Quiz ID is required", nil))
		return
	}

	quiz, err := h.quizService.GetQuizByID(c, quizID)
	if err != nil {
		apiResponse.Error(c, errors.NotFoundError("Quiz not found"))
		return
	}

	previewResponse := response.QuizPreviewResponse{
		ID:                quiz.ID.Hex(),
		Title:             quiz.Title,
		Topic:             quiz.Topic,
		DifficultyLevel:   quiz.DifficultyLevel,
		NumberOfQuestions: quiz.NumberOfQuestions,
		TimeLimit:         quiz.TimeLimit,
		CreatedAt:         quiz.CreatedAt,
	}

	apiResponse.QuizFound(c, previewResponse)
}

func (h *AttemptHandler) StartQuiz(c *gin.Context) {

	quizID := c.Param("quizId")
	if quizID == "" {
		apiResponse.Error(c, errors.BadRequestError("Quiz ID is required", nil))
		return
	}

	userID, err := middleware.GetUserIDFromContext(c)
	if err != nil {
		apiResponse.Error(c, errors.AuthenticationError("Failed to get user ID from token"))
		return
	}

	quiz, err := h.quizService.GetQuizByID(c, quizID)
	if err != nil {
		apiResponse.Error(c, errors.NotFoundError("Quiz not found"))
		return
	}

	quizObjectID, err := primitive.ObjectIDFromHex(quizID)
	if err != nil {
		apiResponse.Error(c, errors.BadRequestError("Invalid quiz ID format", nil))
		return
	}

	attempt := &models.QuizAttempt{
		QuizID: quizObjectID,
		UserID: userID,
		Status: models.AttemptStatusInProgress,
	}

	createdAttempt, err := h.attemptService.CreateAttempt(c, attempt)
	if err != nil {
		apiResponse.Error(c, errors.QuizExecutionError("Failed to create attempt", err.Error()))
		return
	}

	if quiz.Status == models.QuizStatusDraft || quiz.Status == models.QuizStatusDraftStage1 {
		_, err := h.quizService.PublishQuiz(c, quizID)
		if err != nil {
		}
	}

	if err := h.quizService.IncrementAttemptCount(c, quizID); err != nil {
	}

	questions := make([]response.QuestionDetail, 0, len(quiz.Questions))

	for _, q := range quiz.Questions {
		options := make([]response.Option, 0, len(q.Options))
		for _, opt := range q.Options {
			options = append(options, response.Option{
				Text: opt.Text,
			})
		}

		questions = append(questions, response.QuestionDetail{
			ID:           q.ID.Hex(),
			QuestionText: q.QuestionText,
			QuestionType: q.QuestionType,
			Options:      options,
			Order:        q.Order,
		})
	}

	startResponse := response.QuizStartResponse{
		AttemptID: createdAttempt.ID.Hex(),
		QuizID:    quiz.ID.Hex(),
		Title:     quiz.Title,
		TimeLimit: quiz.TimeLimit,
		Questions: questions,
		StartedAt: createdAttempt.StartedAt,
	}

	apiResponse.AttemptCreated(c, startResponse)
}

func (h *AttemptHandler) SubmitAttempt(c *gin.Context) {
	attemptID := c.Param("id")
	if attemptID == "" {
		apiResponse.Error(c, errors.BadRequestError("Attempt ID is required", nil))
		return
	}

	var submitReq request.SubmitAttemptRequest
	if err := c.ShouldBindJSON(&submitReq); err != nil {
		apiResponse.Error(c, errors.ValidationError("Invalid request body", err.Error()))
		return
	}

	if err := validator.Validate(submitReq); err != nil {
		apiResponse.Error(c, errors.ValidationError("Invalid input data", err.Error()))
		return
	}

	attempt, err := h.attemptService.GetAttemptByID(c, attemptID)
	if err != nil {
		apiResponse.Error(c, errors.NotFoundError("Attempt not found"))
		return
	}

	if attempt.Status == models.AttemptStatusCompleted {
		apiResponse.Error(c, errors.BadRequestError("Attempt has already been submitted", nil))
		return
	}

	quiz, err := h.quizService.GetQuizByID(c, attempt.QuizID.Hex())
	if err != nil {
		apiResponse.Error(c, errors.InternalError("Failed to retrieve quiz: "+err.Error()))
		return
	}

	if submitReq.QuizID != "" && submitReq.QuizID != quiz.ID.Hex() {
		apiResponse.Error(c, errors.ValidationError("Quiz ID mismatch", nil))
		return
	}

	questionMap := make(map[string]*models.Question, len(quiz.Questions))
	for i := range quiz.Questions {
		questionMap[quiz.Questions[i].ID.Hex()] = &quiz.Questions[i]
	}

	answers := make([]models.Answer, 0, len(submitReq.Answers))
	for _, ans := range submitReq.Answers {
		questionID, err := primitive.ObjectIDFromHex(ans.QuestionID)
		if err != nil {
			apiResponse.Error(c, errors.ValidationError("Invalid question ID format", ans.QuestionID))
			return
		}

		question, exists := questionMap[ans.QuestionID]
		if !exists {
			apiResponse.Error(c, errors.NotFoundError("Question not found in quiz: "+ans.QuestionID))
			return
		}

		if ans.Selected < 0 || ans.Selected >= len(question.Options) {
			apiResponse.Error(c, errors.ValidationError("Invalid option index for question", ans.QuestionID))
			return
		}

		answers = append(answers, models.Answer{
			QuestionID: questionID,
			Selected:   ans.Selected,
		})
	}

	submittedAttempt, correctAnswers, incorrectAnswers, err := h.attemptService.SubmitAttempt(c, attemptID, answers)
	if err != nil {
		apiResponse.Error(c, errors.QuizSubmissionError("Failed to submit attempt", err.Error()))
		return
	}

	log.Printf("[SubmitAttempt] Starting AI feedback request for attempt %s", attemptID)
	aiFeedback, err := h.aiService.GetEnhancedQuizFeedback(c, quiz, submittedAttempt.Answers)

	aiExplanationsMap := make(map[int]string)
	if err == nil && aiFeedback != nil {
		for _, explanation := range aiFeedback.DetailedExplanations {
			aiExplanationsMap[explanation.QuestionID] = explanation.Explanation
		}
		log.Printf("[SubmitAttempt] Successfully received AI feedback with %d explanations and %d course recommendations",
			len(aiFeedback.DetailedExplanations), len(aiFeedback.RecommendedCourseIDs))
	} else {
		log.Printf("[SubmitAttempt] Failed to get AI feedback: %v", err)
	}

	questionReviews := make([]response.QuestionReview, len(submittedAttempt.Answers))
	for i, ans := range submittedAttempt.Answers {
		var questionType string
		var options []string
		var explanation string

		if q, ok := questionMap[ans.QuestionID.Hex()]; ok {
			questionType = q.QuestionType
			options = make([]string, len(q.Options))
			for j, opt := range q.Options {
				options[j] = opt.Text
			}

			if !ans.IsCorrect {
				if aiExplanation, exists := aiExplanationsMap[q.Order]; exists {
					explanation = aiExplanation
				}
			}
		}

		questionReviews[i] = response.QuestionReview{
			QuestionID:     ans.QuestionID.Hex(),
			QuestionText:   ans.QuestionText,
			QuestionType:   questionType,
			Options:        options,
			SelectedAnswer: ans.SelectedAnswer,
			CorrectAnswer:  ans.CorrectAnswer,
			IsCorrect:      ans.IsCorrect,
			Explanation:    explanation,
			Order:          ans.Order,
		}
	}

	reviewResponse := response.QuizReviewResponse{
		AttemptID:             submittedAttempt.ID.Hex(),
		QuizID:                submittedAttempt.QuizID.Hex(),
		QuizTitle:             quiz.Title,
		QuizTopic:             quiz.Topic,
		Score:                 submittedAttempt.Score,
		Passed:                submittedAttempt.Passed,
		TimeTaken:             submittedAttempt.TimeTaken,
		CompletedAt:           submittedAttempt.CompletedAt,
		CorrectAnswersCount:   correctAnswers,
		IncorrectAnswersCount: incorrectAnswers,
		QuestionReviews:       questionReviews,
	}

	if err != nil {
		reviewResponse.AIFeedback = &response.AIFeedbackResponse{
			Signal:          "error",
			FeedbackMessage: fmt.Sprintf("AI feedback unavailable: %v", err),
		}
		reviewResponse.RecommendedCourses = []response.RecommendedCourse{}
	} else {
		aiResponse := &response.AIFeedbackResponse{
			Signal:          aiFeedback.Signal,
			FeedbackMessage: aiFeedback.FeedbackMessage,
		}

		reviewResponse.AIFeedback = aiResponse

		if len(aiFeedback.RecommendedCourseIDs) > 0 && h.courseRepository != nil {
			log.Printf("[SubmitAttempt] Fetching course information for IDs: %v", aiFeedback.RecommendedCourseIDs)
			courses, err := h.courseRepository.GetCoursesByIDs(aiFeedback.RecommendedCourseIDs)
			if err != nil {
				log.Printf("[SubmitAttempt] Failed to fetch course information: %v", err)
				reviewResponse.RecommendedCourses = []response.RecommendedCourse{}
			} else {
				log.Printf("[SubmitAttempt] Successfully fetched %d courses", len(courses))
				recommendedCourses := make([]response.RecommendedCourse, len(courses))
				for i, course := range courses {
					recommendedCourses[i] = response.RecommendedCourse{
						ID:          course.ID,
						Name:        course.Name,
						Description: course.Description,
						PicURL:      course.PicURL,
						LessonCount: course.LessonCount,
					}
				}
				reviewResponse.RecommendedCourses = recommendedCourses
			}
		} else {
			if len(aiFeedback.RecommendedCourseIDs) > 0 && h.courseRepository == nil {
				log.Printf("[SubmitAttempt] Course recommendations received but course repository is not available")
			} else {
				log.Printf("[SubmitAttempt] No course recommendations received from AI")
			}
			reviewResponse.RecommendedCourses = []response.RecommendedCourse{}
		}
	}

	attemptResult := &models.AttemptResult{
		AttemptID:             submittedAttempt.ID,
		QuizID:                submittedAttempt.QuizID,
		UserID:                submittedAttempt.UserID,
		QuizTitle:             quiz.Title,
		QuizTopic:             quiz.Topic,
		Score:                 submittedAttempt.Score,
		Passed:                submittedAttempt.Passed,
		TimeTaken:             submittedAttempt.TimeTaken,
		CompletedAt:           submittedAttempt.CompletedAt,
		CorrectAnswersCount:   correctAnswers,
		IncorrectAnswersCount: incorrectAnswers,
		QuestionReviews:       make([]models.QuestionReview, len(questionReviews)),
	}

	for i, qr := range questionReviews {
		attemptResult.QuestionReviews[i] = models.QuestionReview{
			QuestionID:     qr.QuestionID,
			QuestionText:   qr.QuestionText,
			QuestionType:   qr.QuestionType,
			Options:        qr.Options,
			SelectedAnswer: qr.SelectedAnswer,
			CorrectAnswer:  qr.CorrectAnswer,
			IsCorrect:      qr.IsCorrect,
			Explanation:    qr.Explanation,
			Order:          qr.Order,
		}
	}

	if reviewResponse.AIFeedback != nil {
		attemptResult.AIFeedback = &models.AIFeedback{
			Signal:          reviewResponse.AIFeedback.Signal,
			FeedbackMessage: reviewResponse.AIFeedback.FeedbackMessage,
		}
	}

	if len(reviewResponse.RecommendedCourses) > 0 {
		attemptResult.RecommendedCourses = make([]models.Course, len(reviewResponse.RecommendedCourses))
		for i, rc := range reviewResponse.RecommendedCourses {
			attemptResult.RecommendedCourses[i] = models.Course{
				ID:          rc.ID,
				Name:        rc.Name,
				Description: rc.Description,
				PicURL:      rc.PicURL,
				LessonCount: rc.LessonCount,
			}
		}
	}

	if h.attemptResultRepository != nil {
		_, err = h.attemptResultRepository.SaveAttemptResult(c, attemptResult)
		if err != nil {
			log.Printf("[SubmitAttempt] Failed to save attempt result: %v", err)
		} else {
			log.Printf("[SubmitAttempt] Successfully saved attempt result for attempt %s", attemptID)
		}
	} else {
		log.Printf("[SubmitAttempt] Attempt result repository is not available, skipping save")
	}

	apiResponse.AttemptSubmitted(c, reviewResponse)
}

func (h *AttemptHandler) AttemptedQuizPreview(c *gin.Context) {
	quizID := c.Param("quizId")
	if quizID == "" {
		apiResponse.Error(c, errors.BadRequestError("Quiz ID is required", nil))
		return
	}

	userID, err := middleware.GetUserIDFromContext(c)
	if err != nil {
		apiResponse.Error(c, errors.AuthenticationError("Failed to get user ID from token"))
		return
	}

	quiz, err := h.quizService.GetQuizByID(c, quizID)
	if err != nil {
		apiResponse.Error(c, errors.NotFoundError("Quiz not found"))
		return
	}

	quizObjectID, err := primitive.ObjectIDFromHex(quizID)
	if err != nil {
		apiResponse.Error(c, errors.BadRequestError("Invalid quiz ID format", nil))
		return
	}

	var hasAttempted bool
	if h.attemptResultRepository != nil {
		hasAttempted, err = h.attemptResultRepository.HasUserAttemptedQuiz(c, quizObjectID, userID)
		if err != nil {
			apiResponse.Error(c, errors.InternalError("Failed to check attempt history: "+err.Error()))
			return
		}
	} else {
		log.Printf("[AttemptedQuizPreview] Attempt result repository is not available")
		hasAttempted = false
	}

	previewResponse := response.AttemptedQuizPreviewResponse{
		ID:                quiz.ID.Hex(),
		Title:             quiz.Title,
		Topic:             quiz.Topic,
		DifficultyLevel:   quiz.DifficultyLevel,
		NumberOfQuestions: quiz.NumberOfQuestions,
		TimeLimit:         quiz.TimeLimit,
		CreatedAt:         quiz.CreatedAt,
		HasBeenAttempted:  hasAttempted,
	}

	if hasAttempted && h.attemptResultRepository != nil {
		bestAttempt, err := h.attemptResultRepository.GetBestAttemptResultByQuizAndUser(c, quizObjectID, userID)
		if err != nil {
			log.Printf("[AttemptedQuizPreview] Failed to get best attempt result: %v", err)
		} else if bestAttempt != nil {
			questionReviews := make([]response.QuestionReview, len(bestAttempt.QuestionReviews))
			for i, qr := range bestAttempt.QuestionReviews {
				questionReviews[i] = response.QuestionReview{
					QuestionID:     qr.QuestionID,
					QuestionText:   qr.QuestionText,
					QuestionType:   qr.QuestionType,
					Options:        qr.Options,
					SelectedAnswer: qr.SelectedAnswer,
					CorrectAnswer:  qr.CorrectAnswer,
					IsCorrect:      qr.IsCorrect,
					Explanation:    qr.Explanation,
					Order:          qr.Order,
				}
			}

			var aiFeedback *response.AIFeedbackResponse
			if bestAttempt.AIFeedback != nil {
				aiFeedback = &response.AIFeedbackResponse{
					Signal:          bestAttempt.AIFeedback.Signal,
					FeedbackMessage: bestAttempt.AIFeedback.FeedbackMessage,
				}
			}

			recommendedCourses := make([]response.RecommendedCourse, len(bestAttempt.RecommendedCourses))
			for i, course := range bestAttempt.RecommendedCourses {
				recommendedCourses[i] = response.RecommendedCourse{
					ID:          course.ID,
					Name:        course.Name,
					Description: course.Description,
					PicURL:      course.PicURL,
					LessonCount: course.LessonCount,
				}
			}

			previewResponse.BestAttempt = &response.AttemptedQuizBestResult{
				AttemptID:             bestAttempt.AttemptID.Hex(),
				Score:                 bestAttempt.Score,
				Passed:                bestAttempt.Passed,
				TimeTaken:             bestAttempt.TimeTaken,
				CompletedAt:           bestAttempt.CompletedAt,
				CorrectAnswersCount:   bestAttempt.CorrectAnswersCount,
				IncorrectAnswersCount: bestAttempt.IncorrectAnswersCount,
				QuestionReviews:       questionReviews,
				AIFeedback:            aiFeedback,
				RecommendedCourses:    recommendedCourses,
			}
		}
	}

	apiResponse.QuizFound(c, previewResponse)
}
