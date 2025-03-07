
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DocumentUsageProps {
  userProfile: any;
}

export const DocumentUsage = ({ userProfile }: DocumentUsageProps) => {
  if (!userProfile) return null;
  
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Document Usage</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Documents Used</span>
          <span className="font-medium">{userProfile.document_count} / {userProfile.document_limit}</span>
        </div>
        <Progress 
          value={(userProfile.document_count / userProfile.document_limit) * 100} 
          className="h-2"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {userProfile.document_count >= userProfile.document_limit 
            ? "You've reached your document limit. Consider upgrading your plan for more." 
            : `You can analyze ${userProfile.document_limit - userProfile.document_count} more document${userProfile.document_limit - userProfile.document_count !== 1 ? 's' : ''}.`
          }
        </p>
      </div>
    </Card>
  );
};
