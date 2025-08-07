import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  PenTool, 
  Send, 
  CheckCircle,
  Clock,
  Mail
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ESignatureWorkflowProps {
  documentId?: string;
  documentName?: string;
}

export const ESignatureWorkflow = ({ documentId, documentName }: ESignatureWorkflowProps) => {
  const [step, setStep] = useState(1);
  const [signers, setSigners] = useState([{ email: '', name: '', role: 'Signer' }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const addSigner = () => {
    setSigners([...signers, { email: '', name: '', role: 'Signer' }]);
  };

  const removeSigner = (index: number) => {
    setSigners(signers.filter((_, i) => i !== index));
  };

  const updateSigner = (index: number, field: string, value: string) => {
    const updated = signers.map((signer, i) => 
      i === index ? { ...signer, [field]: value } : signer
    );
    setSigners(updated);
  };

  const handleSendForSignature = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Document sent for signature!",
        description: `Sent to ${signers.length} recipient(s). They will receive an email with signing instructions.`,
      });
      
      setStep(4);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sending document",
        description: "Please try again later.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: "Upload Document", icon: FileText },
    { number: 2, title: "Add Signers", icon: Users },
    { number: 3, title: "Place Signatures", icon: PenTool },
    { number: 4, title: "Send & Track", icon: Send }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle>E-Signature Workflow</CardTitle>
          <CardDescription>
            Send documents for electronic signature in 4 simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= stepItem.number 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-300'
                }`}>
                  {step > stepItem.number ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <stepItem.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-1 mx-4 ${
                    step > stepItem.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(step / steps.length) * 100} className="mb-4" />
          <p className="text-sm text-gray-600 text-center">
            Step {step} of {steps.length}: {steps[step - 1]?.title}
          </p>
        </CardContent>
      </Card>

      {/* Step Content */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Ready
            </CardTitle>
            <CardDescription>
              Your document is ready for signature workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-800">
                    {documentName || "Legal_Contract.pdf"}
                  </div>
                  <div className="text-sm text-green-600">
                    Document uploaded and ready for signatures
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={() => setStep(2)} className="w-full">
              Continue to Add Signers
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Add Signers
            </CardTitle>
            <CardDescription>
              Add people who need to sign this document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {signers.map((signer, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Signer {index + 1}</Label>
                  {signers.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeSigner(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor={`name-${index}`}>Name</Label>
                    <Input
                      id={`name-${index}`}
                      placeholder="Full name"
                      value={signer.name}
                      onChange={(e) => updateSigner(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`email-${index}`}>Email</Label>
                    <Input
                      id={`email-${index}`}
                      type="email"
                      placeholder="email@example.com"
                      value={signer.email}
                      onChange={(e) => updateSigner(index, 'email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`role-${index}`}>Role</Label>
                    <Input
                      id={`role-${index}`}
                      placeholder="e.g., Client, Attorney"
                      value={signer.role}
                      onChange={(e) => updateSigner(index, 'role', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" onClick={addSigner} className="w-full">
              + Add Another Signer
            </Button>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                className="flex-1"
                disabled={signers.some(s => !s.name || !s.email)}
              >
                Continue to Signature Placement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              Signature Placement
            </CardTitle>
            <CardDescription>
              Position signature fields for each signer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Document Preview
              </h3>
              <p className="text-gray-600 mb-4">
                Click and drag to place signature fields for each signer
              </p>
              <div className="space-y-2">
                {signers.map((signer, index) => (
                  <div key={index} className="flex items-center justify-center gap-2">
                    <Badge variant="outline">
                      {signer.name} - {signer.role}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Place Signature Field
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => setStep(4)} className="flex-1">
                Continue to Send
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send for Signature
            </CardTitle>
            <CardDescription>
              Review and send the document to all signers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Document Summary</h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm">
                  <div><strong>Document:</strong> {documentName || "Legal_Contract.pdf"}</div>
                  <div><strong>Signers:</strong> {signers.length}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Signers</h4>
              {signers.map((signer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{signer.name}</div>
                    <div className="text-sm text-gray-600">{signer.email}</div>
                  </div>
                  <Badge variant="outline">{signer.role}</Badge>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button 
                onClick={handleSendForSignature} 
                className="flex-1"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send for Signature
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step > 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Document Sent Successfully!
            </CardTitle>
            <CardDescription>
              All signers have been notified and can now sign the document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-800">
                <div className="font-medium mb-2">Next Steps:</div>
                <ul className="text-sm space-y-1">
                  <li>• Signers will receive email notifications</li>
                  <li>• You'll get updates as each person signs</li>
                  <li>• Final document will be available once all signatures are complete</li>
                </ul>
              </div>
            </div>
            
            <Button onClick={() => setStep(1)} variant="outline" className="w-full">
              Start New Signature Request
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};