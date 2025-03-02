
import { UploadSection } from "./document-analysis/UploadSection";
import { AnalysesList } from "./document-analysis/AnalysesList";

export const DocumentAnalysis = () => {
  return (
    <div className="space-y-6">
      <UploadSection />
      <AnalysesList />
    </div>
  );
};
