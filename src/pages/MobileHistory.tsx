import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, FileText } from "lucide-react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const filters = [
  { key: "all", label: "All" },
  { key: "high", label: "High Risk" },
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
];

type FilterKey = typeof filters[number]["key"];

const deriveRiskMeta = (analysisId: string, index: number) => {
  const levels = [
    { level: "high" as const, label: "3H", badgeBg: "bg-red-50", text: "text-red-600" },
    { level: "medium" as const, label: "2M", badgeBg: "bg-amber-50", text: "text-amber-600" },
    { level: "low" as const, label: "1L", badgeBg: "bg-emerald-50", text: "text-emerald-600" },
  ];
  const meta = levels[index % levels.length];
  return { ...meta, id: analysisId };
};

const formatDateLabel = (dateString: string) => {
  const created = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - created.getTime();
  const diffDays = diff / (1000 * 60 * 60 * 24);
  if (diffDays < 1) return "Today";
  if (diffDays < 2) return "Yesterday";
  if (diffDays < 7) return `${Math.floor(diffDays)}d ago`;
  return created.toLocaleDateString();
};

export default function MobileHistory() {
  const navigate = useNavigate();
  const { analyses, isRefreshing } = useAnalyses();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    return analyses
      .filter((analysis) =>
        (analysis.file_name || "").toLowerCase().includes(query.toLowerCase())
      )
      .filter((analysis, index) => {
        if (activeFilter === "all") return true;
        const created = new Date(analysis.created_at);
        const now = new Date();
        const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        const risk = deriveRiskMeta(analysis.id, index).level;
        if (activeFilter === "high") return risk === "high";
        if (activeFilter === "today") return diffDays < 1;
        if (activeFilter === "week") return diffDays < 7;
        if (activeFilter === "month") return diffDays < 30;
        return true;
      });
  }, [analyses, query, activeFilter]);

  return (
    <MobileLayout>
      <div className="mx-auto max-w-[480px] h-screen flex flex-col bg-background">
        <header className="flex h-20 items-center justify-between px-4">
          <div className="w-12" />
          <h1 className="font-display italic text-2xl">Scan history</h1>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground">
              <Search />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground">
              <Filter />
            </button>
          </div>
        </header>

        <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide pb-2">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`flex items-center justify-center px-4 h-9 rounded-full text-sm whitespace-nowrap transition ${
                key === activeFilter
                  ? "bg-primary/20 text-primary font-semibold"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto px-4 pb-28">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card className="p-4 text-center rounded-xl">
              <div className="text-2xl font-bold text-primary">{analyses.length}</div>
              <p className="text-sm text-muted-foreground">Total scans</p>
            </Card>
            <Card className="p-4 text-center rounded-xl">
              <div className="text-2xl font-bold text-emerald-600">
                {analyses.filter((analysis) => (analysis.status || analysis.analysis_status) === "completed").length}
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </Card>
          </div>

          <div className="flex items-center bg-card rounded-2xl px-4 py-3 gap-2 mb-4">
            <Search className="text-muted-foreground w-4 h-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search documents..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-4">
            {isRefreshing ? (
              [1, 2, 3].map((skeleton) => (
                <Card key={skeleton} className="h-[140px] p-4 rounded-xl animate-pulse" />
              ))
            ) : filtered.length === 0 ? (
              <Card className="p-8 text-center rounded-xl">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">No scans match your filters.</p>
                <Button onClick={() => navigate("/scan")} size="sm">Start scanning</Button>
              </Card>
            ) : (
              filtered.map((analysis, index) => {
                const risk = deriveRiskMeta(analysis.id, index);
                return (
                  <Card key={analysis.id} className="flex gap-4 p-3 rounded-2xl">
                    <div className="w-[96px] h-[120px] rounded-xl bg-gradient-to-b from-primary/20 to-primary/5" />
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <p className="text-base font-bold truncate">
                          {analysis.file_name || "Untitled contract"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Scanned: {formatDateLabel(analysis.created_at)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`px-3 h-6 rounded-full text-xs font-bold ${risk.badgeBg} ${risk.text}`}>
                            {risk.label}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/document-summary/${analysis.id}`)}
                        className="flex items-center gap-1 text-primary text-sm font-semibold"
                      >
                        View report
                        <span className="text-xs">→</span>
                      </button>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </main>
      </div>
    </MobileLayout>
  );
}