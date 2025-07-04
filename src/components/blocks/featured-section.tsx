
import { InView } from "@/components/ui/in-view";
import { ExternalLink } from "lucide-react";

export const FeaturedSection = () => {
  const features = [
    {
      name: "Product Hunt",
      logo: "/lovable-uploads/product-hunt-logo.png",
      url: "https://www.producthunt.com/posts/postproai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-legalbriefai",
      description: "Featured Product"
    },
    {
      name: "Tinylaunch",
      logo: "/lovable-uploads/tinylaunch-logo.png", 
      url: "https://tinylaun.ch/launch/3631",
      description: "Launched on Tinylaunch"
    },
    {
      name: "Peerlist",
      logo: "/lovable-uploads/peerlist-logo.png",
      url: "https://peerlist.io/sumanthdev/project/legalbrief-ai",
      description: "Showcased Project"
    },
    {
      name: "Listing Cat",
      logo: "/lovable-uploads/listingcat-logo.png",
      url: "https://www.listingcat.com/",
      description: "Directory Listing"
    }
  ];

  return (
    <section className="py-12 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-600 mb-6">
              Featured on
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
              {features.map((feature, index) => (
                <InView
                  key={feature.name}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <a
                    href={feature.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <span className="text-xs font-bold text-gray-600 group-hover:text-purple-600">
                        {feature.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                      {feature.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </InView>
              ))}
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
};
