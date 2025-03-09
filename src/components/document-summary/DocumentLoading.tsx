
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const DocumentLoading = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-10 w-48" />
          </div>
          <Card className="p-6">
            <Skeleton className="h-6 w-64 mb-4" />
            <Skeleton className="h-4 w-36 mb-8" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-32 w-full" />
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};
