
import { useState } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
      <div className="aspect-video">
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
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-20 h-20 bg-white/90 hover:bg-white/95 shadow-lg transition-all duration-300 hover:scale-105"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="h-10 w-10 text-primary" />
        ) : (
          <Play className="h-10 w-10 text-primary ml-1" />
        )}
      </Button>
    </div>
  );
};
