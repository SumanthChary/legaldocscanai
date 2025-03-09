
interface SummaryContentProps {
  analysisStatus?: string;
  summary?: string | null;
}

export const SummaryContent = ({ analysisStatus, summary }: SummaryContentProps) => {
  if (analysisStatus !== 'completed' || !summary) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-3">AI Summary</h2>
        <div className="bg-accent/5 p-4 rounded-lg border border-accent/10 text-gray-700 whitespace-pre-line">
          {summary}
        </div>
      </div>
    </div>
  );
};
