import { Heart } from "lucide-react";
import { FloatingPanelRoot, FloatingPanelTrigger, FloatingPanelContent, FloatingPanelBody } from "@/components/ui/floating-panel";

export const DonationBar = () => {
  return (
    <div className="bg-accent/10 p-4 rounded-lg">
      <FloatingPanelRoot>
        <FloatingPanelTrigger title="Support Us" className="w-full">
          <div className="flex items-center gap-2 w-full">
            <Heart className="h-5 w-5 text-accent animate-pulse" />
            <p className="text-sm md:text-base text-primary">
              We need DONATIONS for Multiple IMPROVEMENTS
            </p>
          </div>
        </FloatingPanelTrigger>
        <FloatingPanelContent className="w-[90vw] max-w-lg">
          <FloatingPanelBody>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Support LegalBriefAI</h3>
              <p className="text-sm text-gray-600">
                Your donation helps us improve our services and maintain high-quality legal document analysis. 
                Donate $5/$10 and receive lifetime access to our premium features!
              </p>
              <div className="flex justify-center">
                <a 
                  href="https://www.figma.com/proto/eWAJORd1BV6OLT8V8a7CeE/LegalBriefAI?node-id=1-2&p=f&t=lxhZSOMTKwa7ZmrQ-1&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
                >
                  Donate Now
                </a>
              </div>
            </div>
          </FloatingPanelBody>
        </FloatingPanelContent>
      </FloatingPanelRoot>
    </div>
  );
};