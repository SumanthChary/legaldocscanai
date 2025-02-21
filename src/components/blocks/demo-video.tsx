
import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl">
      <div className="aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster="/placeholder.svg"
          muted
          playsInline
          onEnded={handleVideoEnd}
          loop
        >
          <source src="/demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div
        className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
      />
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-16 h-16 bg-white/90 hover:bg-white/95 shadow-lg transition-all duration-300 hover:scale-105"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="h-8 w-8 text-primary" />
        ) : (
          <Play className="h-8 w-8 text-primary ml-1" />
        )}
      </Button>
    </div>
  );
};
