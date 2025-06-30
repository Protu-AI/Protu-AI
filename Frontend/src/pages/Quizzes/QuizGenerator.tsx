import { MainLayout } from "@/layouts/MainLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../../config";

// Star Icon Component
const StarIcon = ({ width }: { width: number }) => (
  <svg
    width={width}
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#52D999]"
    strokeWidth="2"
  >
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Reusable components
const StepIndicator = ({ currentStep }: { currentStep: 1 | 2 | 3 }) => (
  <div className="flex items-center gap-[18px]">
    {[1, 2, 3].map((step) => (
      <div
        key={step}
        className={`w-[44px] h-[5px] rounded-full transition-colors duration-200 ${
          currentStep >= step ? "bg-[#5F24E0]" : "bg-[#D6D6D6]"
        }`}
      />
    ))}
  </div>
);

const FormHeader = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <div className="flex items-start">
    <div className="bg-[#EFE9FC] rounded-[12px] p-[12px] flex items-center justify-center">
      {icon}
    </div>
    <div className="ml-[16px] flex-1">
      <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#1C0B43] text-left">
        {title}
      </h2>
      <div className="mb-[8px]" />
      <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
        {subtitle}
      </p>
    </div>
  </div>
);

const DifficultyOption = ({
  level,
  current,
  setDifficulty,
  stars,
  description,
}: {
  level: "easy" | "medium" | "hard";
  current: string;
  setDifficulty: (level: "easy" | "medium" | "hard") => void;
  stars: React.ReactNode;
  description: string;
}) => (
  <button
    onClick={() => setDifficulty(level)}
    className={`flex-1 border-2 rounded-[16px] p-[20px] flex items-center transition-all duration-200 ${
      current === level
        ? "bg-[#EFE9FC] border-[#5F24E0]"
        : "bg-transparent border-[#A6B5BB]"
    }`}
  >
    {stars}
    <div className="ml-[16px] flex-1">
      <h3
        className={`font-['Archivo'] text-[28px] font-normal text-left mb-[8px] ${
          current === level ? "text-[#5F24E0]" : "text-[#1C0B43]"
        }`}
      >
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </h3>
      <p className="font-['Archivo'] text-[16px] font-normal text-[#A6B5BB] text-left">
        {description}
      </p>
    </div>
  </button>
);

const NumberInput = ({
  value,
  setValue,
  label,
  icon,
}: {
  value: number;
  setValue: (val: number) => void;
  label: string;
  icon: React.ReactNode;
}) => (
  <div className="flex flex-col">
    <div className="flex items-center mb-[16px]">
      {icon}
      <p className="font-['Archivo'] text-[22px] font-normal text-[#1C0B43] text-left ml-[16px]">
        {label}
      </p>
    </div>
    <div className="flex items-center border-2 border-[#A6B5BB] rounded-[16px] p-[16px] w-[216px]">
      <button
        onClick={() => setValue(Math.max(1, value - 1))}
        className="text-[#1C0B43] font-bold text-xl"
      >
        -
      </button>
      <span className="flex-1 text-center font-['Archivo'] text-[22px] font-normal text-[#1C0B43]">
        {value}
      </span>
      <button
        onClick={() => setValue(value + 1)}
        className="text-[#1C0B43] font-bold text-xl"
      >
        +
      </button>
    </div>
  </div>
);

const QuestionTypeButton = ({
  type,
  label,
  isSelected,
  onClick,
}: {
  type: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`border-2 rounded-[16px] p-[16px] transition-all duration-200 ${
      isSelected
        ? "bg-[#EFE9FC] border-[#5F24E0] text-[#5F24E0]"
        : "bg-transparent border-[#A6B5BB] text-[#1C0B43]"
    }`}
  >
    <span className="font-['Archivo'] text-[22px] font-normal whitespace-nowrap">
      {label}
    </span>
  </button>
);

const TagButton = ({
  tag,
  isSelected,
  onClick,
}: {
  tag: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`font-['Archivo'] text-[22px] font-normal text-left py-[12px] px-[24px] border-2 rounded-[37px] transition-all duration-200 ${
      isSelected
        ? "bg-[#EFE9FC] border-[#5F24E0] text-[#5F24E0]"
        : "bg-transparent border-[#A6B5BB] text-[#1C0B43]"
    }`}
  >
    {tag}
  </button>
);

const GenerateButton = ({
  onClick,
  isLoading,
}: {
  onClick: () => void;
  isLoading: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`text-[#EFE9FC] font-['Archivo'] text-[28px] font-semibold rounded-[24px] py-[24px] px-[64px] transition-all duration-200 flex items-center gap-[16px] group hover:shadow-[inset_0px_0px_9px_#FFFFFF,_0px_6px_38px_#FFBF0036,_0_0_0_3px_#FFBF0080] ${
      isLoading ? "opacity-70 cursor-not-allowed" : ""
    }`}
    style={{
      background: "radial-gradient(circle, #BFA7F3 0%, #5F24E0 100%)",
      boxShadow: "inset 0px 0px 9px #FFFFFF, 0px 42px 38px #BFA7F336",
    }}
    onMouseEnter={(e) => {
      if (!isLoading) {
        e.currentTarget.style.boxShadow =
          "inset 0px 0px 9px #FFFFFF, 0px 6px 38px #FFBF0036, 0 0 0 3px #FFBF0080";
      }
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
      className={`transition-colors duration-200 ${
        isLoading
          ? "text-[#EFE9FC]"
          : "group-hover:text-[#FFBF00] text-[#EFE9FC]"
      }`}
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
    {isLoading ? "Generating..." : "Generate"}
  </button>
);

// Icons
const OctopusIcon = () => (
  <svg
    width="45"
    height="45"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#5F24E0]"
    strokeWidth="2"
  >
    <path
      d="M12 2C15.866 2 19 5.134 19 9C19 12.866 15.866 16 12 16C8.134 16 5 12.866 5 9C5 5.134 8.134 2 12 2Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 14L6 18L4 16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 15L9 20L7 18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 15L15 20L17 18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 14L18 18L20 16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="8" r="1" fill="currentColor" />
    <circle cx="14" cy="8" r="1" fill="currentColor" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="45"
    height="45"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#5F24E0]"
    strokeWidth="2"
  >
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GaugeIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#1C0B43]"
    strokeWidth="2"
  >
    <path
      d="M8 18C8.5 16 10.5 14 12 14s4 2 4 4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 12L16 4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DocumentIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#1C0B43]"
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
);

const CheckIcon = () => (
  <svg
    width="30"
    height="30"
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
);

const ClockIcon = () => (
  <svg
    width="30"
    height="30"
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
);

const PlusIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#EFE9FC]"
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
);

const MenuIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 6H21"
      stroke="#1C0B43"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 12H21"
      stroke="#1C0B43"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 18H21"
      stroke="#1C0B43"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SaveIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 3V9H15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 21V13H17V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PencilIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 4L20 8L8 20L4 20L4 16L16 4Z"
      stroke="#A6B5BB"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Quiz Title Editor Component
interface QuizTitleEditorProps {
  initialTitle: string;
  quizId: string;
  onTitleUpdated: (newTitle: string) => void; // Callback to update parent state
}

const QuizTitleEditor: React.FC<QuizTitleEditorProps> = ({
  initialTitle,
  quizId,
  onTitleUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [originalTitle, setOriginalTitle] = useState(initialTitle); // Store original for cancel
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update internal state if initialTitle prop changes (e.g., when quizData loads)
  useEffect(() => {
    setTitle(initialTitle);
    setOriginalTitle(initialTitle);
  }, [initialTitle]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null); // Clear any previous errors when starting to edit
  };

  const handleCancelEdit = () => {
    setTitle(originalTitle); // Revert to the title before editing started
    setIsEditing(false);
    setError(null); // Clear errors
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    }
  };

  const handleSaveTitle = async () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authorization token not found. Please log in.");
      setIsLoading(false);
      return;
    }

    if (!quizId) {
      setError("Quiz ID is missing for update.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${config.apiUrl}/v1/quizzes/${quizId}/title`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update quiz title.");
      }

      // If successful, update the originalTitle and inform the parent
      setOriginalTitle(title);
      setIsEditing(false);
      onTitleUpdated(title); // Call the callback to update the parent's quizData state
    } catch (err) {
      console.error("Error updating quiz title:", err);
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-transparent rounded-[32px] px-[128px] py-[32px] flex items-center justify-center gap-[16px] relative shadow-[0px_2px_6px_#00000014] w-[1000px]">
      <div className="w-full max-w-[800px] bg-[#EFE9FC] rounded-[24px] px-[32px] py-[24px] flex items-center justify-between shadow-[0px_2px_6px_#00000014] relative">
        {isEditing ? (
          <>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleSaveTitle}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent border-b border-[#5F24E0] text-[#000000] font-['Archivo'] text-[28px] font-semibold focus:outline-none"
              style={{ width: `${title.length + 2}ch` }}
              autoFocus
              disabled={isLoading}
            />
            <div className="w-[20px] flex-shrink-0 ml-[16px]" />
            <div className="flex gap-2 ml-4">
              <button
                onClick={handleSaveTitle}
                className="px-4 py-2 bg-[#5F24E0] text-white rounded-lg hover:bg-[#9F7CEC] transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-['Archivo'] text-[28px] font-semibold text-[#5F24E0]">
              {title}
            </h3>
            <button
              onClick={handleEditClick}
              className="flex items-center gap-[8px] text-[#5F24E0] hover:text-[#9F7CEC] transition-colors duration-200 ml-[16px]"
            >
              {/* Edit icon SVG */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 3L21 8L8 21H3V16L16 3Z"
                  stroke="#5F24E0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-['Archivo'] text-[16px] font-semibold">
                Edit Title
              </span>
            </button>
          </>
        )}
        {error && (
          <p className="text-red-500 text-sm absolute bottom-2 left-4">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default QuizTitleEditor;

// Quiz Tag Component
const QuizTag = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="bg-[#EFE9FC] rounded-[16px] px-[32px] py-[8px] flex items-center gap-[8px]">
    {icon}
    <span className="font-['Archivo'] text-[24px] font-medium text-[#1C0B43]">
      {text}
    </span>
  </div>
);

export function QuizGenerator() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [numberOfQuestions, setNumberOfQuestions] = useState(12);
  const [timeLimit, setTimeLimit] = useState(12);
  const [questionTypes, setQuestionTypes] = useState({
    multipleChoice: true,
    trueFalse: true,
  });
  const [prompt, setPrompt] = useState("");
  const [subtopicSuggestions, setSubtopicSuggestions] = useState<
    { id: string; text: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [additionalPrefs, setAdditionalPrefs] = useState("");

  // Tag functionality
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [customTags, setCustomTags] = useState<string[]>([]);

  interface QuizData {
    id: string;
    title: string;
    timeLimit: number; // in minutes
    topic: string;
    numberOfQuestions: number;
  }
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleTagToggle = (tagText: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagText)
        ? prev.filter((tag) => tag !== tagText)
        : [...prev, tagText]
    );
  };

  const handleAddCustomTag = () => {
    if (
      customTagInput.trim().length >= 3 &&
      !customTags.includes(customTagInput.trim())
    ) {
      const newTag = customTagInput.trim();
      setCustomTags((prev) => [...prev, newTag]);
      setSelectedTags((prev) => [...prev, newTag]);
      setCustomTagInput("");
    }
  };

  const isAddButtonActive = customTagInput.trim().length >= 3;

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    // TODO: Re-enable API integration when UI work is complete

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authorization token not found. Please log in.");
      setIsLoading(false);
      return;
    }

    const selectedQuestionTypes = [];
    if (questionTypes.multipleChoice)
      selectedQuestionTypes.push("multiple_choice");
    if (questionTypes.trueFalse) selectedQuestionTypes.push("true_false");

    try {
      const response = await fetch(`${config.apiUrl}/v1/quizzes/stage1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          difficultyLevel: difficulty,
          numberOfQuestions,
          questionTypes: selectedQuestionTypes,
          timeLimit: timeLimit, // Send in minutes as expected by backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create quiz.");
      }

      const responseData = await response.json();
      setSubtopicSuggestions(responseData.data.subtopicSuggestions);
      setQuizId(responseData.data.id);
      setCurrentStep(2);
    } catch (err) {
      console.error("Error creating quiz:", err);
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateStage2 = async () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authorization token not found. Please log in.");
      setIsLoading(false);
      return;
    }

    if (!quizId) {
      setError("Quiz ID is missing. Please go back to step 1.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/v1/quizzes/stage2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quizID: quizId,
          subtopics: selectedTags,
          additionalPrefs,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate quiz.");
      }
      const result = await response.json();
      setQuizData(result.data);
      setCurrentStep(3);
    } catch (err) {
      console.error("Error generating quiz:", err);
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = () => {
    navigate(`/quizzes/take/${quizId}`);
  };

  const getStepText = () => {
    switch (currentStep) {
      case 1:
        return "Step 1: Define your quiz parameters";
      case 2:
        return "Step 2: Refine your quiz content";
      case 3:
        return "Step 3: Review & Generate";
      default:
        return "Step 1: Define your quiz parameters";
    }
  };

  return (
    <MainLayout>
      {currentStep === 3 ? (
        // Step 3: Show content directly on page background without container
        <div className="flex flex-col w-full overflow-y-auto h-full px-[128px] items-center justify-center">
          {/* Modern check mark icon in colored box */}
          <div className="w-[72px] h-[72px] bg-[#52D999] rounded-[24px] flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="white"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* 32px spacing */}
          <div className="mb-[32px]" />

          {/* Main title */}
          <h2 className="font-['Archivo'] text-[48px] font-semibold text-[#5F24E0] text-center">
            Your Quiz Is Ready
          </h2>

          {/* 16px spacing */}
          <div className="mb-[16px]" />

          {/* Subtitle */}
          <p className="font-['Archivo'] text-[16px] font-normal text-[#A6B5BB] text-center">
            Final Step: Review and Start
          </p>

          {/* 16px spacing */}
          <div className="mb-[16px]" />

          {/* Three progress lines - all filled */}
          <div className="flex items-center gap-[18px]">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="w-[44px] h-[5px] rounded-full bg-[#5F24E0]"
              />
            ))}
          </div>

          {/* 64px spacing */}
          <div className="mb-[64px]" />

          {/* Quiz title rectangle with edit functionality */}
          {quizData && ( // Only render if quizData is available
            <QuizTitleEditor
              initialTitle={quizData.title}
              quizId={quizData.id}
              onTitleUpdated={(newTitle) =>
                setQuizData((prev) =>
                  prev ? { ...prev, title: newTitle } : prev
                )
              }
            />
          )}

          {/* 32px spacing */}
          <div className="mb-[32px]" />

          {/* 3 tags with icons */}
          <div className="flex items-center gap-[24px]">
            {quizData && (
              <>
                <QuizTag
                  icon={<ClockIcon />}
                  text={formatTime(quizData.timeLimit * 60)}
                />
                <QuizTag icon={<DocumentIcon />} text={quizData.topic} />
                <QuizTag
                  icon={<MenuIcon />}
                  text={`${quizData.numberOfQuestions} Questions`}
                />
              </>
            )}
          </div>

          {/* 64px spacing */}
          <div className="mb-[64px]" />

          {/* Start button */}
          <button
            onClick={handleStartQuiz}
            className="bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC] font-['Archivo'] text-[22px] font-semibold rounded-[24px] py-[27px] px-[125px] transition-all duration-200"
          >
            Start
          </button>

          {/* 24px spacing */}
          <div className="mb-[24px]" />

          {/* OR with lines */}
          <div className="w-full flex items-center max-w-[300px]">
            <div className="flex-1 h-[1px] bg-[#A6B5BB]" />
            <span className="mx-[7px] font-['Archivo'] text-[16px] font-normal text-[#A6B5BB]">
              OR
            </span>
            <div className="flex-1 h-[1px] bg-[#A6B5BB]" />
          </div>

          {/* 24px spacing */}
          <div className="mb-[24px]" />

          {/* Save to drafts */}
          <button
            onClick={() => navigate("/quizzes")}
            className="flex items-center gap-[8px] text-[#5F24E0] hover:text-[#9F7CEC] transition-colors duration-200"
          >
            <SaveIcon />
            <span className="font-['Archivo'] text-[16px] font-semibold">
              Save to drafts
            </span>
          </button>
        </div>
      ) : (
        // Steps 1 and 2: Show with header and white container
        <div className="flex flex-col w-full overflow-y-auto h-full px-[128px]">
          <div className="pt-[32px]" />
          <h1 className="font-['Archivo'] text-[64px] font-semibold text-[#5F24E0] text-left">
            Create Your Quiz
          </h1>
          <div className="mb-[16px]" />

          <StepIndicator currentStep={currentStep} />

          <div className="mb-[16px]" />
          <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
            {getStepText()}
          </p>
          <div className="mb-[32px]" />
          <div className="bg-[#FFFFFF] rounded-[32px] flex-1 p-[32px] shadow-[0px_2px_6px_#00000014]">
            {currentStep === 1 && (
              <>
                <FormHeader
                  icon={<OctopusIcon />}
                  title="Quiz Topic or Prompt"
                  subtitle="Describe what you want to test"
                />
                <div className="mb-[16px]" />
                <textarea
                  className="w-full bg-[#EFE9FC40] border-2 border-[#A6B5BB] rounded-[12px] p-[32px] font-['Archivo'] text-[22px] font-normal text-[#1C0B43] placeholder-[#A6B5BB] focus:border-[#5F24E0] focus:outline-none resize-none overflow-y-auto"
                  style={{
                    caretColor: "#1C0B43",
                    height: "calc(1.5em + 64px)",
                    minHeight: "calc(1.5em + 64px)",
                  }}
                  placeholder="Be specific about the topic, difficulty level, and any special focus areas. The more detailed your prompt, the better the AI-generated quiz will be."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="mb-[39px]" />

                <FormHeader
                  icon={<SettingsIcon />}
                  title="Customize Your Quiz"
                  subtitle="Adjust settings to match your needs"
                />
                <div className="mb-[32px]" />

                <div className="flex items-center">
                  <GaugeIcon />
                  <div className="ml-[16px]">
                    <p className="font-['Archivo'] text-[22px] font-normal text-[#1C0B43] text-left">
                      Difficulty Level
                    </p>
                  </div>
                </div>
                <div className="mb-[16px]" />

                <div className="flex gap-[32px]">
                  <DifficultyOption
                    level="easy"
                    current={difficulty}
                    setDifficulty={setDifficulty}
                    stars={<StarIcon width={32} />}
                    description="Basic concepts and fundamentals"
                  />
                  <DifficultyOption
                    level="medium"
                    current={difficulty}
                    setDifficulty={setDifficulty}
                    stars={
                      <div className="flex">
                        <StarIcon width={16} />
                        <StarIcon width={16} />
                      </div>
                    }
                    description="Intermediate knowledge and application"
                  />
                  <DifficultyOption
                    level="hard"
                    current={difficulty}
                    setDifficulty={setDifficulty}
                    stars={
                      <div className="flex">
                        <StarIcon width={11} />
                        <StarIcon width={11} />
                        <StarIcon width={11} />
                      </div>
                    }
                    description="Advanced topics and scenarios"
                  />
                </div>
                <div className="mb-[32px]" />

                <div className="flex items-start gap-[128px]">
                  <NumberInput
                    value={numberOfQuestions}
                    setValue={setNumberOfQuestions}
                    label="Number of Questions"
                    icon={<DocumentIcon />}
                  />

                  <div className="flex flex-col">
                    <div className="flex items-center mb-[16px]">
                      <CheckIcon />
                      <p className="font-['Archivo'] text-[22px] font-normal text-[#1C0B43] text-left ml-[16px]">
                        Question Types
                      </p>
                    </div>
                    <div className="flex gap-[32px]">
                      <QuestionTypeButton
                        type="multipleChoice"
                        label="Multiple Choice"
                        isSelected={questionTypes.multipleChoice}
                        onClick={() =>
                          setQuestionTypes({
                            ...questionTypes,
                            multipleChoice: !questionTypes.multipleChoice,
                          })
                        }
                      />
                      <QuestionTypeButton
                        type="trueFalse"
                        label="True / False"
                        isSelected={questionTypes.trueFalse}
                        onClick={() =>
                          setQuestionTypes({
                            ...questionTypes,
                            trueFalse: !questionTypes.trueFalse,
                          })
                        }
                      />
                    </div>
                  </div>

                  <NumberInput
                    value={timeLimit}
                    setValue={setTimeLimit}
                    label="Time Limit (minutes)"
                    icon={<ClockIcon />}
                  />
                </div>
                <div className="mb-[32px]" />
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="flex flex-col">
                  <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#1C0B43] text-left">
                    Your Quiz Prompt
                  </h2>
                  <div className="mb-[8px]" />
                  <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
                    This is the main topic of your quiz from step 1
                  </p>
                </div>
                <div className="mb-[16px]" />

                <div className="relative">
                  <div className="w-full bg-[#EFE9FC40] border-2 border-[#A6B5BB] rounded-[12px] p-[32px] font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] min-h-[calc(1.5em + 64px)] flex items-center pr-[120px]">
                    {prompt ||
                      "Be specific about the topic, difficulty level, and any special focus areas..."}
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="absolute right-[32px] top-1/2 transform -translate-y-1/2 bg-[#D6D6D6] rounded-[8px] py-[8px] px-[16px] font-['Archivo'] text-[22px] font-normal text-[#1C0B43]"
                  >
                    Edit
                  </button>
                </div>
                <div className="mb-[32px]" />

                <div className="flex flex-col">
                  <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#1C0B43] text-left">
                    Suggested Subtopics
                  </h2>
                  <div className="mb-[8px]" />
                  <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
                    Select up to 10 subtopics to include in your quiz
                  </p>
                </div>
                <div className="mb-[16px]" />

                <div className="flex flex-wrap gap-[16px]">
                  {subtopicSuggestions.map((tag) => (
                    <TagButton
                      key={tag.id}
                      tag={tag.text}
                      isSelected={selectedTags.includes(tag.text)}
                      onClick={() => handleTagToggle(tag.text)}
                    />
                  ))}
                  {customTags.map((tag, index) => (
                    <TagButton
                      key={`custom-${index}`}
                      tag={tag}
                      isSelected={selectedTags.includes(tag)}
                      onClick={() => handleTagToggle(tag)}
                    />
                  ))}
                </div>
                <div className="mb-[16px]" />

                <div className="flex items-center gap-[16px]">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && isAddButtonActive)
                        handleAddCustomTag();
                    }}
                    className="flex-1 bg-[#EFE9FC40] border-2 border-[#A6B5BB] rounded-[12px] py-[16px] px-[32px] font-['Archivo'] text-[22px] font-normal text-[#1C0B43] placeholder-[#A6B5BB] focus:border-[#5F24E0] focus:outline-none"
                    style={{ caretColor: "#1C0B43" }}
                    placeholder="Add your own subtopic..."
                  />
                  <button
                    onClick={handleAddCustomTag}
                    disabled={!isAddButtonActive}
                    className={`flex items-center justify-center rounded-[16px] transition-all duration-200 ${
                      isAddButtonActive
                        ? "bg-[#5F24E0] hover:bg-[#9F7CEC] cursor-pointer"
                        : "bg-[#D6D6D6] cursor-not-allowed"
                    }`}
                    style={{
                      height: "calc(32px + 32px)",
                      width: "calc(32px + 32px)",
                      minHeight: "calc(32px + 32px)",
                      minWidth: "calc(32px + 32px)",
                    }}
                  >
                    <PlusIcon />
                  </button>
                </div>
                <div className="mb-[16px]" />

                <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
                  {selectedTags.length}/10 subtopics selected
                </p>
                <div className="mb-[32px]" />

                <div className="flex flex-col">
                  <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#1C0B43] text-left">
                    Additional Preferences
                  </h2>
                  <div className="mb-[8px]" />
                  <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
                    Add any specific requirements or preferences (optional)
                  </p>
                </div>
                <div className="mb-[16px]" />

                <input
                  type="text"
                  value={additionalPrefs}
                  onChange={(e) => setAdditionalPrefs(e.target.value)}
                  className="w-full bg-[#EFE9FC40] border-2 border-[#A6B5BB] rounded-[12px] py-[16px] px-[32px] font-['Archivo'] text-[22px] font-normal text-[#1C0B43] placeholder-[#A6B5BB] focus:border-[#5F24E0] focus:outline-none"
                  style={{ caretColor: "#1C0B43" }}
                  placeholder="e.g., Focus on recent developments, include practical examples..."
                />
                <div className="mb-[32px]" />

                <div className="flex justify-center">
                  <GenerateButton
                    onClick={handleGenerateStage2}
                    isLoading={isLoading}
                  />
                </div>
              </>
            )}

            {currentStep === 1 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`font-['Archivo'] text-[22px] font-semibold rounded-[24px] py-[27px] px-[134px] transition-all duration-200 ${
                    isLoading
                      ? "text-[#ABABAB] bg-[#D6D6D6] cursor-not-allowed"
                      : "text-[#EFE9FC] bg-[#5F24E0] hover:bg-[#9F7CEC]"
                  }`}
                >
                  {isLoading ? "Generating..." : "Continue"}
                </button>
              </div>
            )}

            {error && (
              <div className="text-red-500 text-center mt-4">{error}</div>
            )}
          </div>
          <div className="mb-[38px]" />
        </div>
      )}
    </MainLayout>
  );
}
