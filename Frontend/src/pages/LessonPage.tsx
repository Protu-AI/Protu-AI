import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import React, { useState, useEffect, useContext } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAuth } from "@/contexts/AuthContext";
import { LessonChatWindow } from "@/components/LessonChatWindow";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "@/../config";

// New component for rendering HTML safely
const HtmlRenderer = ({ htmlContent }: { htmlContent: string }) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        // Sanitize content or use a library for more robust sanitization if needed
        doc.write(`<!DOCTYPE html><html><body>${htmlContent}</body></html>`);
        doc.close();
      }
    }
  }, [htmlContent]);

  return (
    <iframe
      ref={iframeRef}
      title="code-output"
      sandbox="allow-scripts allow-same-origin" // Restrict capabilities for security
      className="w-full h-auto min-h-[100px] bg-[#FFFFFF] border-l-[8px] border-[#FFBF00] px-[32px] py-[12px] !mt-0 !mb-[24px]"
    />
  );
};

const LessonContext = React.createContext({
  codeOutputs: {},
  handleRunCode: (key: string, code: string, language: string) => {},
});

const components = {
  h3: ({ node, ...props }) => (
    <h2
      className="font-['Archivo'] font-medium text-[32px] text-[#5F24E0] text-left mt-0 mb-[24px]"
      {...props}
    />
  ),
  hr: ({ node, ...props }) => (
    <hr className="mt-0 mb-[24px] border-t border-[#D6D6D6]" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p
      className="font-['Archivo'] font-medium text-[16px] text-[#1C0B43] text-left leading-[1.8] mt-0 mb-[24px]" // Changed leading-[1.2] to leading-[1.6]
      {...props}
    />
  ),
  ul: ({ node, ...props }) => (
    <ul
      className="list-disc pl-6 mt-0 mb-[24px]" // Added list-disc and padding
      {...props}
    />
  ),
  ol: ({ node, ...props }) => (
    <ol
      className="list-decimal pl-6 mt-0 mb-[24px]" // Added list-decimal and padding
      {...props}
    />
  ),
  li: ({ node, ...props }) => (
    <li
      className="font-['Archivo'] text-[20px] text-[#1C0B43] leading-[1.6] mb-2 marker:text-[#5F24E0]" // Added leading, text color, and marker color
      {...props}
    />
  ),
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const codeContent = String(children).replace(/\n$/, "");
    const { codeOutputs, handleRunCode } = useContext(LessonContext);
    const codeKey = codeContent;
    const language = match ? match[1] : "plaintext";

    if (!inline && match) {
      return (
        <div className="bg-[#EFE9FC] rounded-[8px] p-[24px] mt-0 mb-[24px]">
          <SyntaxHighlighter
            style={prism}
            language={language}
            PreTag="div"
            className="!bg-[#FFFFFF] border-l-[8px] border-[#5F24E0] px-[32px] py-[12px] !mt-0 !mb-[24px]"
          >
            {codeContent}
          </SyntaxHighlighter>

          {codeOutputs[codeKey] && (
            <div className="bg-[#EFE9FC] rounded-[8px] mt-0 mb-[24px]">
              {language === "html" ? (
                <HtmlRenderer htmlContent={codeOutputs[codeKey]} />
              ) : (
                <div className="!bg-[#FFFFFF] border-l-[8px] border-[#FFBF00] px-[32px] py-[12px] font-['Archivo'] font-medium text-[16px] text-[#1C0B43] text-left leading-[1.2]">
                  {codeOutputs[codeKey]}
                </div>
              )}
            </div>
          )}

          <button
            className="bg-[#5F24E0] text-[#EFE9FC] font-['Archivo'] text-[18px] font-semibold rounded-[16px] py-[12px] px-[24px] transition-colors duration-200 hover:bg-[#9F7CEC]"
            onClick={() => handleRunCode(codeKey, codeContent, language)}
          >
            Run
          </button>
        </div>
      );
    } else {
      return (
        <code className={`${className} mt-0 mb-[24px]`} {...props}>
          {children}
        </code>
      );
    }
  },
};

const LessonPage = () => {
  const { lessonId } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();
  const [codeOutputs, setCodeOutputs] = useState<{ [key: string]: string }>({});
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get lessons array and courseName from navigation state
  const { lessons: courseLessons = [], courseName } = location.state || {};
  const [currentLessonIndex, setCurrentLessonIndex] = useState(-1);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);

        // Fetch current lesson details
        const response = await fetch(`${config.apiUrl}/v1/lessons/${lessonId}`);
        if (!response.ok) throw new Error("Failed to fetch lesson");

        const data = await response.json();
        setLesson(data.data);

        // Find current lesson index in the lessons array
        const index = courseLessons.findIndex((l: any) => l.name === lessonId);
        setCurrentLessonIndex(index);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch lesson");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, courseLessons]);

  const markLessonCompleted = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !user || user.userName === "Guest") return false;

      const response = await fetch(
        `${config.apiUrl}/v1/progress/courses/${courseName}/lessons/${lesson.name}/completed`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error("Error marking lesson complete:", error);
      return false;
    }
  };

  const handleNextLesson = async () => {
    // Mark current lesson complete for authenticated users
    if (user && user.userName !== "Guest") {
      await markLessonCompleted();
    }

    // Determine next lesson
    if (currentLessonIndex < courseLessons.length - 1) {
      const nextLesson = courseLessons[currentLessonIndex + 1];
      navigate(`/lesson/${nextLesson.name}`, {
        state: {
          lessons: courseLessons,
          courseName,
        },
      });
    } else {
      // No more lessons - return to course page
      navigate(`/course/${courseName}`);
    }
  };

  const handleViewCourseClick = () => {
    navigate(courseName ? `/course/${courseName}` : "/");
  };

  const handleRunCode = async (key: string, code: string, language: string) => {
    if (language === "html") {
      // For HTML, directly render in the output area
      setCodeOutputs((prev) => ({ ...prev, [key]: code }));
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setCodeOutputs((prev) => ({
        ...prev,
        [key]: "Error: Not authenticated. Please log in to run code.",
      }));
      return;
    }

    if (user?.userName === "Guest") {
      setCodeOutputs((prev) => ({
        ...prev,
        [key]: "Error: Guest users cannot execute code. Please log in.",
      }));
      return;
    }

    setCodeOutputs((prev) => ({ ...prev, [key]: "Running code..." }));
    try {
      const response = await fetch(`${config.apiUrl}/v1/execute`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: code,
          language: language,
          input: "", // You can add input if your API supports it
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to execute code");
      }

      const data = await response.json();
      setCodeOutputs((prev) => ({
        ...prev,
        [key]: data.output || "No output",
      }));
    } catch (err) {
      setCodeOutputs((prev) => ({
        ...prev,
        [key]: `Error: ${
          err instanceof Error ? err.message : "An unknown error occurred."
        }`,
      }));
      console.error("Error executing code:", err);
    }
  };

  const closedPosition = { right: "128px", top: "144px" };
  const openPosition = { right: "160px", top: "96px" };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5F24E0]"></div>
          <p className="mt-4 font-['Archivo'] text-[16px] text-[#5F24E0]">
            Loading lesson...
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

  if (!lesson) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <p className="font-['Archivo'] text-[16px] text-[#5F24E0]">
            Lesson not found
          </p>
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

  return (
    <MainLayout>
      <div className="flex justify-start w-full overflow-y-auto h-full mt-[64px]">
        <div
          className={cn(
            "flex flex-col items-center w-full transition-all duration-300 ease-in-out pl-[128px]",
            isChatOpen ? "w-[calc(100%-592px)] pr-[32px]" : "w-full pr-[128px]"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-start">
              <div className="w-[6px] h-[80px] bg-[#5F24E0] rounded-md shrink-0"></div>
              <div className="w-[8px] shrink-0"></div>
              <div className="flex flex-col items-start">
                <h1 className="font-['Archivo'] text-[42px] font-semibold text-[#5F24E0] text-left mb-[8px]">
                  {lesson.name}
                </h1>
                <p className="font-['Archivo'] text-[18px] font-semibold text-[#A6B5BB] text-left">
                  {courseLessons.length > 0 &&
                    `Lesson ${currentLessonIndex + 1} of ${
                      courseLessons.length
                    }`}
                </p>
              </div>
            </div>
          </div>
          <div className="h-[64px] shrink-0"></div>
          <div className="rounded-[32px] shadow-[0px_2px_6px_rgba(0,0,0,0.2)] p-[32px] bg-[#FFFFFF] w-full">
            <LessonContext.Provider value={{ codeOutputs, handleRunCode }}>
              <ReactMarkdown components={components}>
                {lesson.content}
              </ReactMarkdown>
            </LessonContext.Provider>
            <div className="flex justify-between mt-[64px]">
              <button
                className="font-['Archivo'] text-[18px] font-semibold text-center rounded-[16px] py-[16px] px-[18px] border-[3px] border-[#5F24E0] text-[#5F24E0] transition-colors duration-200 hover:bg-[#5F24E0] hover:text-[#EFE9FC]"
                onClick={handleViewCourseClick}
              >
                View Course
              </button>
              <button
                className={cn(
                  "font-['Archivo'] text-[18px] font-semibold text-center rounded-[16px] py-[16px] px-[18px] border-[3px] border-[#5F24E0] transition-colors duration-200",
                  currentLessonIndex < courseLessons.length - 1
                    ? "text-[#EFE9FC] bg-[#5F24E0] hover:bg-[#9F7CEC]"
                    : "text-[#5F24E0] bg-transparent hover:bg-[#EFE9FC]"
                )}
                onClick={handleNextLesson}
              >
                {currentLessonIndex < courseLessons.length - 1
                  ? "Next Lesson"
                  : "Finish Course"}
              </button>
            </div>
          </div>
        </div>
        <LessonChatWindow
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen}
          userName={user?.userName || "Guest"}
        />
      </div>

      <motion.button
        className={cn(
          "fixed z-50 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200",
          isChatOpen
            ? "bg-transparent text-[#5F24E0] dark:text-[#FFBF00] w-[20px] h-[20px]"
            : "bg-[#5F24E0] hover:bg-[#9F7CEC] w-[80px] h-[80px]"
        )}
        initial={closedPosition}
        animate={isChatOpen ? openPosition : closedPosition}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          right: isChatOpen ? "160px" : "128px",
          top: isChatOpen ? "96px" : "144px",
        }}
      >
        <AnimatePresence mode="wait">
          {isChatOpen ? (
            <motion.div
              key="close-icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-[20px] h-[20px] stroke-[4px]" />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-[40px] h-[40px] text-[#FFBF00]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </MainLayout>
  );
};

export default LessonPage;
