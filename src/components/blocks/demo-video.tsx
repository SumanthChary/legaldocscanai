
import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InView } from "@/components/ui/in-view";

export const DemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Demo video from Supabase storage
  const videoUrl = "https://nhmhqhhxlcmhufxxifbn.supabase.co/storage/v1/object/public/Videos/demo%20for%20legaldeepai.mp4";
  // Custom thumbnail to replace Vimeo watermark
  const thumbnailUrl = "https://nhmhqhhxlcmhufxxifbn.supabase.co/storage/v1/object/public/Videos/Screenshot%20(582).png";
  
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

  return (
    <InView
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 }
      }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      viewOptions={{ once: true, margin: "-100px" }}
    >
      <div className="relative group">
        {/* Sophisticated glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Main container with refined styling */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-1">
          {/* Inner glow border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 opacity-50"></div>
          
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full absolute inset-0 object-cover"
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            
            {/* Custom thumbnail overlay */}
            <div
              className={`absolute inset-0 transition-all duration-500 ${
                isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              style={{
                backgroundImage: `url(${thumbnailUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            
            {/* Professional overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20 transition-all duration-500 ${
                isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            />
            
            {/* Elegant play button */}
            <Button
              size="icon"
              variant="secondary"
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                rounded-full w-20 h-20 bg-white/95 hover:bg-white backdrop-blur-sm 
                shadow-2xl transition-all duration-300 hover:scale-110 border-0
                ${isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"}
              `}
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 text-gray-800" />
              ) : (
                <Play className="h-8 w-8 text-gray-800 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </InView>
  );
};
