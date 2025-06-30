import { MainLayout } from "@/layouts/MainLayout";
import { useNavigate } from "react-router-dom";

export function QuizDashboard() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="flex flex-col w-full overflow-y-auto h-full pt-[64px] px-[128px]">
        {/* Header Section */}
        <div className="text-left mb-[68px]">
          <h1 className="font-['Archivo'] text-[64px] font-semibold text-[#5F24E0] mb-[6px] text-left">
            Your Quiz Dashboard
          </h1>
          <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
            Track your progress, review past quizzes, and keep improving your skills
          </p>
        </div>

        {/* Rocket Icon */}
        <div className="bg-[#5F24E0] rounded-[24px] w-[114px] h-[114px] mb-[32px] mx-auto flex items-center justify-center p-[20px]">
          <svg 
            width="74" 
            height="74" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#EFE9FC]"
            strokeWidth="2"
          >
            <path d="M9 11L12 14L22 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Ready to Start Learning Section */}
        <div className="text-center mb-[32px]">
          <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#1C0B43] mb-[16px] text-center">
            Ready to Start Learning?
          </h2>
          <p className="font-['Archivo'] text-[16px] font-normal text-[#A6B5BB] text-center">
            Begin your learning journey by creating your first quiz. Track your progress, improve your skills, 
            and watch your knowledge grow!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="flex gap-[42px] mb-[64px] justify-center">
          {/* Create Quizzes Card */}
          <div 
            className="rounded-[24px] p-[24px] w-[380px] text-center shadow-[0px_3px_6px_#00000029]"
            style={{
              background: 'linear-gradient(60deg, #D3C2F680 0%, #EFE9FC80 100%)'
            }}
          >
            <div className="bg-[#FFFFFF] rounded-[12px] p-[13px] w-fit mx-auto mb-[24px]">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#5F24E0]"
                strokeWidth="2"
              >
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-['Archivo'] text-[32px] font-semibold text-[#5F24E0] mb-[8px] text-center whitespace-nowrap">
              Create Quizzes
            </h3>
            <p className="font-['Archivo'] text-[20px] font-normal text-[#1C0B43] text-center">
              Design custom quizzes to test your knowledge
            </p>
          </div>

          {/* Track Progress Card */}
          <div 
            className="rounded-[24px] p-[24px] w-[380px] text-center shadow-[0px_3px_6px_#00000029]"
            style={{
              background: 'linear-gradient(241deg, #FFE8A280 0%, #FFF9E680 100%)'
            }}
          >
            <div className="bg-[#FFFFFF] rounded-[12px] p-[13px] w-fit mx-auto mb-[24px]">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#FFBF00]"
                strokeWidth="2"
              >
                <path d="M3 3V21H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 12L12 7L16 11L21 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 6H21V10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-['Archivo'] text-[32px] font-semibold text-[#FFBF00] mb-[8px] text-center whitespace-nowrap">
              Track Progress
            </h3>
            <p className="font-['Archivo'] text-[20px] font-normal text-[#1C0B43] text-center">
              Monitor your improvement over time
            </p>
          </div>

          {/* Improve Your Level Card */}
          <div 
            className="rounded-[24px] p-[24px] w-[380px] text-center shadow-[0px_3px_6px_#00000029]"
            style={{
              background: 'linear-gradient(60deg, #C0F1DA80 0%, #EEFBF580 100%)'
            }}
          >
            <div className="bg-[#FFFFFF] rounded-[12px] p-[13px] w-fit mx-auto mb-[24px]">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#52D999]"
                strokeWidth="2"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 21H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-['Archivo'] text-[32px] font-semibold text-[#52D999] mb-[8px] text-center whitespace-nowrap">
              Improve Your Level
            </h3>
            <p className="font-['Archivo'] text-[20px] font-normal text-[#1C0B43] text-center">
              Get recommendations that match your level
            </p>
          </div>
        </div>

        {/* Generate New Quiz Button */}
        <div className="flex justify-center">
          <button 
            onClick={() => navigate('/quizzes/generate')}
            className="text-[#EFE9FC] font-['Archivo'] text-[28px] font-semibold rounded-[24px] py-[24px] px-[64px] transition-all duration-200 flex items-center gap-[16px] group hover:shadow-[inset_0px_0px_9px_#FFFFFF,_0px_6px_38px_#FFBF0036,_0_0_0_3px_#FFBF0080]"
            style={{
              background: 'radial-gradient(circle, #BFA7F3 0%, #5F24E0 100%)',
              boxShadow: 'inset 0px 0px 9px #FFFFFF, 0px 42px 38px #BFA7F336'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'inset 0px 0px 9px #FFFFFF, 0px 6px 38px #FFBF0036, 0 0 0 3px #FFBF0080';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'inset 0px 0px 9px #FFFFFF, 0px 42px 38px #BFA7F336';
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
              <path d="M12 5V19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Generate New Quiz
          </button>
        </div>

        <div className="pb-[64px]"></div>
      </div>
    </MainLayout>
  );
} 