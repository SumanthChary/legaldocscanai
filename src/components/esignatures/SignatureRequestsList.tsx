
import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw } from "lucide-react";
import { SignatureRequestActions } from "./SignatureRequestActions";
import { PDFViewer } from "./PDFViewer";
import { Skeleton } from "@/components/ui/skeleton";

type SignatureRequest = {
  id: string;
  document_name: string;
  document_path: string;
  status: string;
  created_at: string;
};

type Props = {
  requests: SignatureRequest[];
  loading: boolean;
  onRefresh: () => void;
};

const RequestSkeleton = () => (
  <Card className="p-6">
    <div className="flex items-start space-x-4">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  </Card>
);

export const SignatureRequestsList = memo(({ requests, loading, onRefresh }: Props) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
      in_progress: { bg: "bg-blue-100", text: "text-blue-800", label: "In Progress" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { bg: "bg-gray-100", text: "text-gray-800", label: status };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border`}>
        {config.label}
      </span>
    );
  };

  return (
    <section className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900 font-aeonik">Signature Requests</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 transition-all hover:scale-105"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <RequestSkeleton key={i} />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-purple-800 mb-2 font-aeonik">No signature requests</h3>
          <p className="text-purple-600">Create your first signature request above</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <Card key={request.id} className="p-6 hover:shadow-xl transition-all duration-300 border border-purple-100 bg-white/80 backdrop-blur-sm animate-fade-in">
              <div className="flex items-start space-x-4 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-purple-900 truncate mb-1 font-aeonik">
                    {request.document_name}
                  </h3>
                  <p className="text-sm text-purple-600 mb-2">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                  {getStatusBadge(request.status)}
                </div>
              </div>
              
              <div className="space-y-4">
                <PDFViewer 
                  documentPath={request.document_path} 
                  documentName={request.document_name} 
                />
                <SignatureRequestActions 
                  request={request}
                  fields={[]}
                  onUpdate={onRefresh} 
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
});

SignatureRequestsList.displayName = "SignatureRequestsList";
