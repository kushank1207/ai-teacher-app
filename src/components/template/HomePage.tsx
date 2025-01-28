// src/components/template/HomePage.tsx (continued)
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "./Header";
import TitleModal from "./TitleModal";
import { ChevronLeft } from "lucide-react";

interface ProcessedResponse {
  summary: string;
  randomNumber: number;
  originalResponse: string;
}

interface HomePageProps {
  onBackClick: () => void;
}

export default function HomePage({ onBackClick }: HomePageProps) {
  const [title, setTitle] = useState("INTERACTIVE SAP LEARNING");
  const [processedResponse, setProcessedResponse] =
    useState<ProcessedResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedResponse = localStorage.getItem("processedResponse");
    if (storedResponse) {
      try {
        const parsed = JSON.parse(storedResponse) as ProcessedResponse;
        setProcessedResponse(parsed);
        if (parsed.summary) {
          setTitle(parsed.summary);
        }
      } catch (error) {
        console.error("Error parsing stored response:", error);
      }
    }
  }, []);

  const handleQuestionClick = () => {
    setIsModalOpen(true);
  };

  const handleSaveTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBackClick = () => {
    localStorage.removeItem("processedResponse");
    onBackClick();
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-[#ECE9E6] overflow-hidden">
      <div className="my-20 flex flex-col items-center justify-center ">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/background.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-5"
        />
      </div>

      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-4 left-4 z-50 flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Chat</span>
      </button>

      {/* Background Elements */}
      <Image
        src="/assets/TopLeftElem.png"
        alt="Top Left Decoration"
        width={20}
        height={104}
        priority
        className="absolute top-4 left-4 opacity-10"
      />
      <Image
        src="/assets/BottomLeftElem.png"
        alt="Bottom Left Decoration"
        width={20}
        height={104}
        priority
        className="absolute bottom-4 left-4 opacity-10"
      />
      <Image
        src="/assets/LeftMiddleElem.png"
        alt="Left Middle Decoration"
        width={20}
        height={40}
        priority
        className="absolute top-1/2 left-6 transform -translate-y-1/2 opacity-10"
      />
      <Image
        src="/assets/Rectangle3.png"
        alt="Bottom Center Decoration"
        width={680}
        height={72}
        unoptimized
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-10"
      />
      <Image
        src="/assets/Rectangle4.png"
        alt="Top Center Decoration"
        width={682}
        height={30}
        unoptimized
        className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-10"
      />
      <Image
        src="/assets/RightMiddleElem.png"
        alt="Right Middle Decoration"
        width={20}
        height={40}
        priority
        className="absolute top-1/2 right-6 transform -translate-y-1/2 opacity-10"
      />
      <Image
        src="/assets/TopRightElem.png"
        alt="Top Right Decoration"
        width={20}
        height={104}
        priority
        className="absolute top-4 right-4 opacity-10"
      />

      {/* Header */}
      <Header onQuestionClick={handleQuestionClick} />

      {/* Title Section - Now showing the summary */}
      <div className="px-4 max-w-[1000px]">
        <h1 className="relative font-din text-[60px] font-bold text-[#1D5FBB] text-center flex items-center gap-2 leading-tight mb-2">
          {title}
          <Image
            src="/assets/titleImage.png"
            alt="Title Decoration"
            width={40}
            height={40}
            priority
            className="absolute top-0 -right-16"
          />
        </h1>
      </div>

      <p className="font-din text-[60px] font-bold text-[#1D5FBB] text-center flex items-center gap-2 leading-tight -mt-2">
        FOR
        <Image
          src="/assets/wordImage.png"
          alt="Decorative Word"
          width={120}
          height={56}
          priority
        />
        <span className="font-bold">EVERYONE, ANYTIME, ANYWHERE</span>
      </p>

      {/* Card - Now showing the random number and original response */}
      <div
        className="bg-[#061C3B] font-helvetica w-[630px] h-[300px] rounded-2xl shadow-lg p-8 text-[#F5F9FFBF] mt-6 relative pr-40 overflow-hidden mt-10"
        style={{
          boxShadow: `
            0px 0px 12px 0px #0000000A,
            -12px 8px 8px -4px #000B1F29,
            -12px 16px 16px -8px #000B1F33,
            -12px 32px 32px -16px #000B1F3D,
            -12px 80px 80px -40px #000B1F52,
            -12px 72px 72px -40px #000B1F14
          `,
        }}
      >
        <Image
          src="/assets/topRightImage.png"
          alt="Top Right Decoration"
          width={180}
          height={80}
          priority
          className="absolute top-0 right-0 opacity-20 bg-[#061C3B]"
        />

        <h2 className="font-din text-4xl font-bold text-[#F5F9FF] mb-2">
          {processedResponse
            ? `Random Number: ${processedResponse.randomNumber}`
            : "WHAT'S SAP?"}
        </h2>

        <div className="space-y-2 overflow-y-auto max-h-[200px]">
          {processedResponse?.originalResponse ? (
            <p className="font-helvetica text-[16px] font-normal leading-tight tracking-[-0.02em]">
              {processedResponse.originalResponse}
            </p>
          ) : (
            <>
              <p className="font-helvetica text-[16px] font-normal leading-tight tracking-[-0.02em]">
                SAP is a global software company specializing in ERP solutions.
                It focuses on business software for efficient management.
              </p>
              <p className="font-helvetica text-[16px] font-normal leading-tight tracking-[-0.02em] pt-2">
                It focuses on business software for efficient management.
              </p>
              <p className="font-helvetica text-[16px] font-normal leading-tight tracking-[-0.02em] pt-2">
                It focuses on business software for efficient process.
              </p>
              <p className="font-helvetica text-[16px] font-normal leading-tight tracking-[-0.02em] pt-2">
                SAP is a global software company specializing in ERP solutions.
                It focuses on business software for efficient management.
              </p>
              <p className="font-helvetica text-[16px] font-normal leading-tight tracking-[-0.02em] pt-2">
                SAP is a global software company specializing in ERP solutions.
                It focuses on business software for efficient management.
              </p>
            </>
          )}
        </div>

        <Image
          src="/assets/middleRightImage.png"
          alt="Middle Right Decoration"
          width={120}
          height={56}
          priority
          className="absolute right-4 top-3/4 transform -translate-y-1/2"
        />
      </div>

      {/* Title Modal */}
      <TitleModal
        isOpen={isModalOpen}
        currentTitle={title}
        onSave={handleSaveTitle}
        onClose={closeModal}
      />
      </div>
    </main>
  );
}
