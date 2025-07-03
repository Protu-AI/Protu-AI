package org.protu.contentservice.course;

public record CourseWithTotalLessons(
    Integer id,
    String name,
    String description,
    String picUrl,
    Integer totalLessons) {
}
