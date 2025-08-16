import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  PenTool, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Eye,
  Download,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  User,
  Calendar,
  MapPin,
  BarChart3
} from "lucide-react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data for demonstration
const mockSignatureRequests = [
  {
    id: 1,
    documentName: "Service Agreement - TechCorp",
    status: "completed",
    progress: 100,
    totalSigners: 3,
    completedSigners: 3,
    createdAt: "2024-01-15",
    dueDate: "2024-01-22",
    signers: [
      { name: "John Smith", email: "john@techcorp.com", status: "signed", signedAt: "2024-01-16" },
      { name: "Sarah Johnson", email: "sarah@legal.com", status: "signed", signedAt: "2024-01-17" },
      { name: "Mike Davis", email: "mike@techcorp.com", status: "signed", signedAt: "2024-01-18" }
    ]
  },
  {
    id: 2,
    documentName: "NDA - Consulting Project",
    status: "pending",
    progress: 66,
    totalSigners: 3,
    completedSigners: 2,
    createdAt: "2024-01-20",
    dueDate: "2024-01-27",
    signers: [
      { name: "Alice Brown", email: "alice@consultant.com", status: "signed", signedAt: "2024-01-21" },
      { name: "Bob Wilson", email: "bob@company.com", status: "signed", signedAt: "2024-01-22" },
      { name: "Carol Lee", email: "carol@company.com", status: "pending", signedAt: null }
    ]
  },
  {
    id: 3,
    documentName: "Employment Contract - Jane Doe",
    status: "pending",
    progress: 33,
    totalSigners: 3,
    completedSigners: 1,
    createdAt: "2024-01-22",
    dueDate: "2024-01-29",
    signers: [
      { name: "Jane Doe", email: "jane@email.com", status: "signed", signedAt: "2024-01-23" },
      { name: "HR Manager", email: "hr@company.com", status: "pending", signedAt: null },
      { name: "Legal Counsel", email: "legal@company.com", status: "pending", signedAt: null }
    ]
  }
];

const mockTemplates = [
  { id: 1, name: "Service Agreement", category: "Business", usageCount: 15 },
  { id: 2, name: "Employment Contract", category: "HR", usageCount: 8 },
  { id: 3, name: "Non-Disclosure Agreement", category: "Legal", usageCount: 23 },
  { id: 4, name: "Consulting Agreement", category: "Business", usageCount: 12 }
];

type EnhancedESignaturesProps = {
  user?: any;
  profile?: any;
};

export const EnhancedESignatures = ({ user, profile }: EnhancedESignaturesProps) => {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "expired": return "bg-red-100 text-red-800 border-red-200";
      case "draft": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "expired": return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredRequests = mockSignatureRequests.filter(request => {
    const matchesSearch = request.documentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <SidebarLayout user={user} profile={profile}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  E-Signature Center
                </h1>
                <p className="text-muted-foreground">
                  Manage document signing workflows and track signature progress
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Button variant="outline" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Templates</span>
                </Button>
                <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4" />
                  <span>New Request</span>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Completion</p>
                    <p className="text-2xl font-bold">2.3d</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 lg:grid-cols-4 bg-muted/50 p-1 h-12">
                  <TabsTrigger value="requests" className="data-[state=active]:bg-white">
                    Signature Requests
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="data-[state=active]:bg-white">
                    Templates
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-white">
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-white hidden lg:block">
                    Settings
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="requests" className="space-y-6">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        placeholder="Search signature requests..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center space-x-2">
                          <Filter className="h-4 w-4" />
                          <span>Filter: {filterStatus === "all" ? "All" : filterStatus}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                          All Requests
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                          Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus("expired")}>
                          Expired
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Signature Requests List */}
                  <div className="space-y-4">
                    {filteredRequests.map((request) => (
                      <Card key={request.id} className="p-6 border border-border/50 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold">{request.documentName}</h3>
                              <Badge className={`${getStatusColor(request.status)} border`}>
                                {getStatusIcon(request.status)}
                                <span className="ml-1 capitalize">{request.status}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{request.completedSigners}/{request.totalSigners} signed</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Due: {request.dueDate}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progress</span>
                                <span>{request.progress}%</span>
                              </div>
                              <Progress value={request.progress} className="h-2" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Send className="h-4 w-4 mr-1" />
                              Remind
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Send className="h-4 w-4 mr-2" />
                                  Resend
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  Cancel Request
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        {/* Signers List */}
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <h4 className="text-sm font-medium mb-3">Signers</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {request.signers.map((signer, index) => (
                              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{signer.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{signer.email}</p>
                                  {signer.signedAt && (
                                    <p className="text-xs text-green-600">Signed {signer.signedAt}</p>
                                  )}
                                </div>
                                <Badge className={`${getStatusColor(signer.status)} border text-xs`}>
                                  {signer.status === "signed" ? "✓" : "○"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="templates" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockTemplates.map((template) => (
                      <Card key={template.id} className="p-6 border border-border/50 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <Badge variant="secondary">{template.category}</Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Used {template.usageCount} times
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">Use Template</Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <div className="text-center py-12">
                    <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">E-Signature Analytics</h3>
                    <p className="text-muted-foreground">
                      Advanced analytics and reporting coming soon
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <div className="text-center py-12">
                    <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4">
                      <PenTool className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">E-Signature Settings</h3>
                    <p className="text-muted-foreground">
                      Configure your e-signature preferences and workflows
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};