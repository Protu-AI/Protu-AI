package response

import (
	"time"
)

type QuizPreviewResponse struct {
	ID                string    `json:"id"`
	Title             string    `json:"title"`
	Topic             string    `json:"topic"`
	DifficultyLevel   string    `json:"difficultyLevel"`
	NumberOfQuestions int       `json:"numberOfQuestions"`
	TimeLimit         int       `json:"timeLimit"`
	CreatedAt         time.Time `json:"createdAt"`
}

type QuizStartResponse struct {
	AttemptID string           `json:"attemptId"`
	QuizID    string           `json:"quizId"`
	Title     string           `json:"title"`
	TimeLimit int              `json:"timeLimit"`
	Questions []QuestionDetail `json:"questions"`
	StartedAt time.Time        `json:"startedAt"`
}

type QuizReviewResponse struct {
	AttemptID             string              `json:"attemptId"`
	QuizID                string              `json:"quizId"`
	QuizTitle             string              `json:"quizTitle"`
	QuizTopic             string              `json:"quizTopic"`
	Score                 float64             `json:"score"`
	Passed                bool                `json:"passed"`
	TimeTaken             int                 `json:"timeTaken"`
	CompletedAt           time.Time           `json:"completedAt"`
	CorrectAnswersCount   int                 `json:"correctAnswersCount"`
	IncorrectAnswersCount int                 `json:"incorrectAnswersCount"`
	QuestionReviews       []QuestionReview    `json:"questionReviews"`
	AIFeedback            *AIFeedbackResponse `json:"aiFeedback,omitempty"`
	RecommendedCourses    []RecommendedCourse `json:"recommendedCourses,omitempty"`
}

type QuestionReview struct {
	QuestionID     string   `json:"questionId"`
	QuestionText   string   `json:"questionText"`
	QuestionType   string   `json:"questionType"`
	Options        []string `json:"options"`
	SelectedAnswer string   `json:"selectedAnswer"`
	CorrectAnswer  string   `json:"correctAnswer"`
	IsCorrect      bool     `json:"isCorrect"`
	Explanation    string   `json:"explanation,omitempty"`
	Order          int      `json:"order"`
}

type AIFeedbackResponse struct {
	Signal          string `json:"signal"`
	FeedbackMessage string `json:"feedbackMessage"`
}

type RecommendedCourse struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	PicURL      string `json:"picUrl"`
}
