import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { config } from "@/../config";

export function Learn() {
  const { theme } = useTheme();
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/v1/tracks`);
        if (!response.ok) {
          throw new Error("Failed to fetch tracks");
        }
        const data = await response.json();
        setTracks(data.data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching tracks"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5F24E0]"></div>
          <p className="mt-4 font-['Archivo'] text-[16px] text-[#5F24E0]">
            Loading tracks...
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
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#5F24E0] text-[#EFE9FC]"
          >
            Retry
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Group tracks by category
  const webTracks = tracks.filter(
    (track) => track.name.includes("Frontend") || track.name.includes("Backend")
  );
  const aiDataTracks = tracks.filter(
    (track) => track.name.includes("AI") || track.name.includes("Data")
  );
  const mobileTracks = tracks.filter((track) => track.name.includes("Mobile"));
  const cyberSecurityTracks = tracks.filter((track) =>
    track.name.includes("CyberSec")
  );

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

        {webTracks.length > 0 && (
          <div className="w-full mt-[64px]">
            <CourseCategory title="Web Development" tracks={webTracks} />
          </div>
        )}

        {aiDataTracks.length > 0 && (
          <div className="w-full mt-[79.5px]">
            <CourseCategory title="AI & Data" tracks={aiDataTracks} />
          </div>
        )}

        {mobileTracks.length > 0 && (
          <div className="w-full mt-[79.5px]">
            <CourseCategory title="Mobile Development" tracks={mobileTracks} />
          </div>
        )}

        {cyberSecurityTracks.length > 0 && (
          <div className="w-full mt-[79.5px]">
            <CourseCategory
              title="CyberSecurity"
              tracks={cyberSecurityTracks}
            />
          </div>
        )}

        <div className="pb-16"></div>
      </div>
    </MainLayout>
  );
}

interface CourseCategoryProps {
  title: string;
  tracks: any[];
}

function CourseCategory({ title, tracks }: CourseCategoryProps) {
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

    calculateWidth();
    window.addEventListener("resize", calculateWidth);

    return () => window.removeEventListener("resize", calculateWidth);
  }, [title]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-[1622px] flex items-center">
        <div
          className="h-[1px] bg-[#D6D6D6]"
          style={{ width: `${calculatedWidth}px` }}
        ></div>

        <h2
          className="font-['Archivo'] text-[28px] font-medium text-[#5F24E0] text-center mx-[39px] whitespace-nowrap"
          ref={titleRef}
        >
          {title}
        </h2>

        <div
          className="h-[1px] bg-[#D6D6D6]"
          style={{ width: `${calculatedWidth}px` }}
        ></div>
      </div>

      <div className="w-[1622px] mt-[64px] grid grid-cols-3 gap-7">
        {tracks.map((track) => (
          <CoursePath key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}

interface CoursePathProps {
  track: any;
}

function CoursePath({ track }: CoursePathProps) {
  const slugify = (str: string) => {
    return str;
    // .toLowerCase()
    // .replace(/ /g, "-")
    // .replace(/[^\w-]+/g, "");
  };

  const pathSlug = slugify(track.name);

  return (
    <div className="rounded-[32px] bg-card shadow-[0px_2px_6px_rgba(0,0,0,0.1)] p-[32px] flex flex-col h-full">
      <div className="flex justify-between items-center">
        <p className="font-['Archivo'] text-[16px] text-[#ABABAB]">PATH</p>
        <p className="font-['Archivo'] text-[16px] text-[#ABABAB]">
          {track.courses?.length || 0} Courses
        </p>
      </div>
      <h3 className="font-['Archivo'] text-[28px] font-semibold text-[#5F24E0] mt-[16px]">
        {track.name}
      </h3>
      <p className="font-['Archivo'] text-[16px] text-[#ABABAB] mt-[16px] flex-grow">
        {track.description || "No description available"}
      </p>
      <div style={{ height: "32px" }}></div>
      <Link to={`/path/${pathSlug}`}>
        <button className="bg-[#5F24E0] text-[#EFE9FC] text-[22px] font-medium rounded-[16px] px-12 py-3 self-start transition-all hover:bg-[#9F7CEC] active:bg-[#9F7CEC]">
          Explore
        </button>
      </Link>
    </div>
  );
}
