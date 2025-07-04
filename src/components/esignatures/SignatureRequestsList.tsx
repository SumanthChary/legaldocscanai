
import { FileText, Check, Pen, Loader2 } from "lucide-react";

type SignatureRequest = {
  id: string;
  document_name: string;
  document_path: string;
  status: string;
  created_at: string;
};

type SignatureRequestsListProps = {
  requests: SignatureRequest[];
  loading: boolean;
};

export function SignatureRequestsList({ requests, loading }: SignatureRequestsListProps) {
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
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
          {requests.map(r => (
            <div
              key={r.id}
              className={"bg-gradient-to-br from-purple-50 to-white border border-purple-100 p-5 rounded-xl flex flex-col gap-3 shadow hover:shadow-lg transition shadow-purple-100/30 " +
                (r.status === "completed" ? "ring-2 ring-green-200" : "")}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="text-purple-700 w-4 h-4" />
                <span className="font-semibold text-purple-900 truncate">{r.document_name}</span>
              </div>
              <div className="flex flex-row gap-4 items-end justify-between">
                <span className={`text-xs rounded-full px-3 py-1 font-bold capitalize transition 
                  ${r.status === "pending" ? "bg-purple-100 text-purple-800"
                    : r.status === "completed" ? "bg-green-100 text-green-800"
                    : r.status === "in_progress" ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-500"}`}>
                  {r.status}
                </span>
                {r.status === "completed" ? (
                  <span>
                    <Check className="w-5 h-5 text-green-500 animate-pulse" />
                  </span>
                ) : (
                  <span>
                    <Pen className="w-5 h-5 text-purple-400" />
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-3">
                Created: {new Date(r.created_at).toLocaleString()}
              </div>
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
