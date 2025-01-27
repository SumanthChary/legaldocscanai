import { Card } from "@/components/ui/card";
import { FileText, AlertTriangle, Search, Clock } from "lucide-react";

export const Dashboard = () => {
  const stats = [
    {
      title: "Documents Analyzed",
      value: "128",
      icon: FileText,
      color: "text-accent",
    },
    {
      title: "Risks Identified",
      value: "24",
      icon: AlertTriangle,
      color: "text-warning",
    },
    {
      title: "Searches Performed",
      value: "356",
      icon: Search,
      color: "text-success",
    },
    {
      title: "Time Saved",
      value: "180h",
      icon: Clock,
      color: "text-primary",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Welcome to LegalAI</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <FileText className="h-6 w-6 text-accent" />
                <div>
                  <h3 className="font-medium">Document {index + 1}</h3>
                  <p className="text-sm text-gray-600">Last modified 2h ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Risk Analysis</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-warning" />
                <div>
                  <h3 className="font-medium">Risk Alert {index + 1}</h3>
                  <p className="text-sm text-gray-600">High priority review needed</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};