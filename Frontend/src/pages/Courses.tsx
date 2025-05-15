import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

export function Courses() {
  const { theme } = useTheme();
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-start w-full overflow-y-auto h-full">
        <h1 className="font-['Archivo'] text-[36px] font-semibold text-center text-[#0E1117] dark:text-[#EFE9FC] mt-[128px]">
          EXPLORE{" "}
          <span className="text-[#5F24E0] dark:text-[#BFA7F3]">
            PROGRAMMING
          </span>{" "}
          PATHS
        </h1>
        <p className="font-['Archivo'] text-[16px] text-center text-[#ABABAB] mt-[16px]">
          Choose a category and start your learning journey today
        </p>

        <div className="w-full mt-[64px]">
          <CourseCategory title="Frontend Development" />
        </div>
        <div className="w-full mt-[79.5px]">
          <CourseCategory title="AI & Data" />
        </div>
        <div className="w-full mt-[79.5px]">
          <CourseCategory title="Backend Development" />
        </div>
        <div className="w-full mt-[79.5px]">
          <CourseCategory title="Mobile Development" />
        </div>

        <div className="pb-16"></div>
      </div>
    </MainLayout>
  );
}

interface CourseCategoryProps {
  title: string;
}

function CourseCategory({ title }: CourseCategoryProps) {
  const [calculatedWidth, setCalculatedWidth] = useState(0);
  const titleRef = useRef(null);

  useEffect(() => {
    const calculateWidth = () => {
      if (titleRef.current) {
        const titleWidth = titleRef.current.offsetWidth;
        const newCalculatedWidth = Math.max(0, (1622 - titleWidth - 78) / 2);
        setCalculatedWidth(newCalculatedWidth);
      }
    };

    // Call calculateWidth on initial render and when the window resizes
    calculateWidth();
    window.addEventListener('resize', calculateWidth);

    // Clean up the event listener
    return () => window.removeEventListener('resize', calculateWidth);
  }, [title]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Outer container with fixed width */}
      <div className="w-[1622px] flex items-center">
        {/* Left line */}
        <div
          className="h-[1px] bg-[#D6D6D6]"
          style={{ width: `${calculatedWidth}px` }}
        ></div>

        {/* Title */}
        <h2
          className="font-['Archivo'] text-[28px] font-medium text-[#5F24E0] text-center mx-[39px] whitespace-nowrap"
          ref={titleRef}
        >
          {title}
        </h2>

        {/* Right line */}
        <div
          className="h-[1px] bg-[#D6D6D6]"
          style={{ width: `${calculatedWidth}px` }}
        ></div>
      </div>

      <div className="w-[1622px] mt-[64px] grid grid-cols-3 gap-7">
        <CoursePath
          title="Frontend Development"
          description="Learn to build modern, responsive, and dynamic web applications using HTML, CSS, and JavaScript. This path covers frameworks like React and Vue.js, responsive design principles, and user interface best practices to create seamless web experiences."
          coursesNumber={10}
        />
        <CoursePath
          title="AI & Data"
          description="Explore the world of artificial intelligence and data science. This path covers machine learning algorithms, data analysis techniques, and practical applications in various domains."
          coursesNumber={5}
        />
        <CoursePath
          title="Backend Development"
          description="Master the art of building robust and scalable backend systems. This path covers server-side programming languages, databases, APIs, and cloud computing concepts."
          coursesNumber={8}
        />
      </div>
    </div>
  );
}

interface CoursePathProps {
  title: string;
  description: string;
  coursesNumber: number;
}

function CoursePath({ title, description, coursesNumber }: CoursePathProps) {
  // Function to generate URL-friendly slug
  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  };

  const pathSlug = slugify(title);

  return (
    <div className="rounded-[32px] bg-card shadow-[0px_2px_6px_rgba(0,0,0,0.1)] p-[32px] flex flex-col h-full">
      <div className="flex justify-between items-center">
        <p className="font-['Archivo'] text-[16px] text-[#ABABAB]">PATH</p>
        <p className="font-['Archivo'] text-[16px] text-[#ABABAB]">
          {coursesNumber} Courses
        </p>
      </div>
      <h3 className="font-['Archivo'] text-[28px] font-semibold text-[#5F24E0] mt-[16px]">
        {title}
      </h3>
      <p className="font-['Archivo'] text-[16px] text-[#ABABAB] mt-[16px] flex-grow">
        {description}
      </p>
      <div style={{ height: '32px' }}></div>
      <Link to={`/path/${pathSlug}`}>
        <button className="bg-[#5F24E0] text-[#EFE9FC] text-[22px] font-medium rounded-[16px] px-12 py-3 self-start transition-all hover:bg-[#9F7CEC] active:bg-[#9F7CEC]">
          Explore
        </button>
      </Link>
    </div>
  );
}
