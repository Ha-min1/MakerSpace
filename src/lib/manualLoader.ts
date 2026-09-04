import fs from "fs";
import path from "path";
import { ManualStep, openingManualSteps } from "@/data/openingManual";

export function getDynamicOpeningManualSteps(): ManualStep[] {
  const manualDir = path.join(process.cwd(), "public", "manual");
  let existingFiles: string[] = [];

  try {
    if (fs.existsSync(manualDir)) {
      existingFiles = fs.readdirSync(manualDir);
    }
  } catch (err) {
    console.error("Failed to read public/manual:", err);
  }

  const imageMap = new Map<number, string>();
  const pattern = /^OpeningManual_(\d+)\.(jpg|jpeg|png|webp)$/i;

  for (const file of existingFiles) {
    const match = file.match(pattern);
    if (match) {
      const stepId = parseInt(match[1], 10);
      imageMap.set(stepId, file);
    }
  }

  // Clone defined steps
  const steps: ManualStep[] = openingManualSteps.map((step) => {
    const matchedFile = imageMap.get(step.id);
    return {
      ...step,
      imageName: matchedFile || step.imageName,
    };
  });

  // Automatically append newly added images that don't have defined text yet!
  const detectedIds = Array.from(imageMap.keys()).sort((a, b) => a - b);
  for (const id of detectedIds) {
    const exists = steps.some((s) => s.id === id);
    if (!exists) {
      const fileName = imageMap.get(id)!;
      steps.push({
        id,
        title: `점검 항목 ${id} (신규 사진 등록됨)`,
        category: "추가 점검",
        description: `사진(${fileName})이 등록되었습니다. 이 항목의 세부 점검 지침 및 안내 텍스트를 업데이트해 주세요.`,
        checkPoints: [
          `현장 사진(${fileName}) 대조 확인`,
          "해당 구역/장비 안전 상태 점검 및 확인",
        ],
        imageName: fileName,
        estimatedMinutes: 3,
      });
    }
  }

  // Sort by id ascending
  steps.sort((a, b) => a.id - b.id);
  return steps;
}
