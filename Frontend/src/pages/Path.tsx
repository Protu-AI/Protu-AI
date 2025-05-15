import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { config } from "@/../config";

interface Course {
  id: number;
  name: string;
  description: string;
  lessons: any[];
  createdAt: string;
  updatedAt: string;
}

export function Path() {
  const { pathName } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackName, setTrackName] = useState("");

  useEffect(() => {
    if (!pathName) {
      setError("No track specified");
      setLoading(false);
      return;
    }

    const originalName = pathName.replace(/-/g, " ");
    setTrackName(originalName);

    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/v1/tracks/${originalName}/courses`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        setCourses(data.data || []);
      } catch (err) {
        setError(err.message || "An error occurred while fetching courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [pathName]);

  const CourseItem = ({ course }: { course: Course }) => {
    const courseName = course.name;
    const lessonsCount = course.lessons?.length || 0;
    const durationHours = Math.ceil(lessonsCount * 0.5); // Assuming 30min per lesson

    return (
      <div className="w-[1500px] rounded-[32px] shadow-[0_2px_6px_rgba(0,0,0,0.2)] mb-[64px] p-[32px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <div className="flex items-center flex-col items-start">
              <div className="flex items-center">
                <img
                  src="https://img.icons8.com/ios-filled/100/5F24E0/html-5.png"
                  alt={`${course.name} Icon`}
                  className="w-[100px] h-[113px]"
                />
                <div className="ml-[32px] font-['Archivo'] text-[48px] font-semibold">
                  {course.name}
                  <div className="flex items-center mt-2">
                    <img
                      src="https://img.icons8.com/ios-filled/16/A6B5BB/book.png"
                      alt="Book Icon"
                      className="h-[16px]"
                    />
                    <span
                      className="ml-2 font-['Archivo'] font-semibold text-[16px]"
                      style={{ color: "#A6B5BB" }}
                    >
                      {lessonsCount} Lessons
                    </span>
                    <img
                      src="https://img.icons8.com/ios-filled/16/A6B5BB/timer.png"
                      alt="Timer Icon"
                      className="ml-4 h-[16px]"
                    />
                    <span
                      className="ml-2 font-['Archivo'] font-semibold text-[16px]"
                      style={{ color: "#A6B5BB" }}
                    >
                      {durationHours} hours
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link to={`/course/${courseName}`} state={{ course }}>
            <button className="bg-[#5F24E0] text-[#EFE9FC] rounded-[16px] px-[48px] py-[12px] ml-[32px] hover:bg-[#9F7CEC] font-['Archivo'] font-semibold text-[22px]">
              Open Course
            </button>
          </Link>
        </div>
        <div className="mt-[28px]">
          <div className="w-full h-[1px] bg-[#D6D6D6]"></div>
        </div>
        <div
          className="mt-[32px] font-['Archivo'] text-[24px]"
          style={{ color: "#ABABAB", textAlign: "left" }}
        >
          {course.description || "No description available"}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5F24E0]"></div>
          <p className="mt-4 font-['Archivo'] text-[16px] text-[#5F24E0]">
            Loading courses for {trackName || "this track"}...
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
          <Button
            onClick={() => navigate(-1)}
            className="mt-4 bg-[#5F24E0] text-[#EFE9FC]"
          >
            Go Back
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-start w-full overflow-y-auto h-full">
        <h1 className="font-['Archivo'] text-[36px] font-semibold text-center text-[#0E1117] dark:text-[#EFE9FC] mt-[128px]">
          COURSES IN{" "}
          <span className="text-[#5F24E0] dark:text-[#BFA7F3]">
            {trackName}
          </span>
        </h1>
        <p className="font-['Archivo'] text-[16px] text-center text-[#ABABAB] mt-[16px]">
          Master new skills with hands-on courses
        </p>
        <div className="mb-[64px]"></div>

        {/* Courses */}
        <div className="flex flex-col items-center w-full">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseItem key={course.id} course={course} />
            ))
          ) : (
            <div className="w-[1500px] rounded-[32px] shadow-[0_2px_6px_rgba(0,0,0,0.2)] mb-[64px] p-[32px] text-center">
              <p className="font-['Archivo'] text-[24px] text-[#ABABAB]">
                No courses available for this track yet
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
