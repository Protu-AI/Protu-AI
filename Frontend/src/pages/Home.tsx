import { MainLayout } from "@/layouts/MainLayout";

export function Home() {
  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-4.5rem)] mx-20">
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center pr-[175px]">
          <h1 className="font-['Archivo'] font-semibold text-[101px] leading-tight text-left text-[#0E1117]" style={{ marginBottom: '32px' }}>
            CODE LIKE A PRO{' '}
            <span className="text-[#5F24E0]">ANYWHERE</span>{' '}
            ANYTIME
          </h1>
          <p className="font-['Archivo'] font-normal text-[22px] leading-relaxed text-left text-[#0E1117]">
            Master programming with ease. PROTU combines expert lessons and an AI-powered chatbot to guide your learning journey. Whether you're a beginner or looking to sharpen your skills, PROTU is your ultimate programming tutor. Start your path to becoming a pro today!
          </p>
        </div>
        
        {/* Right Image */}
        <div className="flex-shrink-0">
          <img 
            src="/Images/Home Artwork.webp" 
            alt="Home Artwork" 
            className="h-full w-auto object-cover"
          />
        </div>
      </div>
    </MainLayout>
  );
}
