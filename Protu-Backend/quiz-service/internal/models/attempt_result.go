package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AttemptResult stores the complete quiz attempt result with AI feedback and course recommendations
type AttemptResult struct {
	ID                    primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	AttemptID             primitive.ObjectID `bson:"attemptId" json:"attemptId"`
	QuizID                primitive.ObjectID `bson:"quizId" json:"quizId"`
	UserID                string             `bson:"userId" json:"userId"`
	QuizTitle             string             `bson:"quizTitle" json:"quizTitle"`
	QuizTopic             string             `bson:"quizTopic" json:"quizTopic"`
	Score                 float64            `bson:"score" json:"score"`
	Passed                bool               `bson:"passed" json:"passed"`
	TimeTaken             int                `bson:"timeTaken" json:"timeTaken"`
	CompletedAt           time.Time          `bson:"completedAt" json:"completedAt"`
	CorrectAnswersCount   int                `bson:"correctAnswersCount" json:"correctAnswersCount"`
	IncorrectAnswersCount int                `bson:"incorrectAnswersCount" json:"incorrectAnswersCount"`
	QuestionReviews       []QuestionReview   `bson:"questionReviews" json:"questionReviews"`
	AIFeedback            *AIFeedback        `bson:"aiFeedback,omitempty" json:"aiFeedback,omitempty"`
	RecommendedCourses    []Course           `bson:"recommendedCourses,omitempty" json:"recommendedCourses,omitempty"`
	CreatedAt             time.Time          `bson:"createdAt" json:"createdAt"`
}

// QuestionReview represents the review data for a single question
type QuestionReview struct {
	QuestionID     string   `bson:"questionId" json:"questionId"`
	QuestionText   string   `bson:"questionText" json:"questionText"`
	QuestionType   string   `bson:"questionType" json:"questionType"`
	Options        []string `bson:"options" json:"options"`
	SelectedAnswer string   `bson:"selectedAnswer" json:"selectedAnswer"`
	CorrectAnswer  string   `bson:"correctAnswer" json:"correctAnswer"`
	IsCorrect      bool     `bson:"isCorrect" json:"isCorrect"`
	Explanation    string   `bson:"explanation,omitempty" json:"explanation,omitempty"`
	Order          int      `bson:"order" json:"order"`
}

// AIFeedback represents the AI feedback data
type AIFeedback struct {
	Signal          string `bson:"signal" json:"signal"`
	FeedbackMessage string `bson:"feedbackMessage" json:"feedbackMessage"`
}

// Course represents the course recommendation data
type Course struct {
	ID          int    `bson:"id" json:"id"`
	Name        string `bson:"name" json:"name"`
	Description string `bson:"description" json:"description"`
	PicURL      string `bson:"picUrl" json:"picUrl"`
	LessonCount int    `bson:"lessonCount" json:"lessonCount"`
}
