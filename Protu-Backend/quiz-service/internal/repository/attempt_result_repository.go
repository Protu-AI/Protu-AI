package repository

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"protu.ai/quiz-service/internal/models"
)

type AttemptResultRepository struct {
	collection *mongo.Collection
}

func NewAttemptResultRepository(db *mongo.Database) *AttemptResultRepository {
	return &AttemptResultRepository{
		collection: db.Collection("attempt_results"),
	}
}

// SaveAttemptResult saves the complete attempt result with AI feedback and course recommendations
func (r *AttemptResultRepository) SaveAttemptResult(ctx context.Context, result *models.AttemptResult) (*models.AttemptResult, error) {
	result.CreatedAt = time.Now()

	insertResult, err := r.collection.InsertOne(ctx, result)
	if err != nil {
		return nil, err
	}

	result.ID = insertResult.InsertedID.(primitive.ObjectID)
	return result, nil
}

// GetBestAttemptResultByQuizAndUser gets the best scoring attempt result for a quiz by a specific user
func (r *AttemptResultRepository) GetBestAttemptResultByQuizAndUser(ctx context.Context, quizID primitive.ObjectID, userID string) (*models.AttemptResult, error) {
	filter := bson.M{
		"quizId": quizID,
		"userId": userID,
	}

	// Sort by score descending to get the best attempt first
	opts := options.FindOne().SetSort(bson.D{{"score", -1}})

	var result models.AttemptResult
	err := r.collection.FindOne(ctx, filter, opts).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // No attempts found
		}
		return nil, err
	}

	return &result, nil
}

// GetAllAttemptResultsByQuizAndUser gets all attempt results for a quiz by a specific user, sorted by score descending
func (r *AttemptResultRepository) GetAllAttemptResultsByQuizAndUser(ctx context.Context, quizID primitive.ObjectID, userID string) ([]*models.AttemptResult, error) {
	filter := bson.M{
		"quizId": quizID,
		"userId": userID,
	}

	// Sort by score descending, then by completedAt descending
	opts := options.Find().SetSort(bson.D{{"score", -1}, {"completedAt", -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []*models.AttemptResult
	for cursor.Next(ctx) {
		var result models.AttemptResult
		if err := cursor.Decode(&result); err != nil {
			return nil, err
		}
		results = append(results, &result)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return results, nil
}

// HasUserAttemptedQuiz checks if a user has attempted a specific quiz
func (r *AttemptResultRepository) HasUserAttemptedQuiz(ctx context.Context, quizID primitive.ObjectID, userID string) (bool, error) {
	filter := bson.M{
		"quizId": quizID,
		"userId": userID,
	}

	count, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

// GetAttemptResultByID gets an attempt result by its ID
func (r *AttemptResultRepository) GetAttemptResultByID(ctx context.Context, id primitive.ObjectID) (*models.AttemptResult, error) {
	filter := bson.M{"_id": id}

	var result models.AttemptResult
	err := r.collection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &result, nil
}
