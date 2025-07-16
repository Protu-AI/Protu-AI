package org.protu.contentservice.progress;

import org.protu.contentservice.common.exception.custom.LessonAlreadyNotCompletedException;
import org.protu.contentservice.course.CourseDto;
import org.protu.contentservice.course.CourseService;
import org.protu.contentservice.lesson.LessonService;
import org.protu.contentservice.lesson.dto.LessonWithoutContent;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static org.protu.contentservice.course.CourseService.CACHE_COURSE_LESSONS_WITH_COMPLETION;

@Service
public class ProgressService {

  private final CourseService courseService;
  private final LessonService lessonService;
  private final UserReplicaService userReplicaService;
  private final ProgressRepository progressRepo;

  public ProgressService(CourseService courseService, LessonService lessonService, UserReplicaService userReplicaService, ProgressRepository progressRepo) {
    this.courseService = courseService;
    this.lessonService = lessonService;
    this.userReplicaService = userReplicaService;
    this.progressRepo = progressRepo;
  }

  @Transactional(readOnly = true)
  public UserCourseProgress getUserProgressInCourse(Long userId, String courseName) {
    userReplicaService.getUserById(userId);
    CourseDto course = courseService.getCourseByNameOrThrow(courseName);

    int completedLessons = progressRepo.getTotalNumberOfCompletedLessonsInCourse(userId, course.id());
    int totalLessons = progressRepo.getNumberOfLessonsInCourse(course.id());
    return new UserCourseProgress(course.id(), completedLessons, totalLessons);
  }

  @Transactional
  public void enrollUserInCourse(Long userId, String courseName) {
    userReplicaService.getUserById(userId);
    CourseDto course = courseService.getCourseByNameOrThrow(courseName);
    progressRepo.addCourseForUser(userId, course.id());
  }

  @Transactional
  public void cancelUserEnrollmentInCourse(Long userId, String courseName) {
    userReplicaService.getUserById(userId);
    CourseDto course = courseService.getCourseByNameOrThrow(courseName);
    progressRepo.removeCourseForUser(userId, course.id());
  }


  private boolean markLessonNotCompleted(Long userId, String lessonName) {
    LessonWithoutContent lesson = lessonService.findByNameWithoutContent(lessonName);
    return progressRepo.markLessonUncompleted(userId, lesson.id());
  }

  @CacheEvict(value = CACHE_COURSE_LESSONS_WITH_COMPLETION, key = "{#userId, #courseName}")
  public void incrementCompletedLessonsByUser(Long userId, String courseName, String lessonName) {
    userReplicaService.getUserById(userId);
    CourseDto course = courseService.getCourseByNameOrThrow(courseName);
    LessonWithoutContent lesson = lessonService.findByNameWithoutContent(lessonName);

    updateUserProgress(userId, lesson.id(), course.id());
  }

  @Transactional
  public void updateUserProgress(Long userId, Integer lessonId, Integer courseId) {
    if (progressRepo.markLessonCompleted(userId, lessonId) == 0) {
      return;
    }

    progressRepo.incrementCompletedLessonByUser(userId, courseId);
  }

  @Transactional
  public void decrementCompletedLessonsByUser(Long userId, String courseName, String lessonName) {
    userReplicaService.getUserById(userId);
    CourseDto course = courseService.getCourseByNameOrThrow(courseName);

    if (!markLessonNotCompleted(userId, lessonName)) {
      throw new LessonAlreadyNotCompletedException();
    }

    int completedLessonsCount = progressRepo.getTotalNumberOfCompletedLessonsInCourse(userId, course.id());
    if (completedLessonsCount > 0) {
      progressRepo.decrementCompletedLessonsByUser(userId, course.id());
    }
  }
}
