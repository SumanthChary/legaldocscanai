
import { InView } from "@/components/ui/in-view";

export const AboutSection = () => {
  return (
    <div className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1 }
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewOptions={{ margin: "0px 0px -100px 0px" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">About Us</h2>
            <p className="text-lg text-gray-600 mb-8">
              LegalBriefAI was founded with a vision to revolutionize legal document analysis through artificial intelligence. Our team of legal professionals and AI experts work together to create innovative solutions that make legal work more efficient and accurate.
            </p>
            <p className="text-lg text-gray-600">
              We understand the challenges legal professionals face when dealing with vast amounts of documentation. That's why we've developed a platform that combines cutting-edge AI technology with user-friendly interfaces to streamline your workflow and enhance productivity.
            </p>
          </div>
        </InView>
      </div>
    </div>
  );
};
