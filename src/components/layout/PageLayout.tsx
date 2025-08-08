
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReactNode } from "react";

type PageLayoutProps = {
  children: ReactNode;
  className?: string;
  withBanner?: boolean;
};

export const PageLayout = ({ children, className = "", withBanner = false }: PageLayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col bg-background ${className}`}>
      {withBanner && (
        <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center text-xs sm:text-sm py-2">
          Limited-time: 40% OFF – Unlock faster reviews and clearer insights today.
        </div>
      )}
      <Header />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};
