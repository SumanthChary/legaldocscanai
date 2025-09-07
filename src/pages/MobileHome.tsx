import { useState } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scan, FileText, BarChart3, Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MobileHome() {
  const navigate = useNavigate();
  const [recentScans] = useState([
    { id: "1", name: "Contract_2024.pdf", date: "2 hours ago", status: "completed" },
    { id: "2", name: "Legal_Brief.docx", date: "1 day ago", status: "completed" },
    { id: "3", name: "Agreement.pdf", date: "3 days ago", status: "completed" },
  ]);

  const stats = [
    { label: "Total Scans", value: "24", icon: FileText, color: "text-blue-500" },
    { label: "This Month", value: "8", icon: TrendingUp, color: "text-green-500" },
    { label: "Avg. Time", value: "45s", icon: Clock, color: "text-orange-500" },
  ];

  return (
    <MobileLayout>
      <MobileHeader title="LegalDeep Scanner" />
      
      <div className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Welcome back!</h2>
          <p className="text-muted-foreground">Ready to analyze your legal documents?</p>
        </div>

        {/* Quick Scan Button */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Scan className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Quick Scan</h3>
              <p className="text-sm text-muted-foreground">
                Scan and analyze documents in seconds
              </p>
            </div>
            <Button 
              onClick={() => navigate("/scan")}
              className="w-full"
              size="lg"
            >
              Start Scanning
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Recent Scans */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Scans</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/history")}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-2">
            {recentScans.slice(0, 3).map((scan) => (
              <Card key={scan.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{scan.name}</div>
                      <div className="text-xs text-muted-foreground">{scan.date}</div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/document-summary/${scan.id}`)}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}