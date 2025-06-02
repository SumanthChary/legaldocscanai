
import { InView } from "@/components/ui/in-view";

export const AboutSection = () => {
  return (
    <div className="py-12 md:py-16 lg:py-24 bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1 }
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewOptions={{ margin: "0px 0px -100px 0px" }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-6 md:mb-8">
              About Us
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
              LegalBriefAI was founded with a vision to revolutionize legal document analysis through artificial intelligence. Our team of legal professionals and AI experts work together to create innovative solutions that make legal work more efficient and accurate.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              We understand the challenges legal professionals face when dealing with vast amounts of documentation. That's why we've developed a platform that combines cutting-edge AI technology with user-friendly interfaces to streamline your workflow and enhance productivity.
            </p>
          </div>
        </InView>
      </div>
    </div>
  );
};
