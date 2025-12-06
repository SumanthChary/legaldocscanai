import { MobileLayout } from "@/components/mobile/MobileLayout";

export default function MobileSplash() {
  return (
    <MobileLayout showNavigation={false} className="bg-[#ECF6EF]">
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#ECF6EF] to-white" />
        <div className="absolute inset-y-12 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-emerald-200/30 blur-[120px]" />

        <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6">
          <div className="flex h-[220px] w-[140px] items-center justify-center rounded-[48px] border border-emerald-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.15)]">
            <img src="/lovable-uploads/mobile-splash-device.png" alt="LegalDeep splash" className="h-40 w-auto" />
          </div>
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.6em] text-emerald-400">LegalDeep AI</p>
            <h1 className="mt-3 font-display text-4xl italic text-emerald-600">Launch secure scans</h1>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
