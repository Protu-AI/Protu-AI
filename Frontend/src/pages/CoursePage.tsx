import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { config } from "@/../config";

interface Lesson {
  id: number;
  name: string;
  lessonOrder: number;
  content: string;
  isFinished?: boolean;
}

const CoursePage = () => {
  const { user } = useAuth();
  const { courseName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const course = location.state?.course;

  useEffect(() => {
    if (!courseName) {
      setError("No course specified");
      setLoading(false);
      return;
    }

    const fetchLessons = async () => {
      try {
        let response;
        let fetchedLessons: Lesson[] = [];

        if (user) {
          // Authenticated request with progress
          const token = localStorage.getItem("token");

          // 1. Send POST request for enrollment
          try {
            const enrollResponse = await fetch(
              `${config.apiUrl}/v1/progress/courses/${courseName}/enrollments`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!enrollResponse.ok) {
              const errorData = await enrollResponse.json();
              // If the user is already enrolled, the backend might return a 409 Conflict or similar.
              // You might want to handle this gracefully, e.g., by not throwing an error
              // if the message indicates already enrolled.
              if (
                enrollResponse.status === 409 &&
                errorData.message &&
                errorData.message.includes("already enrolled")
              ) {
                console.log("User is already enrolled in this course.");
              } else {
                throw new Error(
                  `Failed to enroll in course: ${
                    errorData.message || enrollResponse.statusText
                  }`
                );
              }
            } else {
              console.log("Enrollment successful!");
            }
          } catch (enrollError) {
            console.error("Error during enrollment:", enrollError);
            // Decide if you want to stop execution here or proceed to fetch lessons anyway.
            // For now, we'll log the error and proceed to fetch lessons,
            // as fetching lessons is often independent of a *new* enrollment.
          }

          // 2. Fetch lessons with progress
          response = await fetch(
            `${config.apiUrl}/v1/courses/${courseName}/lessons/progress`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch lessons with progress");
          }
          const data = await response.json();
          fetchedLessons = data.data || [];

          // Map the response to match our Lesson interface
          fetchedLessons = fetchedLessons.map((lesson: any) => ({
            id: lesson.id,
            name: lesson.name,
            lessonOrder: lesson.lessonOrder,
            content: "", // This will be empty since the progress endpoint doesn't return content
            isFinished: lesson.isCompleted,
          }));
        } else {
          // Unauthenticated request (original behavior)
          response = await fetch(
            `${config.apiUrl}/v1/courses/${courseName}/lessons`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch lessons");
          }

          const data = await response.json();
          fetchedLessons = data.data || [];

          // Original processing for unauthenticated users
          fetchedLessons = fetchedLessons.map((lesson: any, index: number) => ({
            ...lesson,
            isFinished: index < Math.floor(fetchedLessons.length * 0.3),
          }));
        }

        // Common processing for both cases
        fetchedLessons = fetchedLessons.sort(
          (a: any, b: any) => a.lessonOrder - b.lessonOrder
        );

        setLessons(fetchedLessons);

        const finishedCount = fetchedLessons.filter(
          (l: { isFinished: any }) => l.isFinished
        ).length;
        const totalCount = fetchedLessons.length;
        setCompletionPercentage(
          totalCount > 0 ? Math.floor((finishedCount / totalCount) * 100) : 0
        );
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred while fetching lessons");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [courseName, user]);

  const formatCourseName = (courseName: string) => {
    return courseName
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const courseTitle = formatCourseName(courseName || "");

  const handleLessonClick = (lesson: Lesson) => {
    // In CoursePage.tsx
    navigate(`/lesson/${lesson.name}`, {
      state: {
        lessons: lessons,
        courseName: courseName,
      },
    });
  };

  const nextNotFinishedLesson = lessons.find((lesson) => !lesson.isFinished);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5F24E0]"></div>
          <p className="mt-4 font-['Archivo'] text-[16px] text-[#5F24E0]">
            Loading lessons for {courseTitle || "this course"}...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <p className="font-['Archivo'] text-[16px] text-red-500">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-[#5F24E0] text-[#EFE9FC] font-['Archivo'] text-[22px] font-medium rounded-[16px] px-12 py-3 transition-all hover:bg-[#9F7CEC]"
          >
            Go Back
          </button>
        </div>
      </MainLayout>
    );
  }

  const finishedLessonsCount = lessons.filter(
    (lesson) => lesson.isFinished
  ).length;
  const totalLessonsCount = lessons.length;

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-start w-full overflow-y-auto h-full mt-[128px]">
        <div className="w-full px-[170px]">
          {/* First Rectangle */}
          <div className="bg-[#5F24E0] rounded-[32px] p-[64px] flex flex-col">
            <div className="flex items-center">
              <div className="flex items-center mr-[32px]">
                <img
                  src="https://img.icons8.com/ios-filled/100/EFE9FC/html-5.png"
                  alt="Course Icon"
                  className="w-[110px] h-auto"
                />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <span className="font-['Archivo'] text-[32px] font-normal text-[#EFE9FC] text-left mb-[16px]">
                  Course
                </span>
                <h2 className="font-['Archivo'] text-[42px] font-semibold text-[#EFE9FC] text-left">
                  {courseTitle}
                </h2>
              </div>

              <div className="flex items-center ml-[32px]">
                <img
                  src="https://img.icons8.com/ios-filled/26/EFE9FC/open-book.png"
                  alt="Book Icon"
                  className="w-[26px] h-auto mr-[8px]"
                />
                <span className="font-['Archivo'] text-[22px] font-semibold text-[#EFE9FC]">
                  {finishedLessonsCount}/{totalLessonsCount} Lessons
                </span>
              </div>
            </div>

            <div className="h-[64px]"></div>

            <div className="w-[1000px] font-['Archivo'] text-[24px] font-normal text-[#EFE9FC] text-left">
              {course?.description || "No course description available"}
            </div>

            <div className="h-[32px]"></div>

            <div className="flex justify-start">
              <button
                className="bg-[#EFE9FC] text-[#5F24E0] font-['Archivo'] text-[22px] font-semibold rounded-[16px] py-[12px] px-[48px] transition-colors duration-200 hover:bg-[#FFBF00]"
                onClick={() => {
                  if (nextNotFinishedLesson) {
                    handleLessonClick(nextNotFinishedLesson);
                  }
                }}
              >
                Continue
              </button>
            </div>

            <div className="h-[32px]"></div>

            <div className="flex items-center w-full">
              <div className="flex-1 relative">
                <div className="absolute right-0 bottom-[calc(100%+8px)] font-['Archivo'] text-[32px] font-semibold text-[#EFE9FC]">
                  {completionPercentage}%
                </div>
                <div className="w-full h-[11px] rounded-[9px] bg-[#EFE9FC] overflow-hidden">
                  <div
                    className="h-full bg-[#FFBF00] transition-all duration-500 ease-in-out"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Rectangle */}
          <div className="mt-[64px] rounded-[32px] shadow-[0px_2px_6px_rgba(0,0,0,0.2)] p-[32px] bg-[#FFFFFF]">
            <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#5F24E0] text-left mb-[32px]">
              {courseTitle}
            </h2>

            <div className="space-y-[16px]">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={cn(
                    "flex items-center rounded-[12px] cursor-pointer transition-colors duration-200",
                    lesson.isFinished
                      ? "bg-[#FFFFFF] hover:bg-[#EFE9FC]"
                      : "bg-[#FFFFFF] hover:bg-[#EFE9FC]",
                    nextNotFinishedLesson &&
                      lesson.id === nextNotFinishedLesson.id
                      ? "bg-[#EFE9FC] hover:bg-[#EAE1FE] py-[7px] px-[32px]"
                      : "py-[24px] px-[32px]"
                  )}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <div
                    className={cn(
                      "w-[14px] h-[14px] rounded-full shrink-0",
                      lesson.isFinished
                        ? "bg-[#5F24E0]"
                        : "bg-white border border-[#5F24E0]"
                    )}
                  ></div>

                  <span className="ml-[16px] font-['Archivo'] text-[24px] font-semibold text-[#1C0B43] text-left">
                    {lesson.lessonOrder}. {lesson.name}
                  </span>

                  {nextNotFinishedLesson &&
                    lesson.id === nextNotFinishedLesson.id && (
                      <button
                        className="ml-auto bg-[#5F24E0] text-[#EFE9FC] font-['Archivo'] text-[22px] font-semibold rounded-[16px] p-[17px] transition-colors duration-200 hover:bg-[#FFBF00] hover:text-[#5F24E0]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLessonClick(lesson);
                        }}
                      >
                        Continue
                      </button>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CoursePage;
