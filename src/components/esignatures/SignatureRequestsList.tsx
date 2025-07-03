
import { useState, useEffect } from "react";
import { FileText, Check, Pen, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SignatureRequestActions } from "./SignatureRequestActions";

type SignatureRequest = {
  id: string;
  document_name: string;
  document_path: string;
  status: string;
  created_at: string;
};

type SignatureField = {
  id: string;
  request_id: string;
  assigned_signer_email: string;
  field_type: string;
  required: boolean;
};

type SignatureRequestsListProps = {
  requests: SignatureRequest[];
  loading: boolean;
  onRefresh: () => void;
};

export function SignatureRequestsList({ requests, loading, onRefresh }: SignatureRequestsListProps) {
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [requestFields, setRequestFields] = useState<Record<string, SignatureField[]>>({});
  const [fieldsLoading, setFieldsLoading] = useState<Record<string, boolean>>({});

  const fetchRequestFields = async (requestId: string) => {
    if (requestFields[requestId]) return; // Already loaded

    setFieldsLoading(prev => ({ ...prev, [requestId]: true }));
    
    try {
      const { data, error } = await supabase
        .from("signature_fields")
        .select("*")
        .eq("request_id", requestId);

      if (error) throw error;

      setRequestFields(prev => ({ ...prev, [requestId]: data || [] }));
    } catch (error) {
      console.error("Error fetching signature fields:", error);
    } finally {
      setFieldsLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const toggleExpanded = (requestId: string) => {
    if (expandedRequest === requestId) {
      setExpandedRequest(null);
    } else {
      setExpandedRequest(requestId);
      fetchRequestFields(requestId);
    }
  };

  return (
    <section className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6 pl-1">
        <FileText className="text-blue-500 w-5 h-5" />
        <h3 className="text-lg md:text-xl font-semibold text-purple-800">
          My Signature Requests
        </h3>
      </div>
      
      {loading ? (
        <div className="py-8 text-center flex justify-center rounded">
          <Loader2 className="animate-spin text-purple-700" />
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request.id} className="space-y-4">
              <div
                className={`bg-gradient-to-br from-purple-50 to-white border border-purple-100 p-5 rounded-xl flex flex-col gap-3 shadow hover:shadow-lg transition shadow-purple-100/30 cursor-pointer ${
                  request.status === "completed" ? "ring-2 ring-green-200" : ""
                }`}
                onClick={() => toggleExpanded(request.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="text-purple-700 w-4 h-4" />
                  <span className="font-semibold text-purple-900 truncate">{request.document_name}</span>
                </div>
                <div className="flex flex-row gap-4 items-end justify-between">
                  <span className={`text-xs rounded-full px-3 py-1 font-bold capitalize transition 
                    ${request.status === "pending" ? "bg-purple-100 text-purple-800"
                      : request.status === "completed" ? "bg-green-100 text-green-800"
                      : request.status === "in_progress" ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-500"}`}>
                    {request.status}
                  </span>
                  <div className="flex items-center gap-2">
                    {requestFields[request.id] && (
                      <span className="text-xs text-gray-500">
                        {requestFields[request.id].length} signer{requestFields[request.id].length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {request.status === "completed" ? (
                      <Check className="w-5 h-5 text-green-500 animate-pulse" />
                    ) : (
                      <Pen className="w-5 h-5 text-purple-400" />
                    )}
                    <Button size="sm" variant="ghost" className="text-xs">
                      {expandedRequest === request.id ? "Hide Details" : "Show Details"}
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-3">
                  Created: {new Date(request.created_at).toLocaleString()}
                </div>
              </div>

              {expandedRequest === request.id && (
                <div className="ml-4">
                  {fieldsLoading[request.id] ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin text-purple-700" />
                    </div>
                  ) : (
                    <SignatureRequestActions
                      request={request}
                      fields={requestFields[request.id] || []}
                      onUpdate={() => {
                        fetchRequestFields(request.id);
                        onRefresh();
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
          
          {requests.length === 0 && (
            <div className="col-span-full text-purple-400 text-center py-14 font-semibold text-lg rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow">
              No requests yet.<br />
              <span className="text-base font-normal block mt-2 text-purple-300">Create your first e-signature request above!</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
