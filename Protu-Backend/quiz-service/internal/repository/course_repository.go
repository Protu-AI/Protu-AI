package repository

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	_ "github.com/lib/pq"
	"protu.ai/quiz-service/config"
)

type Course struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	PicURL      string `json:"pic_url"`
}

type CourseRepository struct {
	db *sql.DB
}

func NewCourseRepository(config *config.Config) (*CourseRepository, error) {
	connStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable",
		parseHostFromURL(config.ContentDBURL),
		config.ContentDBUsername,
		config.ContentDBPassword,
		config.ContentDBName)

	log.Printf("[CourseRepository] Connecting to content database with connection: host=%s dbname=%s user=%s",
		parseHostFromURL(config.ContentDBURL), config.ContentDBName, config.ContentDBUsername)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Printf("[CourseRepository] Successfully connected to content database")

	return &CourseRepository{
		db: db,
	}, nil
}

func (r *CourseRepository) GetCoursesByIDs(courseIDs []int) ([]Course, error) {
	if len(courseIDs) == 0 {
		return []Course{}, nil
	}

	placeholders := make([]string, len(courseIDs))
	args := make([]interface{}, len(courseIDs))
	for i, id := range courseIDs {
		placeholders[i] = fmt.Sprintf("$%d", i+1)
		args[i] = id
	}

	query := fmt.Sprintf(`
		SELECT id, name, description, pic_url 
		FROM courses 
		WHERE id IN (%s)
		ORDER BY id`, strings.Join(placeholders, ","))

	log.Printf("[CourseRepository] Executing query: %s with args: %v", query, args)

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close()

	var courses []Course
	for rows.Next() {
		var course Course
		var description sql.NullString
		var picURL sql.NullString

		err := rows.Scan(&course.ID, &course.Name, &description, &picURL)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}

		if description.Valid {
			course.Description = description.String
		}
		if picURL.Valid {
			course.PicURL = picURL.String
		}

		courses = append(courses, course)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	log.Printf("[CourseRepository] Successfully fetched %d courses", len(courses))
	return courses, nil
}

func (r *CourseRepository) Close() error {
	if r.db != nil {
		return r.db.Close()
	}
	return nil
}

func parseHostFromURL(jdbcURL string) string {
	if strings.HasPrefix(jdbcURL, "jdbc:postgresql://") {
		jdbcURL = strings.TrimPrefix(jdbcURL, "jdbc:postgresql://")
	}

	parts := strings.Split(jdbcURL, "/")
	if len(parts) > 0 {
		return parts[0]
	}

	return "localhost:5432"
}
