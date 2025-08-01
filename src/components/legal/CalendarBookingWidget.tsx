import { Calendar, Clock, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CalendarBookingWidget = () => {
  const handleBookDemo = () => {
    // In a real implementation, this would open a calendar widget like Calendly
    window.open("https://calendly.com/docbriefly-ai/legal-demo", "_blank");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Video className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Book Your Legal Demo</h3>
          <p className="text-sm text-gray-600">See DocBriefly AI in action with legal documents</p>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>30-minute personalized demo</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Available slots today and tomorrow</span>
        </div>
      </div>
      
      <Button 
        onClick={handleBookDemo}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        Schedule Demo Now
      </Button>
    </div>
  );
};