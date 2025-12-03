import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-[max(884px,100vh)] items-center justify-center bg-[#F9FAFB] px-4 text-slate-900 dark:bg-[#111827]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(230,245,238,0.5),rgba(249,250,251,0))] dark:bg-[radial-gradient(circle,rgba(16,185,129,0.12),rgba(17,24,39,0))]" />
      </div>
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <div className="logo-glow">
          <svg className="h-32 w-32 text-primary" fill="currentColor" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0L6.7 13.4V50C6.7 80.5 25.8 107.4 50 110C74.2 107.4 93.3 80.5 93.3 50V13.4L50 0ZM86.7 50C86.7 75.3 70.8 98.7 50 103C29.2 98.7 13.3 75.3 13.3 50V19.5L50 8.1L86.7 19.5V50Z" fill="rgba(16,185,129,0.7)" />
            <path d="M50 6L13 18.2V50C13 75.8 29.5 99.8 50 104C70.5 99.8 87 75.8 87 50V18.2L50 6Z" fill="#10B981" />
            <rect fill="rgba(255,255,255,0.4)" height="10" rx="2" width="50" x="25" y="28" />
            <rect fill="rgba(255,255,255,0.4)" height="10" rx="2" width="50" x="25" y="45" />
            <rect fill="rgba(255,255,255,0.4)" height="10" rx="2" width="50" x="25" y="62" />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">LegalDeep AI</p>
          <h1 className="instrument-serif-regular-italic text-3xl text-primary">LegalDeep AI App</h1>
        </div>
        <Button
          onClick={() => navigate("/auth")}
          className="h-12 w-full rounded-full bg-primary text-base font-semibold text-white shadow-lg shadow-primary/30"
        >
          Enter workspace
        </Button>
      </div>
    </div>
  );
}
