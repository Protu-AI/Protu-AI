import { MainLayout } from "@/layouts/MainLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../../config"; // Make sure this path is correct

interface Quiz {
  id: string;
  title: string;
  topic: string;
  duration: string;
  date: string;
  score: number;
  status: "passed" | "failed";
}

interface DraftQuiz {
  id: string;
  title: string;
  topic: string;
  createdDate: string;
}

export function QuizHistory() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"passed" | "failed">(
    "passed"
  );
  const [showDrafts, setShowDrafts] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "topic" | "score" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for API data
  const [summaryData, setSummaryData] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    successRate: 0,
  });
  const [passedQuizzes, setPassedQuizzes] = useState<Quiz[]>([]);
  const [failedQuizzes, setFailedQuizzes] = useState<Quiz[]>([]);
  const [draftQuizzes, setDraftQuizzes] = useState<DraftQuiz[]>([]);

  // Helper function to format duration (seconds to mm:ss)
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Helper function to format date (ISO string to MMM dd, yyyy)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStartQuiz = (draftId: string) => {
    navigate(`/quizzes/take/${draftId}`);
  };

  // Fetch dashboard summary
  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${config.apiUrl}/v1/quizzes/dashboard/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard summary");
      }

      const data = await response.json();
      setSummaryData({
        totalQuizzes: data.data.totalQuizzes,
        averageScore: Math.round(parseFloat(data.data.averageScore) * 10) / 10,
        successRate: Math.round(parseFloat(data.data.successRate) * 10) / 10,
      });
    } catch (err) {
      setError("Failed to load dashboard summary");
      console.error(err);
    }
  };

  // Fetch passed quizzes
  const fetchPassedQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${config.apiUrl}/v1/quizzes/dashboard/passed?page=1&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch passed quizzes");
      }

      const data = await response.json();
      const formattedQuizzes = data.data.quizzes.map((quiz: any) => ({
        id: quiz.id,
        title: quiz.title,
        topic: quiz.topic,
        duration: formatDuration(quiz.timeTaken),
        date: formatDate(quiz.dateTaken),
        score: Math.round(parseFloat(quiz.score) * 10) / 10,
        status: "passed" as const,
      }));
      setPassedQuizzes(formattedQuizzes);
    } catch (err) {
      setError("Failed to load passed quizzes");
      console.error(err);
    }
  };

  // Fetch failed quizzes
  const fetchFailedQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${config.apiUrl}/v1/quizzes/dashboard/failed?page=1&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch failed quizzes");
      }

      const data = await response.json();
      const formattedQuizzes = data.data.quizzes.map((quiz: any) => ({
        id: quiz.id,
        title: quiz.title,
        topic: quiz.topic,
        duration: formatDuration(quiz.timeTaken),
        date: formatDate(quiz.dateTaken),
        score: Math.round(parseFloat(quiz.score) * 10) / 10,
        status: "failed" as const,
      }));
      setFailedQuizzes(formattedQuizzes);
    } catch (err) {
      setError("Failed to load failed quizzes");
      console.error(err);
    }
  };

  // Fetch draft quizzes
  const fetchDraftQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${config.apiUrl}/v1/quizzes/dashboard/drafts?page=1&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch draft quizzes");
      }

      const data = await response.json();
      const formattedDrafts = data.data.quizzes.map((draft: any) => ({
        id: draft.id,
        title: draft.title,
        topic: draft.topic,
        createdDate: formatDate(draft.dateTaken),
      }));
      setDraftQuizzes(formattedDrafts);
    } catch (err) {
      setError("Failed to load draft quizzes");
      console.error(err);
    }
  };

  // Delete a draft quiz
  const handleDeleteDraft = async (quizId: string, quizTitle: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      // Confirmation dialog before deleting (replace with custom modal if needed)
      if (!window.confirm(`Are you sure you want to delete "${quizTitle}"?`)) {
        return;
      }

      const response = await fetch(`${config.apiUrl}/v1/quizzes/${quizId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: quizTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete draft quiz.");
      }

      const data = await response.json();
      console.log("Delete successful:", data.message);
      // Optionally, refresh the draft quizzes list or remove the deleted quiz from state
      setDraftQuizzes((prevDrafts) =>
        prevDrafts.filter((draft) => draft.id !== quizId)
      );
      // You might also want to refetch the summary data if it's affected
      fetchSummary();
    } catch (err: any) {
      console.error("Error deleting draft quiz:", err.message);
      setError(`Error deleting quiz: ${err.message}`); // Set a user-friendly error message
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await fetchSummary();
        await fetchPassedQuizzes();
      } catch (err) {
        setError("Failed to load initial data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeFilter === "passed") {
      fetchPassedQuizzes();
    } else {
      fetchFailedQuizzes();
    }
  }, [activeFilter]);

  useEffect(() => {
    if (showDrafts) {
      fetchDraftQuizzes();
    }
  }, [showDrafts]);

  const handleSort = (type: "date" | "topic" | "score") => {
    if (sortBy === type) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(type);
      setSortDirection("desc");
    }
  };

  // Filter and sort quizzes
  const getFilteredAndSortedQuizzes = () => {
    let quizzes =
      activeFilter === "passed" ? [...passedQuizzes] : [...failedQuizzes];

    if (sortBy) {
      quizzes.sort((a, b) => {
        let compareValue = 0;

        switch (sortBy) {
          case "date":
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            compareValue = dateA - dateB;
            break;
          case "topic":
            compareValue = a.topic.localeCompare(b.topic);
            break;
          case "score":
            compareValue = a.score - b.score;
            break;
        }

        return sortDirection === "asc" ? compareValue : -compareValue;
      });
    }

    return quizzes;
  };

  const filteredQuizzes = getFilteredAndSortedQuizzes();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col w-full overflow-y-auto h-full pt-[64px] px-[128px]">
        {/* Header Section with Button */}
        <div className="flex justify-between items-start mb-[68px]">
          {/* Header Texts */}
          <div className="text-left">
            <h1 className="font-['Archivo'] text-[64px] font-semibold text-[#5F24E0] mb-[6px] text-left">
              Your Quiz Dashboard
            </h1>
            <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
              Track your progress, review past quizzes, and keep improving your
              skills
            </p>
          </div>

          {/* Generate New Quiz Button */}
          <button
            onClick={() => navigate("/quizzes/generate")}
            className="text-[#EFE9FC] font-['Archivo'] text-[28px] font-semibold rounded-[24px] py-[24px] px-[64px] transition-all duration-200 flex items-center gap-[16px] group hover:shadow-[inset_0px_0px_9px_#FFFFFF,_0px_6px_38px_#FFBF0036,_0_0_0_3px_#FFBF0080]"
            style={{
              background: "radial-gradient(circle, #BFA7F3 0%, #5F24E0 100%)",
              boxShadow: "inset 0px 0px 9px #FFFFFF, 0px 42px 38px #BFA7F336",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "inset 0px 0px 9px #FFFFFF, 0px 6px 38px #FFBF0036, 0 0 0 3px #FFBF0080";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "inset 0px 0px 9px #FFFFFF, 0px 42px 38px #BFA7F336";
            }}
          >
            <svg
              width="45"
              height="45"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#EFE9FC] group-hover:text-[#FFBF00] transition-colors duration-200"
              strokeWidth="2"
            >
              <path
                d="M12 5V19"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Generate New Quiz
          </button>
        </div>

        {/* Stats Cards Section */}
        <div className="flex gap-[48px] mb-[64px]">
          {/* Total Quizzes Card */}
          <div
            className="rounded-[24px] p-[24px] flex-1 text-left"
            style={{
              background:
                "linear-gradient(60deg, #D3C2F680 0%, #EFE9FC80 100%)",
            }}
          >
            <div className="bg-[#FFFFFF] rounded-[12px] w-[56px] h-[56px] flex items-center justify-center mb-[24px]">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#5F24E0]"
                strokeWidth="2"
              >
                <path
                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2V8H20"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 13H8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 17H8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 9H9H8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-['Archivo'] text-[24px] font-semibold text-left mb-[16px]">
              Total Quizzes
            </h3>
            <p className="font-['Archivo'] text-[48px] font-semibold text-[#5F24E0] text-left">
              {summaryData.totalQuizzes}
            </p>
          </div>

          {/* Average Score Card */}
          <div
            className="rounded-[24px] p-[24px] flex-1 text-left"
            style={{
              background:
                "linear-gradient(241deg, #FFE8A280 0%, #FFF9E680 100%)",
            }}
          >
            <div className="bg-[#FFFFFF] rounded-[12px] w-[56px] h-[56px] flex items-center justify-center mb-[24px]">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#FFBF00]"
                strokeWidth="2"
              >
                <path
                  d="M3 3V21H21"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 12L12 7L16 11L21 6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 6H21V10"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-['Archivo'] text-[24px] font-semibold text-left mb-[16px]">
              Average Score
            </h3>
            <p className="font-['Archivo'] text-[48px] font-semibold text-[#FFBF00] text-left">
              {summaryData.averageScore}%
            </p>
          </div>

          {/* Success Rate Card */}
          <div
            className="rounded-[24px] p-[24px] flex-1 text-left"
            style={{
              background:
                "linear-gradient(60deg, #C0F1DA80 0%, #EEFBF580 100%)",
            }}
          >
            <div className="bg-[#FFFFFF] rounded-[12px] w-[56px] h-[56px] flex items-center justify-center mb-[24px]">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#52D999]"
                strokeWidth="2"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 3V15"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 21H21"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-['Archivo'] text-[24px] font-semibold text-left mb-[16px]">
              Success Rate
            </h3>
            <p className="font-['Archivo'] text-[48px] font-semibold text-[#52D999] text-left">
              {summaryData.successRate}%
            </p>
          </div>
        </div>

        {/* Quiz History Section */}
        <div
          className="w-full p-[35px] bg-[#FFFFFF] rounded-[32px]"
          style={{
            boxShadow: "0px 2px 6px #00000014",
          }}
        >
          {/* Header with Filter Buttons */}
          <div className="flex justify-between items-center mb-[24px]">
            {/* Quiz History Title */}
            <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#1C0B43] text-left">
              Quiz History
            </h2>

            {/* Filter Buttons */}
            <div className="flex items-center gap-[24px]">
              {/* Passed/Failed Toggle Group */}
              <div className="flex">
                <button
                  onClick={() => setActiveFilter("passed")}
                  className={`font-['Archivo'] text-[16px] font-semibold text-center py-[16px] px-[24px] rounded-l-[16px] transition-colors duration-200 ${
                    activeFilter === "passed"
                      ? "bg-[#5F24E0] text-[#EFE9FC]"
                      : "bg-[#EFE9FC] text-[#1C0B43]"
                  }`}
                >
                  Passed
                </button>
                <button
                  onClick={() => setActiveFilter("failed")}
                  className={`font-['Archivo'] text-[16px] font-semibold text-center py-[16px] px-[24px] rounded-r-[16px] transition-colors duration-200 ${
                    activeFilter === "failed"
                      ? "bg-[#5F24E0] text-[#EFE9FC]"
                      : "bg-[#EFE9FC] text-[#1C0B43]"
                  }`}
                >
                  Failed
                </button>
              </div>

              {/* Drafts Button */}
              <button
                onClick={() => setShowDrafts(!showDrafts)}
                className={`font-['Archivo'] text-[16px] font-semibold text-center py-[16px] px-[24px] rounded-[16px] transition-colors duration-200 ${
                  showDrafts
                    ? "bg-[#5F24E0] text-[#EFE9FC]"
                    : "bg-[#EFE9FC] text-[#1C0B43]"
                }`}
              >
                Drafts
              </button>
            </div>
          </div>

          {/* Sort By Section */}
          <div className="flex justify-end mb-[24px]">
            <div className="flex items-center gap-[8px]">
              <span className="font-['Archivo'] text-[20px] font-medium text-[#A6B5BB]">
                Sort By:
              </span>

              {/* Date Sort */}
              <button
                onClick={() => handleSort("date")}
                className={`font-['Archivo'] text-[20px] font-medium text-left flex items-center gap-[4px] transition-colors duration-200 ${
                  sortBy === "date" ? "text-[#5F24E0]" : "text-[#A6B5BB]"
                }`}
              >
                Date
                {sortBy === "date" && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#5F24E0]"
                    strokeWidth="2"
                  >
                    {sortDirection === "asc" ? (
                      <path
                        d="M7 14L12 9L17 14"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <path
                        d="M7 10L12 15L17 10"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                )}
              </button>

              {/* Topic Sort */}
              <button
                onClick={() => handleSort("topic")}
                className={`font-['Archivo'] text-[20px] font-medium text-left flex items-center gap-[4px] transition-colors duration-200 ${
                  sortBy === "topic" ? "text-[#5F24E0]" : "text-[#A6B5BB]"
                }`}
              >
                Topic
                {sortBy === "topic" && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#5F24E0]"
                    strokeWidth="2"
                  >
                    {sortDirection === "asc" ? (
                      <path
                        d="M7 14L12 9L17 14"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <path
                        d="M7 10L12 15L17 10"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                )}
              </button>

              {/* Score Sort */}
              <button
                onClick={() => handleSort("score")}
                className={`font-['Archivo'] text-[20px] font-medium text-left flex items-center gap-[4px] transition-colors duration-200 ${
                  sortBy === "score" ? "text-[#5F24E0]" : "text-[#A6B5BB]"
                }`}
              >
                Score
                {sortBy === "score" && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#5F24E0]"
                    strokeWidth="2"
                  >
                    {sortDirection === "asc" ? (
                      <path
                        d="M7 14L12 9L17 14"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <path
                        d="M7 10L12 15L17 10"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Quiz List */}
          <div className="space-y-[16px]">
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="w-full p-[24px] rounded-[16px] border border-[#A6B5BB] flex justify-between items-center"
                >
                  {/* Left Side - Title and Tags */}
                  <div className="flex flex-col">
                    {/* Quiz Title */}
                    <h3 className="font-['Archivo'] text-[32px] font-medium text-[#1C0B43] text-left mb-[20px]">
                      {quiz.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex items-center gap-[20px]">
                      {/* Topic Tag */}
                      <div className="flex items-center gap-[8px] bg-[#EFE9FC] rounded-[16px] py-[4px] px-[12px]">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-[#1C0B43]"
                          strokeWidth="2"
                        >
                          <path
                            d="M9 12L11 14L15 10"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="font-['Archivo'] text-[18px] font-medium text-[#1C0B43] text-left">
                          {quiz.topic}
                        </span>
                      </div>

                      {/* Duration Tag */}
                      <div className="flex items-center gap-[8px] bg-[#EFE9FC] rounded-[16px] py-[4px] px-[12px]">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-[#1C0B43]"
                          strokeWidth="2"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 6V12L16 14"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="font-['Archivo'] text-[18px] font-medium text-[#1C0B43] text-left">
                          {quiz.duration}
                        </span>
                      </div>

                      {/* Date Tag */}
                      <div className="flex items-center gap-[8px] bg-[#EFE9FC] rounded-[16px] py-[4px] px-[12px]">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-[#1C0B43]"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="16"
                            y1="2"
                            x2="16"
                            y2="6"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="8"
                            y1="2"
                            x2="8"
                            y2="6"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="3"
                            y1="10"
                            x2="21"
                            y2="10"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="font-['Archivo'] text-[18px] font-medium text-[#1C0B43] text-left">
                          {quiz.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Buttons and Grade */}
                  <div className="flex items-center gap-[24px]">
                    {/* Grade */}
                    <div className="flex flex-col items-center">
                      <p
                        className={`font-['Archivo'] text-[32px] font-semibold text-center mb-[2px] ${
                          quiz.status === "passed"
                            ? "text-[#52D999]"
                            : "text-[#870056]"
                        }`}
                      >
                        {quiz.score}%
                      </p>
                      <p
                        className={`font-['Archivo'] text-[22px] font-semibold text-center ${
                          quiz.status === "passed"
                            ? "text-[#52D999]"
                            : "text-[#870056]"
                        }`}
                      >
                        {quiz.status === "passed" ? "Passed" : "Failed"}
                      </p>
                    </div>

                    {/* Preview Button */}
                    <button className="p-[12px] rounded-[16px] bg-[#EFE9FC] hover:bg-[#9F7CEC] transition-colors duration-200 group">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-[#5F24E0] group-hover:text-[#EFE9FC]"
                        strokeWidth="2"
                      >
                        <path
                          d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Retry Button */}
                    <button className="p-[12px] rounded-[16px] bg-[#EFE9FC] hover:bg-[#9F7CEC] transition-colors duration-200 group">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-[#5F24E0] group-hover:text-[#EFE9FC]"
                        strokeWidth="2"
                      >
                        <path
                          d="M1 4V10H7"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.51 15A9 9 0 1 0 6 5L1 10"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No quizzes found for {activeFilter} quizzes
              </div>
            )}
          </div>

          {/* Draft Quizzes Section - Show when showDrafts is true */}
          {showDrafts && (
            <>
              {/* Spacing */}
              <div className="mb-[24px]"></div>

              {/* Horizontal Line */}
              <div className="w-full h-[1px] bg-[#A6B5BB] mb-[24px]"></div>

              {/* Draft Quizzes Header */}
              <h3 className="font-['Archivo'] text-[32px] font-semibold text-[#1C0B43] text-left mb-[24px]">
                Draft Quizzes
              </h3>

              {/* Draft Quiz List */}
              <div className="space-y-[16px]">
                {draftQuizzes.length > 0 ? (
                  draftQuizzes.map((draft) => (
                    <div
                      key={draft.id}
                      className="w-full p-[24px] rounded-[16px] border border-[#A6B5BB] flex justify-between items-center"
                    >
                      {/* Left Side - Title and Tags */}
                      <div className="flex flex-col">
                        {/* Quiz Title */}
                        <h3 className="font-['Archivo'] text-[32px] font-medium text-[#1C0B43] text-left mb-[20px]">
                          {draft.title}
                        </h3>

                        {/* Tags - Only Topic and Date */}
                        <div className="flex items-center gap-[20px]">
                          {/* Topic Tag */}
                          <div className="flex items-center gap-[8px] bg-[#EFE9FC] rounded-[16px] py-[4px] px-[12px]">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-[#1C0B43]"
                              strokeWidth="2"
                            >
                              <path
                                d="M9 12L11 14L15 10"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="font-['Archivo'] text-[18px] font-medium text-[#1C0B43] text-left">
                              {draft.topic}
                            </span>
                          </div>

                          {/* Date Tag */}
                          <div className="flex items-center gap-[8px] bg-[#EFE9FC] rounded-[16px] py-[4px] px-[12px]">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-[#1C0B43]"
                              strokeWidth="2"
                            >
                              <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <line
                                x1="16"
                                y1="2"
                                x2="16"
                                y2="6"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <line
                                x1="8"
                                y1="2"
                                x2="8"
                                y2="6"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <line
                                x1="3"
                                y1="10"
                                x2="21"
                                y2="10"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="font-['Archivo'] text-[18px] font-medium text-[#1C0B43] text-left">
                              Created: {draft.createdDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Start and Delete Buttons */}
                      <div className="flex items-center gap-[24px]">
                        {/* Start Button */}
                        <button
                          onClick={() => handleStartQuiz(draft.id)}
                          className="py-[12px] px-[24px] rounded-[16px] bg-[#EFE9FC] hover:bg-[#9F7CEC] transition-colors duration-200 group"
                        >
                          <span className="font-['Archivo'] text-[16px] font-semibold text-center text-[#5F24E0] group-hover:text-[#EFE9FC]">
                            Start
                          </span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() =>
                            handleDeleteDraft(draft.id, draft.title)
                          }
                          className="p-[12px] rounded-[16px] bg-[#EFE9FC] hover:bg-[#9F7CEC] transition-colors duration-200 group"
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[#5F24E0] group-hover:text-[#EFE9FC]"
                            strokeWidth="2"
                          >
                            <path
                              d="M3 6H5H21"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No draft quizzes found
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="pb-[64px]"></div>
      </div>
    </MainLayout>
  );
}
