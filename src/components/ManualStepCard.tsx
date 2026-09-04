"use client";

import React from "react";
import { Check, Clock, AlertTriangle, Lightbulb, CheckSquare, Square } from "lucide-react";
import { ManualStep } from "@/data/openingManual";
import { ManualImage } from "./ManualImage";

interface ManualStepCardProps {
  step: ManualStep;
  isCompleted: boolean;
  onToggleComplete: (id: number) => void;
  onZoomImage: (src: string, title: string) => void;
}

export const ManualStepCard: React.FC<ManualStepCardProps> = ({
  step,
  isCompleted,
  onToggleComplete,
  onZoomImage,
}) => {
  return (
    <section
      id={`step-${step.id}`}
      className={`manual-step-card break-inside-avoid relative rounded-2xl transition-all duration-200 ${
        isCompleted
          ? "bg-white/70 dark:bg-neutral-900/60 border-2 border-emerald-500/50 shadow-sm opacity-95"
          : "bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-md hover:shadow-lg"
      } p-6 md:p-7`}
    >
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Step Badge */}
          <span
            className={`inline-flex items-center justify-center px-3 py-1 rounded-xl text-xs font-black font-mono tracking-wider uppercase transition-colors ${
              isCompleted
                ? "bg-emerald-600 text-white"
                : "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300"
            }`}
          >
            Step {step.id < 10 ? `0${step.id}` : step.id}
          </span>

          {/* Category */}
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            {step.category}
          </span>

          {/* Estimated Time */}
          {step.estimatedMinutes && (
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
              <Clock className="w-3 h-3 text-neutral-400" />
              약 {step.estimatedMinutes}분
            </span>
          )}
        </div>

        {/* Completion Check Button */}
        <button
          onClick={() => onToggleComplete(step.id)}
          type="button"
          className={`no-print inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isCompleted
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
          }`}
          title="완료 여부 체크"
        >
          {isCompleted ? (
            <>
              <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>완료됨</span>
            </>
          ) : (
            <>
              <Square className="w-4 h-4 text-neutral-400" />
              <span>확인 완료</span>
            </>
          )}
        </button>

        {/* Print Checkbox Box (for physical paper check) */}
        <div className="print-only flex items-center gap-1 text-xs font-semibold">
          <span>확인: [ &nbsp; &nbsp; ]</span>
        </div>
      </div>

      {/* Main Grid: Left is Text Instructions, Right is Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Text & Checkpoints (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2
            className={`text-lg md:text-xl font-bold tracking-tight text-neutral-900 dark:text-white ${
              isCompleted ? "line-through text-neutral-400 dark:text-neutral-500 decoration-emerald-500/70" : ""
            }`}
          >
            {step.id}. {step.title}
          </h2>

          <p className="text-sm md:text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
            {step.description}
          </p>

          {/* Check Points List */}
          {step.checkPoints.length > 0 && (
            <div className="bg-neutral-50 dark:bg-neutral-800/40 rounded-xl p-4 border border-neutral-200/60 dark:border-neutral-800">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                세부 점검 항목 (Checkpoints)
              </h3>
              <ul className="space-y-1.5">
                {step.checkPoints.map((cp, idx) => (
                  <li
                    key={idx}
                    className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{cp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warning Banner if present */}
          {step.warning && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">안전 주의사항</strong>
                {step.warning}
              </div>
            </div>
          )}

          {/* Tip Banner if present */}
          {step.tip && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200 text-xs leading-relaxed">
              <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">운영 꿀팁 (Tip)</strong>
                {step.tip}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Image (5 cols) */}
        <div className="lg:col-span-5">
          <ManualImage
            imageName={step.imageName}
            stepNumber={step.id}
            stepTitle={step.title}
            onZoom={onZoomImage}
          />
        </div>
      </div>
    </section>
  );
};
