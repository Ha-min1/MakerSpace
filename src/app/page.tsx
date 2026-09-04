import { getDynamicOpeningManualSteps } from "@/lib/manualLoader";
import { ManualViewer } from "@/components/ManualViewer";

export default function Home() {
  const steps = getDynamicOpeningManualSteps();
  return <ManualViewer initialSteps={steps} />;
}
