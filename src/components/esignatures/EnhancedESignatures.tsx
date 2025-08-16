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
  BarChart3,
  Upload,
  FileSignature
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UploadForm } from "./UploadForm";
import { SignatureRequestsList } from "./SignatureRequestsList";

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
    documentName: "NDA - Startup Venture",
    status: "pending",
    progress: 67,
    totalSigners: 3,
    completedSigners: 2,
    createdAt: "2024-01-20",
    dueDate: "2024-01-27",
    signers: [
      { name: "Alice Cooper", email: "alice@startup.com", status: "signed", signedAt: "2024-01-21" },
      { name: "Bob Wilson", email: "bob@venture.com", status: "signed", signedAt: "2024-01-22" },
      { name: "Carol Martinez", email: "carol@legal.co", status: "pending", signedAt: null }
    ]
  },
  {
    id: 3,
    documentName: "Employment Contract - New Hire",
    status: "draft",
    progress: 0,
    totalSigners: 2,
    completedSigners: 0,
    createdAt: "2024-01-25",
    dueDate: "2024-02-01",
    signers: [
      { name: "David Kim", email: "david@company.com", status: "pending", signedAt: null },
      { name: "Emma Thompson", email: "emma@hr.com", status: "pending", signedAt: null }
    ]
  }
];

export const EnhancedESignatures = () => {
  const [activeView, setActiveView] = useState("upload");
  const [signatureRequests, setSignatureRequests] = useState(mockSignatureRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    toast({
      title: "Document uploaded",
      description: `${file.name} has been prepared for signature collection`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'expired': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredRequests = signatureRequests.filter(request => {
    const matchesSearch = request.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.signers.some(signer => 
                           signer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           signer.email.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesFilter = filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/20 dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              E-Signature Studio
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mt-2">
              Professional digital signature management platform
            </p>
          </div>

          <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4 md:space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="upload" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <Upload className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Upload</span>
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <FileSignature className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Requests</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <FileText className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Templates</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 md:space-y-6">
              <div className="text-center py-8 md:py-12">
                <Upload className="h-12 w-12 md:h-16 md:w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">Upload Document</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 px-4">
                  Upload documents for signature collection and management
                </p>
                <Button onClick={() => handleFileSelect(new File([], "demo.pdf"))}>
                  <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="text-xs md:text-sm">Choose Document</span>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="requests" className="space-y-4 md:space-y-6">
              <div className="text-center py-8 md:py-12">
                <FileSignature className="h-12 w-12 md:h-16 md:w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">Signature Requests</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 px-4">
                  Manage and track your signature request workflows
                </p>
                <Button variant="outline">
                  <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="text-xs md:text-sm">View All Requests</span>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4 md:space-y-6">
              <div className="text-center py-8 md:py-12">
                <FileText className="h-12 w-12 md:h-16 md:w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">Document Templates</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 px-4">
                  Create and manage reusable document templates for faster workflows
                </p>
                <Button size="sm">
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="text-xs md:text-sm">Create Template</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};