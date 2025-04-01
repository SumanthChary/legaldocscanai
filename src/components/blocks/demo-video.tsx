
import { useState } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InView } from "@/components/ui/in-view";

export const DemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Replace this with your actual Vimeo video ID
  const vimeoVideoId = "1059312783";
  
  const togglePlay = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const message = isPlaying ? '{"method":"pause"}' : '{"method":"play"}';
      iframe.contentWindow?.postMessage(message, 'https://player.vimeo.com');
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <InView
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      }}
      transition={{ duration: 0.5 }}
      viewOptions={{ once: true }}
    >
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-3xl blur-xl opacity-70"></div>
        
        <div className="relative aspect-video">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoVideoId}?h=6dbcdc93e5&background=1&autoplay=0&loop=1&byline=0&title=0`}
            className="w-full h-full absolute inset-0"
            allow="autoplay; fullscreen; picture-in-picture"
            style={{ border: 0 }}
          ></iframe>
        </div>
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
            isPlaying ? "opacity-0" : "opacity-100"
          }`}
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-24 h-24 bg-white/90 hover:bg-white/95 shadow-lg transition-all duration-300 hover:scale-110"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="h-12 w-12 text-primary" />
          ) : (
            <Play className="h-12 w-12 text-primary ml-2" />
          )}
        </Button>
      </div>
    </InView>
  );
};
