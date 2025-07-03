
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Pen, Check, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type SigningInterfaceProps = {
  signerEmail: string;
  onSignatureComplete: (signatureData: string) => void;
  disabled?: boolean;
};

export function SigningInterface({ signerEmail, onSignatureComplete, disabled }: SigningInterfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [signatureType, setSignatureType] = useState<"draw" | "type">("draw");
  const { toast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas background to white
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setTypedName("");
  };

  const generateTypedSignature = () => {
    if (!typedName.trim()) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw typed signature
    ctx.fillStyle = "#000";
    ctx.font = "32px cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);
    
    setHasSignature(true);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) {
      toast({ title: "Please create a signature first", variant: "destructive" });
      return;
    }

    const signatureData = canvas.toDataURL("image/png");
    onSignatureComplete(signatureData);
    toast({ title: "Signature saved successfully!" });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Digital Signature</h3>
          <div className="text-sm text-gray-600">Signing as: {signerEmail}</div>
        </div>

        <div className="flex gap-4 mb-4">
          <Button
            variant={signatureType === "draw" ? "default" : "outline"}
            size="sm"
            onClick={() => setSignatureType("draw")}
            disabled={disabled}
          >
            <Pen className="w-4 h-4 mr-2" />
            Draw
          </Button>
          <Button
            variant={signatureType === "type" ? "default" : "outline"}
            size="sm"
            onClick={() => setSignatureType("type")}
            disabled={disabled}
          >
            Type Name
          </Button>
        </div>

        {signatureType === "draw" ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full border border-gray-300 rounded bg-white cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{ touchAction: "none" }}
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Draw your signature above
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              placeholder="Type your full name"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              disabled={disabled}
              className="text-lg"
            />
            <Button
              onClick={generateTypedSignature}
              disabled={!typedName.trim() || disabled}
              variant="outline"
              size="sm"
            >
              Generate Signature
            </Button>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[150px] flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full border border-gray-300 rounded bg-white"
              />
            </div>
          </div>
        )}

        <Separator />

        <div className="flex gap-2">
          <Button
            onClick={clearSignature}
            variant="outline"
            size="sm"
            disabled={disabled}
          >
            Clear
          </Button>
          <Button
            onClick={saveSignature}
            disabled={!hasSignature || disabled}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Signature
          </Button>
        </div>
      </div>
    </Card>
  );
}
