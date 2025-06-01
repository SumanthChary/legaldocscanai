
import { Star, Quote } from "lucide-react";
import { InView } from "@/components/ui/in-view";

export const SocialProof = () => {
  const logos = [
    { name: "Harvard Law", logo: "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=120&h=60&fit=crop" },
    { name: "Stanford Legal", logo: "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=120&h=60&fit=crop" },
    { name: "Baker McKenzie", logo: "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=120&h=60&fit=crop" },
    { name: "Clifford Chance", logo: "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=120&h=60&fit=crop" },
    { name: "Latham & Watkins", logo: "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=120&h=60&fit=crop" }
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">4.9 out of 5 stars</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Used by Top Law Firms Worldwide
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join the legal professionals who've already transformed their practice with our AI-powered solution
            </p>
          </div>
        </InView>

        {/* Client Logos */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60 hover:opacity-80 transition-opacity duration-300">
          {logos.map((client, index) => (
            <div key={index} className="flex items-center justify-center p-4">
              <div className="w-24 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">{client.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Testimonial */}
        <InView
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 }
          }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
              <Quote className="h-8 w-8 text-blue-500 mb-4" />
              <blockquote className="text-xl text-gray-700 mb-6 italic">
                "This isn't just another legal tech tool - it's a complete game-changer. We've seen immediate ROI and our clients are amazed by the speed and accuracy of our document reviews."
              </blockquote>
              <div className="flex items-center gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face" 
                  alt="David Thompson" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900">David Thompson</div>
                  <div className="text-sm text-gray-600">Senior Partner, Thompson & Associates</div>
                </div>
              </div>
            </div>
          </div>
        </InView>
      </div>
    </div>
  );
};
