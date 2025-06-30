import { useParams } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import React, { useState, useEffect } from "react";

interface Course {
  id: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  icon: string;
}

const CoursePathPage = () => {
  const { pathName } = useParams();
  const [courses, setCourses] = useState<Course[]>([]);

  const formatPathName = (pathName: string) => {
    return pathName
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const coursePathTitle = formatPathName(pathName || "").toUpperCase();

  useEffect(() => {
    // Replace this with actual API call
    const fetchCourses = async () => {
      try {
        // const response = await fetch(`/api/courses?path=${pathName}`);
        // const data = await response.json();
        // setCourses(data);
        // Mock data for now
        const mockCourses: Course[] = [
          {
            id: "3",
            title: "React for Beginners",
            description:
              "Dive into React and learn how to build user interfaces with components.",
            lessons: 15,
            duration: "10 hours",
            icon: "https://img.icons8.com/ios-filled/100/5F24E0/html-5.png",
          },
          {
            id: "1",
            title: "HTML & CSS for Beginners",
            description:
              "Start your web development journey by mastering the fundamentals of HTML and CSS. Learn how to structure pages, apply styles, and create responsive layouts using Flexbox and Grid.",
            lessons: 12,
            duration: "8 hours",
            icon: "https://img.icons8.com/ios-filled/100/5F24E0/html-5.png",
          },
          {
            id: "2",
            title: "JavaScript for Beginners",
            description:
              "Learn the fundamentals of JavaScript. Understand variables, loops, functions, and more.",
            lessons: 10,
            duration: "6 hours",
            icon: "https://img.icons8.com/ios-filled/100/5F24E0/html-5.png",
          },
        ];
        setCourses(mockCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, [pathName]);

  const CourseItem = ({ course }: { course: Course }) => (
    <div className="w-[1500px] rounded-[32px] shadow-[0_2px_6px_rgba(0,0,0,0.2)] mb-[64px] p-[32px]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <div className="flex items-center flex-col items-start">
            <div className="flex items-center">
              <img
                src={course.icon}
                alt={`${course.title} Icon`}
                className="w-[100px] h-[113px]"
              />
              <div className="ml-[32px] font-['Archivo'] text-[48px] font-semibold">
                {course.title}
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
                    {course.lessons} Lessons
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
                    {course.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="bg-[#5F24E0] text-[#EFE9FC] rounded-[16px] px-[48px] py-[12px] ml-[32px] hover:bg-[#9F7CEC] font-['Archivo'] font-semibold text-[22px]">
          Open Course
        </button>
      </div>
      <div className="mt-[28px]">
        <div className="w-full h-[1px] bg-[#D6D6D6]"></div>
      </div>
      <div
        className="mt-[32px] font-['Archivo'] text-[24px]"
        style={{ color: "#ABABAB", textAlign: "left" }}
      >
        {course.description}
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-start w-full overflow-y-auto h-full">
        <h1 className="font-['Archivo'] text-[36px] font-semibold text-center text-[#0E1117] dark:text-[#EFE9FC] mt-[128px]">
          COURSES IN{" "}
          <span className="text-[#5F24E0] dark:text-[#BFA7F3]">
            {coursePathTitle}
          </span>
        </h1>
        <p className="font-['Archivo'] text-[16px] text-center text-[#ABABAB] mt-[16px]">
          Master new skills with hands-on courses
        </p>
        <div className="mb-[64px]"></div>

        {/* Courses */}
        <div className="flex flex-col items-center w-full">
          {courses.map((course) => (
            <CourseItem key={course.id} course={course} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default CoursePathPage;
