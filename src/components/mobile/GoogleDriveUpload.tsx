import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderOpen, FileText, Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  modifiedTime: string;
}

interface GoogleDriveUploadProps {
  onFileSelect: (file: File) => void;
}

export const GoogleDriveUpload = ({ onFileSelect }: GoogleDriveUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const connectToGoogleDrive = async () => {
    setIsLoading(true);
    
    try {
      // Initialize Google Drive API (this is a simplified demo)
      // In production, you'd implement proper Google OAuth and Drive API
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock files from Google Drive
      const mockFiles: GoogleDriveFile[] = [
        {
          id: "1",
          name: "Contract_Agreement.pdf",
          mimeType: "application/pdf",
          size: "2.4 MB",
          modifiedTime: "2024-01-15T10:30:00Z",
        },
        {
          id: "2", 
          name: "Legal_Document.docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: "1.8 MB",
          modifiedTime: "2024-01-14T15:45:00Z",
        },
        {
          id: "3",
          name: "Terms_of_Service.pdf", 
          mimeType: "application/pdf",
          size: "956 KB",
          modifiedTime: "2024-01-13T09:20:00Z",
        },
      ];
      
      setFiles(mockFiles);
      setIsConnected(true);
      toast.success("Connected to Google Drive successfully");
    } catch (error) {
      toast.error("Failed to connect to Google Drive");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAndSelectFile = async (driveFile: GoogleDriveFile) => {
    setIsLoading(true);
    
    try {
      // In production, you'd download the actual file from Google Drive
      // This is a mock implementation
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock file object
      const mockFileContent = new Blob(['Mock file content'], { type: driveFile.mimeType });
      const file = new File([mockFileContent], driveFile.name, { type: driveFile.mimeType });
      
      onFileSelect(file);
      toast.success(`Downloaded ${driveFile.name} from Google Drive`);
    } catch (error) {
      toast.error("Failed to download file from Google Drive");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('document')) return '📝';
    if (mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('presentation')) return '📋';
    return '📎';
  };

  if (!isConnected) {
    return (
      <Card className="p-6 border-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Google Drive</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Import documents directly from your Google Drive
            </p>
          </div>
          <Button
            onClick={connectToGoogleDrive}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </div>
            ) : (
              <>
                <FolderOpen className="w-4 h-4 mr-2" />
                Connect to Google Drive
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30">
      <div className="p-4 border-b border-blue-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Google Drive</h3>
              <div className="flex items-center gap-1.5 text-xs text-blue-600">
                <CheckCircle2 className="w-3 h-3" />
                Connected
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsConnected(false)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100/50"
          >
            Disconnect
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
        {files.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No compatible files found</p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-blue-200/30 hover:bg-white/70 transition-colors cursor-pointer"
              onClick={() => downloadAndSelectFile(file)}
            >
              <div className="text-2xl">{getFileIcon(file.mimeType)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{file.name}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>{file.size}</span>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <span>{formatDate(file.modifiedTime)}</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 h-8 w-8 p-0"
                disabled={isLoading}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};