"use client";

import React, { useState, useEffect } from "react";
import { openingManualSteps, manualMeta } from "@/data/openingManual";
import { ManualHeader } from "@/components/ManualHeader";
import { ManualProgressBar } from "@/components/ManualProgressBar";
import { ManualStepCard } from "@/components/ManualStepCard";
import { ImageLightboxModal } from "@/components/ImageLightboxModal";
import { UploadGuideModal } from "@/components/UploadGuideModal";
import {
  Mail,
  Phone,
  ShieldAlert,
  ArrowUp,
  Sparkles,
  ChevronRight,
  Info,
  Clock,
  CheckCircle2,
  FileCheck2,
  Compass
} from "lucide-react";

type ManualTab = "opening" | "closing" | "equipment" | "safety" | "emergency";

interface TabInfo {
  id: ManualTab;
  title: string;
  badge?: string;
  desc: string;
  items: string[];
}

const TA_MANUAL_TABS: TabInfo[] = [
  {
    id: "opening",
    title: "오픈 자가점검",
    desc: "출근 직후 공간 개방, 조명, 공조, 장비 예열 등 일일 오픈 루틴",
    items: ["출입문 보안 해제", "전원 배전반 점등", "환기 공조 가동", "3D프린터 예열", "칠러 수온 확인"],
  },
  {
    id: "closing",
    title: "마감 자가점검",
    badge: "추천",
    desc: "퇴근 전 잔류 이용자 퇴실, 전체 장비 소등, 가스/전력 차단 및 문단속",
    items: ["야간 예약 출력 설정", "레이저 칠러 및 집진기 OFF", "납땜 인두기 전원 차단", "창문 및 자동문 락", "최종 소등 및 경비 세팅"],
  },
  {
    id: "equipment",
    title: "장비 일일점검",
    badge: "추천",
    desc: "3D 프린터 노즐, 레이저 커터 렌즈, CNC 등 정밀 장비 상태 점검표",
    items: ["FDM 베드 레벨링 & 잔여물", "레이저 광학 미러 그을음 확인", "배기 필터 차압 점검", "수공구 분실 여부 검수"],
  },
  {
    id: "safety",
    title: "이용자 응대·안전수칙",
    badge: "추천",
    desc: "학생 출입 시 안전교육 이수 확인, 보안경 착용 지도 및 예약 관리",
    items: ["안전교육 이수증 확인 절차", "보안경/장갑 필수 착용 지도", "음식물 반입 및 슬리퍼 제한", "예약 노쇼(No-Show) 처리 규정"],
  },
  {
    id: "emergency",
    title: "비상연락 & 사고대응",
    badge: "필수",
    desc: "화재, 부상, 유독 가스 발생 등 비상 상황 시 행동 요령 및 직통 연락망",
    items: ["소화기 및 비상벨 위치", "화재 발생 시 119 및 상황실 보고", "화상/절상 응급 처치함 사용법", "조하민 조교 긴급 핫라인"],
  },
];

export default function Home() {
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string } | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ManualTab>("opening");
  const [previewTab, setPreviewTab] = useState<TabInfo | null>(null);

  // Load saved checklist from localStorage
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
    if (confirm("오픈 자가점검 리스트를 모두 초기화하시겠습니까?")) {
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
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#0b100d] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <nav className="no-print sticky top-0 z-40 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-black text-sm flex items-center justify-center shadow-xs">
              KU
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                건국대학교 메이커스페이스
                <span className="hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                  조교 · 근로장학생 포털
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium">
                운영 SOP & 자가점검 시스템
              </p>
            </div>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${manualMeta.managerEmail}`}
              className="text-xs font-medium text-neutral-500 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors hidden md:inline-flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              담당: {manualMeta.managerName}
            </a>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-all cursor-pointer"
            >
              사진 가이드
            </button>
          </div>
        </div>

        {/* 조교/근로장학생 메뉴얼 탭 네비게이션 */}
        <div className="border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 overflow-x-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-2 py-2">
            <span className="text-[11px] font-bold text-neutral-400 mr-1 shrink-0 uppercase tracking-wider hidden lg:inline">
              매뉴얼 메뉴:
            </span>
            {TA_MANUAL_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === "opening") {
                      setActiveTab("opening");
                    } else {
                      setPreviewTab(tab);
                    }
                  }}
                  type="button"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600"
                  }`}
                >
                  <span>{tab.title}</span>
                  {tab.badge && !isActive && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Header Section */}
        <ManualHeader
          completedCount={completedIds.length}
          totalCount={openingManualSteps.length}
          onReset={handleReset}
          onOpenGuide={() => setIsGuideOpen(true)}
        />

        {/* Progress Bar & Quick Step Access */}
        <ManualProgressBar
          steps={openingManualSteps}
          completedIds={completedIds}
          onStepClick={handleStepClick}
        />

        {/* Step-by-step Cards (1, 2, 3...) */}
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

        {/* Bottom Emergency & Manager Contact Card */}
        <div className="mt-12 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 no-print shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  오픈 자가점검 완료 및 비상 연락망
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                점검 도중 장비 이상 또는 특이사항 발생 시 아래 담당자에게 즉시 알려주세요.
              </p>
            </div>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              맨 위로 가기
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            {/* Manager Contact Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-800 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-400 block uppercase">
                  메이커스페이스 총괄 담당
                </span>
                <strong className="text-sm font-bold text-neutral-900 dark:text-white block mt-0.5">
                  {manualMeta.managerName}
                </strong>
                <a
                  href={`mailto:${manualMeta.managerEmail}`}
                  className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline mt-0.5 block font-mono"
                >
                  {manualMeta.managerEmail}
                </a>
              </div>
            </div>

            {/* Emergency Info Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-800 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-400 block uppercase">
                  센터 긴급 지원
                </span>
                <strong className="text-sm font-bold text-neutral-900 dark:text-white block mt-0.5">
                  건국대학교 신공학관 행정실
                </strong>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 block">
                  화재/응급 시 상황실 및 119 동시 신고
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 py-6 text-center text-xs text-neutral-500 dark:text-neutral-400 mt-8">
        <div className="max-w-5xl mx-auto px-4 space-y-1.5">
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">
            건국대학교 메이커스페이스 센터 (Konkuk University MakerSpace)
          </p>
          <p className="text-[11px] text-neutral-500">
            담당자: {manualMeta.managerName} (<a href={`mailto:${manualMeta.managerEmail}`} className="hover:underline text-emerald-700 dark:text-emerald-400">{manualMeta.managerEmail}</a>)
          </p>
          <p className="text-[10px] text-neutral-400">
            © 2026 Konkuk MakerSpace Center. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Recommended TA Manual Preview Modal */}
      {previewTab && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewTab(null)}
        >
          <div
            className="relative max-w-md w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xl overflow-hidden p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {previewTab.title} (기획안)
                </h3>
              </div>
              <button
                onClick={() => setPreviewTab(null)}
                className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                닫기
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
              <p className="leading-relaxed text-neutral-700 dark:text-neutral-300 font-medium">
                {previewTab.desc}
              </p>

              <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl p-4 border border-neutral-200/70 dark:border-neutral-800">
                <div className="font-bold text-neutral-800 dark:text-neutral-200 mb-2 uppercase tracking-wide text-[11px]">
                  예정 점검 항목 목록:
                </div>
                <ul className="space-y-1.5">
                  {previewTab.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-[11px] text-neutral-400">
                해당 매뉴얼 양식도 준비되는 대로 순차적으로 시스템에 등록될 예정입니다.
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setPreviewTab(null)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
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
