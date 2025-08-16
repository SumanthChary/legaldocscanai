import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { useState } from "react";

interface MacBookMockupProps {
  videoSrc: string;
  thumbnailSrc: string;
  className?: string;
}

export const MacBookMockup = ({ videoSrc, thumbnailSrc, className }: MacBookMockupProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const handlePlay = () => {
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {/* MacBook outer shell */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[20px] p-3 shadow-2xl">
        {/* Screen bezel */}
        <div className="bg-black rounded-[12px] p-1">
          {/* Screen content */}
          <div className="relative bg-black rounded-[8px] overflow-hidden aspect-[16/10]">
            {/* Video container */}
            <div className="relative w-full h-full">
              {!isPlaying && (
                <img
                  src={thumbnailSrc}
                  alt="Demo thumbnail"
                  className="w-full h-full object-cover"
                />
              )}
              
              <video
                ref={setVideoElement}
                src={videoSrc}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  isPlaying ? "opacity-100" : "opacity-0 absolute inset-0"
                )}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                playsInline
                muted
              />

              {/* Play button overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                  <button
                    onClick={handlePlay}
                    className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                  >
                    <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
                  </button>
                </div>
              )}
            </div>

            {/* Webcam notch */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-black rounded-full border-2 border-gray-800">
              <div className="absolute inset-1 bg-gray-900 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bottom shell */}
        <div className="mt-1 h-8 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-[16px] relative">
          {/* Trackpad area */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-900 rounded-sm"></div>
        </div>
      </div>

      {/* Floating elements around MacBook */}
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-purple-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 -right-8 w-6 h-6 bg-emerald-500 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};