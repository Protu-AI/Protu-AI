import { useState, useEffect } from "react";
import { QuizDashboard } from "./QuizDashboard";
import { QuizHistory } from "./QuizHistory";
import { config } from "../../../config";

// Export the QuizGenerator for easy importing
export { QuizGenerator } from "./QuizGenerator";

export function Quizzes() {
  const [hasPastQuizzes, setHasPastQuizzes] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuizSummary = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          // If no token, assume no past quizzes for now
          setHasPastQuizzes(false);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${config.apiUrl}/v1/quizzes/dashboard/summary`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          // On API error, assume no past quizzes or handle as needed
          setHasPastQuizzes(false);
          setLoading(false);
          return;
        }

        const data = await response.json();
        // Set to true if totalQuizzes is greater than 0
        setHasPastQuizzes(data.data.totalQuizzes > 0);
      } catch (error) {
        // On network or other errors, assume no past quizzes
        console.error("Failed to fetch quiz summary:", error);
        setHasPastQuizzes(false);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  // Once loaded, render based on hasPastQuizzes
  if (hasPastQuizzes) {
    return <QuizHistory />;
  }

  return <QuizDashboard />;
}
