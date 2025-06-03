
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
      <Header />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};
