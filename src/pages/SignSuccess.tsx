
import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SignSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="p-8 max-w-md text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-green-800">
          Document Signed Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Your signature has been recorded and the document is now complete.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="w-full"
        >
          Done
        </Button>
      </Card>
    </div>
  );
}
