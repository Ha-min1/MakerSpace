"use client";

import React, { useState, useEffect } from "react";
import { ManualStep, manualMeta } from "@/data/openingManual";
import { ManualHeader } from "@/components/ManualHeader";
import { ManualProgressBar } from "@/components/ManualProgressBar";
import { ManualStepCard } from "@/components/ManualStepCard";
import { ImageLightboxModal } from "@/components/ImageLightboxModal";
import { UploadGuideModal } from "@/components/UploadGuideModal";
import { StaffManualView } from "@/components/StaffManualView";
import {
  Mail,
  ArrowUp,
  FileCheck2,
  ExternalLink,
  Building2,
  BookOpen,
  CheckSquare
} from "lucide-react";

type ManualTab = "opening" | "closing" | "staff";

interface TabInfo {
  id: ManualTab;
  title: string;
  badge?: string;
  desc: string;
  items: string[];
}

const TA_3_TABS: TabInfo[] = [
  {
    id: "opening",
    title: "오픈 자가점검",
    desc: "출근 직후 행정실 확인, 시설 개방, 조명, 공조 환기 등 일일 오픈 루틴 (24개 항목)",
    items: [
      "사무실 좌측 기둥 불키기 (행정문의 공식 사이트 안내)",
      "마주보는 반대편 기둥 불키기",
      "직진후 좌회전 VR실 문 열기",
      "문 열면 정면에 VR실 불 키는 버튼",
      "나와서 좌회전 출입구 열려있는지 확인 및 불 키기",
      "유턴해서 직진 후 왼쪽 기둥 코너에서 에어컨 3개 및 불 모두 키기",
      "왼쪽 2단 좌석 좌측 끝쪽 기둥에서 좌석 하단 불 키기",
      "8~24번 사진 매칭 점검 항목"
    ],
  },
  {
    id: "closing",
    title: "마감 자가점검",
    badge: "준비 중",
    desc: "퇴근 전 잔류 이용자 퇴실, 전체 장비 소등, 가스/전력 차단 및 야간 출력 안전 확인",
    items: [
      "야간 예약 출력 3D프린터 설정 및 화재 감지 확인",
      "레이저 가공기 칠러 및 집진기 전원 OFF",
      "납땜 인두기 전원 및 화학 약품 보관함 잠금",
      "창문 및 자동문 락 확인",
      "전체 소등 및 경비 보안 시스템 세팅"
    ],
  },
  {
    id: "staff",
    title: "조교/근로학생 업무 매뉴얼",
    desc: "근로 기본 수칙, 근무 시간(학기/방학), 공간 미화 루틴, 3D프린터실·VR실 사용 신청 지침",
    items: [
      "근로 기본 수칙 (인사, 일정 조정 일주일 전, 방문객 응대, 부재중 메모)",
      "근무 시간 규정 (근로학생 9~17:30 / 조교 9~20시)",
      "공간 미화 & 환경 정비 (오전 출근, 1층 청소, 20시 퇴근 소등)",
      "공간 사용 안내 (3D프린터실 K-MOOC 4강 이수, VR실 신청서 및 1주 연장)"
    ],
  },
];

interface ManualViewerProps {
  initialSteps: ManualStep[];
}

export const ManualViewer: React.FC<ManualViewerProps> = ({ initialSteps }) => {
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
                  스태프 포털
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
              href={manualMeta.officialSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-all inline-flex items-center gap-1.5"
            >
              <span>공식 홈페이지</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-all cursor-pointer"
            >
              사진 가이드
            </button>
          </div>
        </div>

        {/* 3대 핵심 상단 점검 메뉴 (오픈 자가점검 / 마감 자가점검 / 조교·근로학생 업무 매뉴얼) */}
        <div className="border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-2 py-2">
            {TA_3_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === "opening" || tab.id === "staff") {
                      setActiveTab(tab.id);
                    } else {
                      setPreviewTab(tab);
                    }
                  }}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600"
                  }`}
                >
                  {tab.id === "opening" && <CheckSquare className="w-3.5 h-3.5" />}
                  {tab.id === "staff" && <BookOpen className="w-3.5 h-3.5" />}
                  <span>{tab.title}</span>
                  {tab.badge && !isActive && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300">
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
        {/* TAB 1: 오픈 자가점검 */}
        {activeTab === "opening" && (
          <div className="space-y-6">
            {/* Header Section */}
            <ManualHeader
              completedCount={completedIds.length}
              totalCount={initialSteps.length}
              onReset={handleReset}
              onOpenGuide={() => setIsGuideOpen(true)}
            />

            {/* Progress Bar & Quick Step Access */}
            <ManualProgressBar
              steps={initialSteps}
              completedIds={completedIds}
              onStepClick={handleStepClick}
            />

            {/* Dynamic Step Cards (1 to 24) */}
            <div className="space-y-6">
              {initialSteps.map((step) => (
                <ManualStepCard
                  key={step.id}
                  step={step}
                  isCompleted={completedIds.includes(step.id)}
                  onToggleComplete={handleToggleComplete}
                  onZoomImage={(src, title) => setZoomedImage({ src, title })}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: 조교 / 근로학생 업무 매뉴얼 */}
        {activeTab === "staff" && (
          <StaffManualView onPrint={() => window.print()} />
        )}

        {/* Bottom Emergency & Manager Contact Card */}
        <div className="mt-12 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 no-print shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  메이커스페이스 안내 및 행정 문의처
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                공간 이용, 장비 점검 및 행정 관련 문의는 아래 연락처를 확인해 주세요.
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
            {/* Site Manager Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-800 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-400 block uppercase">
                  메이커스페이스 사이트 담당
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

            {/* Official Center Administration Info Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-800 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-400 block uppercase">
                  센터 행정 문의 (공식)
                </span>
                <strong className="text-sm font-bold text-neutral-900 dark:text-white block mt-0.5">
                  건국대학교 메이커스페이스센터
                </strong>
                <a
                  href={manualMeta.officialSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline mt-0.5 block truncate max-w-[220px]"
                >
                  {manualMeta.officialSiteUrl}
                </a>
                <span className="text-[11px] text-neutral-400 block mt-0.5">
                  대표 TEL. {manualMeta.tel}
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
            {manualMeta.address} • TEL. {manualMeta.tel}
          </p>
          <p className="text-[11px] text-neutral-500">
            사이트 담당: {manualMeta.managerName} (<a href={`mailto:${manualMeta.managerEmail}`} className="hover:underline text-emerald-700 dark:text-emerald-400">{manualMeta.managerEmail}</a>)
            &nbsp;|&nbsp;
            <a href={manualMeta.officialSiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-700 dark:text-emerald-400">
              공식 웹사이트 바로가기
            </a>
          </p>
          <p className="text-[10px] text-neutral-400">
            © 2026 Konkuk MakerSpace Center. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Preview Modal for Closing Manual */}
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
                  {previewTab.title}
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
                  예정 점검 항목:
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
                마감 자가점검 리스트는 현재 준비 중이며, 곧 등록될 예정입니다.
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
};
