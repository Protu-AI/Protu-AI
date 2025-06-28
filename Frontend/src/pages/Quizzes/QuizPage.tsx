import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useParams, useNavigate } from "react-router-dom";
import { config } from "../../../config";

// Types for quiz data - Use these for backend integration
interface Choice {
  id: string;
  text: string;
}

interface Question {
  id: string;
  questionNumber: number; // Will be mapped from 'order'
  questionText: string;
  type: "multiple_choice" | "true_false"; // Will be mapped from 'questionType'
  choices: Choice[]; // Will be mapped from 'options'
  codeBlock?: {
    language: string; // e.g., 'javascript', 'python', 'html', 'css'
    code: string;
  };
}

// Quiz data interface for complete quiz attempt
interface QuizAttemptData {
  attemptId: string;
  quizId: string;
  title: string;
  timeLimit: number; // in seconds
  questions: Question[];
  startedAt: string;
}

// Clock Icon Component
const ClockIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#DC2626]"
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
);

// Choice Component
interface ChoiceProps {
  choice: Choice;
  isSelected: boolean;
  onClick: () => void;
  isTrueFalse?: boolean;
}

const QuizChoice = ({
  choice,
  isSelected,
  onClick,
  isTrueFalse = false,
}: ChoiceProps) => (
  <label
    onClick={onClick}
    className={`flex items-center border-2 rounded-[24px] py-[24px] px-[32px] cursor-pointer transition-all duration-200 ${
      isTrueFalse ? "flex-1" : ""
    } ${
      isSelected
        ? "border-[#5F24E0] bg-[#EFE9FC]"
        : "border-[#A6B5BB] hover:border-[#5F24E0] hover:bg-[#EFE9FC]"
    }`}
  >
    <div
      className={`w-[32px] h-[32px] border-2 rounded-full flex items-center justify-center ${
        isSelected ? "border-[#5F24E0]" : "border-[#A6B5BB]"
      }`}
    >
      <div
        className={`w-[16px] h-[16px] bg-[#5F24E0] rounded-full ${
          isSelected ? "block" : "hidden"
        }`}
      ></div>
    </div>
    <div className="w-[16px]" />
    <span
      className={`font-['Archivo'] text-[28px] font-normal ${
        isSelected ? "text-[#5F24E0]" : "text-[#1C0B43]"
      }`}
    >
      {choice.text}
    </span>
  </label>
);

// Question Component
interface QuestionProps {
  question: Question;
  selectedAnswer: string | undefined;
  onAnswerSelect: (questionId: string, choiceId: string) => void;
}

const QuizQuestion = ({
  question,
  selectedAnswer,
  onAnswerSelect,
}: QuestionProps) => (
  <div
    className="bg-[#FFFFFF] rounded-[32px] p-[32px] mb-[64px]"
    style={{ boxShadow: "0px 3px 12px #00000029" }}
  >
    {/* Question Header */}
    <div className="flex items-center">
      <div className="bg-[#EFE9FC] rounded-full px-[14px] py-[6.4px] flex items-center justify-center">
        <span className="font-['Archivo'] text-[28px] font-semibold text-[#5F24E0]">
          {question.questionNumber}
        </span>
      </div>
      <div className="w-[16px]" />
      <h3 className="font-['Archivo'] text-[28px] font-semibold text-[#1C0B43] text-left">
        {question.questionText}
      </h3>
    </div>

    {/* 32px spacing */}
    <div className="mb-[32px]" />

    {/* Code Block (if exists) */}
    {question.codeBlock && (
      <div className="bg-[#EFE9FC] rounded-[8px] p-[24px] mt-0 mb-[24px]">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .quiz-code-block code,
              .quiz-code-block pre,
              .quiz-code-block * {
                font-family: 'Archivo', sans-serif !important;
                font-weight: 500 !important;
                font-size: 16px !important;
                text-align: left !important;
              }
            `,
          }}
        />
        <SyntaxHighlighter
          style={prism}
          language={question.codeBlock.language}
          PreTag="div"
          className="quiz-code-block !bg-[#FFFFFF] border-l-[8px] border-[#5F24E0] px-[32px] py-[12px] !mt-0 !mb-[24px]"
        >
          {question.codeBlock.code}
        </SyntaxHighlighter>
      </div>
    )}

    {/* Choices */}
    <div
      className={
        question.type === "true_false" ? "flex gap-[16px]" : "space-y-[16px]"
      }
    >
      {question.choices.map((choice) => (
        <QuizChoice
          key={choice.id}
          choice={choice}
          isSelected={selectedAnswer === choice.id}
          onClick={() => onAnswerSelect(question.id, choice.id)}
          isTrueFalse={question.type === "true_false"}
        />
      ))}
    </div>
  </div>
);

export function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>(); // Get quizId from URL
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState("Loading Quiz...");
  const [attemptId, setAttemptId] = useState<string | null>(null);

  // State for selected answers
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, choiceId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  // Calculate questions remaining
  const questionsRemaining =
    quizData.length - Object.keys(selectedAnswers).length;

  // Fetch quiz data on component mount
  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in local storage.");
        // Optionally redirect to login page
        navigate("/login");
        return;
      }

      if (!quizId) {
        console.error("Quiz ID is missing from URL parameters.");
        return;
      }

      try {
        const response = await fetch(
          `${config.apiUrl}/v1/attempts/start/${quizId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          // Handle specific error codes or generic error
          const errorData = await response.json();
          console.error("Failed to fetch quiz:", errorData.message);
          alert(`Failed to start quiz: ${errorData.message}`);
          // Redirect or show error message to user
          return;
        }

        const result: {
          status: string;
          message: string;
          data: QuizAttemptData;
        } = await response.json();

        const fetchedQuizData = result.data;

        // Map backend response to your Question interface
        const transformedQuestions: Question[] = fetchedQuizData.questions.map(
          (q: any) => ({
            id: q.id,
            questionNumber: q.order,
            questionText: q.questionText,
            type: q.questionType,
            choices: q.options.map((opt: any, index: number) => ({
              id: `${q.id}-choice-${index}`, // Generate a unique ID for choices
              text: opt.text,
            })),
            codeBlock: q.codeBlock
              ? {
                  language: q.codeBlock.language,
                  code: q.codeBlock.code,
                }
              : undefined,
          })
        );

        setQuizData(transformedQuestions);
        setTimeLeft(fetchedQuizData.timeLimit);
        setQuizTitle(fetchedQuizData.title);
        setAttemptId(fetchedQuizData.attemptId);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        alert("An error occurred while fetching the quiz. Please try again.");
      }
    };

    fetchQuiz();
  }, [quizId, navigate]); // Depend on quizId and navigate

  // Submit quiz answers - CUSTOMIZE THIS FOR YOUR BACKEND
  const handleSubmitQuiz = async () => {
    if (!attemptId) {
      console.error("Attempt ID is not available. Cannot submit quiz.");
      alert(
        "Quiz attempt not started correctly. Please refresh and try again."
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage.");
      navigate("/login");
      return;
    }

    // Prepare answers in the format expected by the backend
    const answersToSend = quizData.map((question) => {
      const selectedChoiceId = selectedAnswers[question.id];
      const selectedIndex = question.choices.findIndex(
        (choice) => choice.id === selectedChoiceId
      );
      return {
        questionId: question.id,
        selected: selectedIndex, // Send the index of the selected choice
      };
    });

    try {
      const response = await fetch(
        `${config.apiUrl}/v1/attempts/${attemptId}/submit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quizId: quizId,
            answers: answersToSend,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to submit quiz:", errorData.message);
        alert(`Failed to submit quiz: ${errorData.message}`);
        return;
      }

      const result = await response.json();
      console.log("Quiz submission successful:", result.data);

      // Save aiFeedback for later use
      if (result.data && result.data.aiFeedback) {
        localStorage.setItem("quizAiFeedback", result.data.aiFeedback);
        localStorage.setItem("quizResult", JSON.stringify(result.data)); // Save entire result if needed
      }
      navigate(`/quizzes`);
      // Navigate to a feedback/results page, passing relevant data if needed
      // navigate(`/quizzes/result/${attemptId}`); // Example: Navigate to a results  or feedback page or whatever
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("An error occurred while submitting the quiz. Please try again.");
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0 && quizData.length > 0) {
      // Only start timer if quiz data is loaded
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizData.length > 0) {
      // Time's up, automatically submit the quiz
      handleSubmitQuiz();
    }
  }, [timeLeft, quizData, handleSubmitQuiz]); // Add handleSubmitQuiz to dependencies

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Fixed Line */}
      <div
        className="h-[130px] bg-white flex items-center justify-between px-[128px] py-[32px] fixed top-0 left-0 right-0 z-10"
        style={{ boxShadow: "0px 2px 12px #00000029" }}
      >
        {/* Left Side - Quiz Title and Instruction */}
        <div className="flex flex-col justify-center">
          <h1 className="font-['Archivo'] text-[32px] font-bold text-[#5F24E0] text-left">
            {quizTitle}
          </h1>
          <div className="mb-[8px]" />
          <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
            Answer all questions before the time runs out
          </p>
        </div>

        {/* Right Side - Timer */}
        <div className="flex items-center justify-center bg-[#FEE2E2] rounded-[25px] px-[32px] py-[12px]">
          <ClockIcon />
          <div className="w-[8px]" />
          <span className="font-['Archivo'] text-[24px] font-medium text-[#DC2626] text-left">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Middle Scrollable Content */}
      <div className="flex-1 bg-white px-[128px] py-[32px] mt-[130px] mb-[130px] overflow-y-auto">
        {/* Quiz Content */}
        <div className="flex flex-col">
          {/* 64px spacing before first question */}
          <div className="mb-[64px]" />

          {/* Render Questions Dynamically */}
          {quizData.length > 0 ? (
            quizData.map((question) => (
              <QuizQuestion
                key={question.id}
                question={question}
                selectedAnswer={selectedAnswers[question.id]}
                onAnswerSelect={handleAnswerSelect}
              />
            ))
          ) : (
            <div className="text-center text-[#A6B5BB] text-[24px] font-semibold mt-10">
              Loading quiz questions...
            </div>
          )}

          {/* 64px spacing after last question */}
          <div className="mb-[64px]" />
        </div>
      </div>

      {/* Bottom Fixed Line */}
      <div
        className="h-[130px] bg-white flex items-center justify-between px-[128px] py-[32px] fixed bottom-0 left-0 right-0 z-10"
        style={{ boxShadow: "0px -2px 6px #00000029" }}
      >
        {/* Left Side - Questions Remaining */}
        <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
          {questionsRemaining} questions remaining
        </p>

        {/* Right Side - Submit Button */}
        <button
          onClick={handleSubmitQuiz}
          disabled={questionsRemaining > 0} // Disable submit if not all questions answered
          className={`font-['Archivo'] text-[28px] font-semibold rounded-[24px] py-[16px] px-[32px] transition-all duration-200 ${
            questionsRemaining > 0
              ? "bg-[#A6B5BB] cursor-not-allowed"
              : "bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC]"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
