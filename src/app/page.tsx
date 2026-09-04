"use client";

import React, { useState, useEffect } from "react";
import { openingManualSteps, manualMeta } from "@/data/openingManual";
import { ManualHeader } from "@/components/ManualHeader";
import { ManualProgressBar } from "@/components/ManualProgressBar";
import { ManualStepCard } from "@/components/ManualStepCard";
import { ImageLightboxModal } from "@/components/ImageLightboxModal";
import { UploadGuideModal } from "@/components/UploadGuideModal";
import { Wrench, Shield, CheckCircle, ArrowUp, Sparkles, BookOpen, Layers } from "lucide-react";

export default function Home() {
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string } | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"opening" | "closing" | "equipment">("opening");

  // Load saved checklist state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ku_makerspace_opening_checks");
      if (saved) {
        setCompletedIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save checklist state to localStorage
  const handleToggleComplete = (id: number) => {
    setCompletedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("ku_makerspace_opening_checks", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleReset = () => {
    if (confirm("출근 체크리스트를 모두 초기화하시겠습니까?")) {
      setCompletedIds([]);
      try {
        localStorage.removeItem("ku_makerspace_opening_checks");
      } catch {
        // ignore
      }
    }
  };

  const handleStepClick = (id: number) => {
    const el = document.getElementById(`step-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0c120e] text-neutral-900 dark:text-neutral-100 flex flex-col">
      {/* Top Staff Intranet Navigation Bar */}
      <nav className="no-print border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-md">
              KU
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5">
                건국대학교 메이커스페이스
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  스태프 포털
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Konkuk Makerspace Internal SOP
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab("opening")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "opening"
                  ? "bg-white dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              🌅 출근 / 오픈 매뉴얼
            </button>
            <button
              onClick={() => alert("마감/퇴근 매뉴얼은 현재 준비 중입니다.")}
              className="px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>🌙 마감 매뉴얼</span>
              <span className="text-[9px] px-1 py-0.2 bg-neutral-200 dark:bg-neutral-700 rounded">예정</span>
            </button>
            <button
              onClick={() => alert("장비별 기초 매뉴얼(3D프린터, 레이저커터 등)은 순차적으로 업데이트될 예정입니다.")}
              className="px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>🖨️ 장비 매뉴얼</span>
              <span className="text-[9px] px-1 py-0.2 bg-neutral-200 dark:bg-neutral-700 rounded">예정</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 transition-colors border border-emerald-200/60 dark:border-emerald-800/40 cursor-pointer"
            >
              📷 사진 등록 안내
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 md:py-10">
        {/* Header with Title & Action Buttons */}
        <ManualHeader
          completedCount={completedIds.length}
          totalCount={openingManualSteps.length}
          onReset={handleReset}
          onOpenGuide={() => setIsGuideOpen(true)}
        />

        {/* Interactive Sticky Progress & Quick Jump */}
        <ManualProgressBar
          steps={openingManualSteps}
          completedIds={completedIds}
          onStepClick={handleStepClick}
        />

        {/* Sequential Step Cards (1, 2, 3, 4...) */}
        <div className="space-y-6">
          {openingManualSteps.map((step) => (
            <ManualStepCard
              key={step.id}
              step={step}
              isCompleted={completedIds.includes(step.id)}
              onToggleComplete={handleToggleComplete}
              onZoomImage={(src, title) => setZoomedImage({ src, title })}
            />
          ))}
        </div>

        {/* Bottom Completion Box */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-emerald-900/90 to-emerald-950 text-white text-center space-y-4 no-print shadow-xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">
            오늘 하루도 안전하고 즐거운 메이킹 환경을 만들어 갑시다!
          </h3>
          <p className="text-xs md:text-sm text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
            모든 오픈 점검을 마친 후에는 센터 메인 데스크의 일일 관리 일지에 서명해 주세요.
            <br />
            비상 연락망: 신공학관 행정실 (02-450-XXXX) | 센터 책임 교수실 (02-450-YYYY)
          </p>
          <div className="pt-2">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              맨 위로 이동
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 py-8 text-center text-xs text-neutral-500 dark:text-neutral-400 mt-12">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-neutral-700 dark:text-neutral-300">
            건국대학교 메이커스페이스 센터 (Konkuk University MakerSpace)
          </p>
          <p className="text-[11px]">
            서울특별시 광진구 능동로 120 건국대학교 신공학관 • 내부 스태프 관리용 시스템
          </p>
          <p className="text-[10px] text-neutral-400 pt-1">
            Next.js & Tailwind CSS로 제작됨 • Vercel 호환 배포 준비 완료
          </p>
        </div>
      </footer>

      {/* Image Lightbox Modal */}
      <ImageLightboxModal
        src={zoomedImage?.src ?? null}
        title={zoomedImage?.title ?? null}
        onClose={() => setZoomedImage(null)}
      />

      {/* Upload Guide Modal */}
      <UploadGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
