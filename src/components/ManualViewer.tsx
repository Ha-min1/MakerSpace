"use client";

import React, { useState } from "react";
import { ManualStep, manualMeta } from "@/data/openingManual";
import { ManualHeader } from "@/components/ManualHeader";
import { ManualProgressBar } from "@/components/ManualProgressBar";
import { ManualStepCard } from "@/components/ManualStepCard";
import { ImageLightboxModal } from "@/components/ImageLightboxModal";
import { UploadGuideModal } from "@/components/UploadGuideModal";
import { StaffManualView } from "@/components/StaffManualView";
import { useInspectionSync } from "@/hooks/useInspectionSync";
import {
  Mail,
  ArrowUp,
  ExternalLink,
  Building2,
  BookOpen,
  CheckSquare,
  Moon,
  SunMedium
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
    title: "🌅 오픈 자가점검",
    badge: "10대 공간",
    desc: "신공학관 정문 앞쪽 출입구 개방부터 10대 핵심 공간 조명·냉난방·장비 가동 일일 오픈 루틴",
    items: [
      "1. 앞쪽 출입구 (FrontOpenDoor) 개방 및 복도 조명 ON",
      "2. VR실 (VRSpace) 보안 해제 및 냉난방/조명 확인",
      "3. 컨퍼런스홀 (ConferenceHall) 전원 스위치 ON",
      "4. 행정실 (Office) 문 개방 및 출근 세팅",
      "5. 프로젝트 공간 (ProjectSpace) 기둥 조명/2층 좌석/에어컨 ON",
      "6. 3D프린터실 (3DSpace) 보안 해제 및 조명/항온항습 점검",
      "7. 뒤쪽 출입구 (BackOpenDoor) 개방 및 조명 점등",
      "8~10. 무한상상실, 오픈형 강의장, 2층 복도 점검"
    ],
  },
  {
    id: "closing",
    title: "🌙 마감 자가점검",
    badge: "역순 소등",
    desc: "오픈 루틴의 원상복구(역순): 2층 복도부터 앞쪽 출입구까지 순차 소등, 야간 3D 출력 안전, 전력 차단 및 도어락 잠금",
    items: [
      "1. 설계실 근처 2층 복도 소등 및 잔류자 확인",
      "2. 오픈형 강의장 기자재 OFF 및 소등",
      "3. 무한상상실 소등 및 문 잠금",
      "4. 뒤쪽 출입구 소등 및 문 잠금",
      "5. 3D프린터실 야간 출력 안전 확인 / 항온 유지 / 소등 / 문 잠금",
      "6. 프로젝트 공간 에어컨 3대 OFF / 기둥 소등 (마주보는 스위치 유지)",
      "7. 행정실 PC 종료, 일지 정리, 소등 및 문 잠금",
      "8. 컨퍼런스홀 전원 스위치 OFF",
      "9. VR실 장비 OFF, 소등 및 문 잠금",
      "10. 앞쪽 주 출입구 최종 소등 및 보안 경비 세팅"
    ],
  },
  {
    id: "staff",
    title: "📖 조교/근로학생 업무 매뉴얼",
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
  closingSteps?: ManualStep[];
}

export const ManualViewer: React.FC<ManualViewerProps> = ({
  initialSteps,
  closingSteps = [],
}) => {
  const [activeTab, setActiveTab] = useState<ManualTab>("opening");
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // 1. 오픈 자가점검 실시간 동기화
  const openingSync = useInspectionSync({
    type: "opening",
    totalSteps: initialSteps.length,
  });

  // 2. 마감 자가점검 실시간 동기화
  const closingSync = useInspectionSync({
    type: "closing",
    totalSteps: closingSteps.length > 0 ? closingSteps.length : 10,
  });

  // 현재 활성 탭에 따른 데이터 및 동기화 상태 분기
  const currentSync = activeTab === "closing" ? closingSync : openingSync;
  const currentSteps =
    activeTab === "closing"
      ? closingSteps.length > 0
        ? closingSteps
        : initialSteps
      : initialSteps;

  const [zoomedImage, setZoomedImage] = useState<{
    src: string;
    title: string;
    images?: string[];
    currentIndex?: number;
  } | null>(null);

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
                운영 SOP & 자가점검 시스템 (10대 공간 연동)
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-2 py-2 overflow-x-auto">
            {TA_3_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600"
                  }`}
                >
                  {tab.id === "opening" && <SunMedium className="w-3.5 h-3.5" />}
                  {tab.id === "closing" && <Moon className="w-3.5 h-3.5" />}
                  {tab.id === "staff" && <BookOpen className="w-3.5 h-3.5" />}
                  <span>{tab.title}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        isActive
                          ? "bg-emerald-800 text-emerald-100"
                          : "bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300"
                      }`}
                    >
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
        {/* TAB 1 & 2: 오픈 자가점검 또는 마감 자가점검 */}
        {(activeTab === "opening" || activeTab === "closing") && (
          <div className="space-y-6">
            {/* Header Section */}
            <ManualHeader
              completedCount={currentSync.completedIds.length}
              totalCount={currentSteps.length}
              inspectorName={currentSync.inspectorName}
              onInspectorNameChange={currentSync.setInspectorName}
              connectionStatus={currentSync.connectionStatus}
              onReset={currentSync.resetChecks}
              onOpenGuide={() => setIsGuideOpen(true)}
            />

            {/* Progress Bar & Quick Step Access */}
            <ManualProgressBar
              steps={currentSteps}
              completedIds={currentSync.completedIds}
              onStepClick={handleStepClick}
            />

            {/* Dynamic Step Cards (10대 공간 매칭) */}
            <div className="space-y-6">
              {currentSteps.map((step) => (
                <ManualStepCard
                  key={step.id}
                  step={step}
                  isCompleted={currentSync.completedIds.includes(step.id)}
                  checkedBy={currentSync.checkDetails[step.id]?.checkedBy}
                  onToggleComplete={currentSync.toggleStep}
                  onZoomImage={(src, title, stepImages, initialIndex) =>
                    setZoomedImage({
                      src,
                      title,
                      images: stepImages,
                      currentIndex: initialIndex ?? 0,
                    })
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 조교 / 근로학생 업무 매뉴얼 */}
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

      {/* Lightbox Modal */}
      <ImageLightboxModal
        src={zoomedImage?.src ?? null}
        title={zoomedImage?.title ?? null}
        images={zoomedImage?.images}
        currentIndex={zoomedImage?.currentIndex ?? 0}
        onNavigate={(newIndex) => {
          if (zoomedImage && zoomedImage.images) {
            setZoomedImage({
              ...zoomedImage,
              src: `/manual/${zoomedImage.images[newIndex]}`,
              currentIndex: newIndex,
            });
          }
        }}
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
