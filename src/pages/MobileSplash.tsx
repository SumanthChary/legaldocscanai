import { MobileLayout } from "@/components/mobile/MobileLayout";

export default function MobileSplash() {
  return (
    <MobileLayout showNavigation={false} className="bg-transparent shadow-none">
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F9FAFB] p-4 text-center dark:bg-[#111827]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E6F5EE]/70 via-transparent to-transparent dark:from-emerald-500/10" />
        <div className="absolute inset-y-24 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-emerald-200/25 blur-[140px] dark:bg-emerald-500/15" />

        <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-10">
          <div className="logo-glow">
            <svg className="h-32 w-32 text-primary" viewBox="0 0 100 110" aria-hidden="true">
              <path
                d="M50 0L6.7 13.4V50C6.7 80.5 25.8 107.4 50 110C74.2 107.4 93.3 80.5 93.3 50V13.4L50 0ZM86.7 50C86.7 75.3 70.8 98.7 50 103C29.2 98.7 13.3 75.3 13.3 50V19.5L50 8.1L86.7 19.5V50Z"
                fill="rgba(16,185,129,0.6)"
              />
              <path d="M50 6L13 18.2V50C13 75.8 29.5 99.8 50 104C70.5 99.8 87 75.8 87 50V18.2L50 6Z" fill="#10B981" />
              <rect fill="rgba(255,255,255,0.4)" height="10" rx="2" width="50" x="25" y="28" />
              <rect fill="rgba(255,255,255,0.4)" height="10" rx="2" width="50" x="25" y="45" />
              <rect fill="rgba(255,255,255,0.4)" height="10" rx="2" width="50" x="25" y="62" />
            </svg>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.6em] text-slate-400">Launching</p>
            <h1 className="text-4xl font-display italic text-primary">LegalDeep AI</h1>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
