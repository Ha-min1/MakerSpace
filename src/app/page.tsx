import {
  getDynamicOpeningManualSteps,
  getDynamicClosingManualSteps,
} from "@/lib/manualLoader";
import { ManualViewer } from "@/components/ManualViewer";

export default function Home() {
  const openingSteps = getDynamicOpeningManualSteps();
  const closingSteps = getDynamicClosingManualSteps();

  return (
    <ManualViewer
      initialSteps={openingSteps}
      closingSteps={closingSteps}
    />
  );
}
