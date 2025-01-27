import { Footerdemo } from "@/components/ui/footer-section";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold">Welcome to AI Legal Document Summarizer</h1>
          <p className="mt-2 text-lg">Your trusted partner in legal document analysis.</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <section>
          <h2 className="text-3xl font-bold">Features</h2>
          <p className="mt-2">Discover how our AI can help you streamline your legal processes.</p>
        </section>
        <section className="mt-12">
          <h2 className="text-3xl font-bold">Get Started</h2>
          <p className="mt-2">Sign up today and experience the future of legal document management.</p>
        </section>
      </main>
      <Footerdemo />
    </div>
  );
};

export default Landing;
