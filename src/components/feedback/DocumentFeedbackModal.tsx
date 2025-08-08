import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface DocumentFeedbackModalProps {
  open: boolean;
  onClose: () => void;
  analysisId: string;
}

export const DocumentFeedbackModal = ({ open, onClose, analysisId }: DocumentFeedbackModalProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitFeedback = async () => {
    if (!rating) {
      toast({ title: "Please rate", description: "Select a rating to submit." });
      return;
    }
    setLoading(true);
    try {
      // Save locally for now (no backend table yet)
      const payload = {
        analysisId,
        rating,
        feedback,
        createdAt: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem("doc_feedback") || "[]");
      existing.push(payload);
      localStorage.setItem("doc_feedback", JSON.stringify(existing));
      toast({ title: "Thanks!", description: "Your feedback helps us improve." });
      onClose();
    } catch (e: any) {
      console.error(e);
      toast({ title: "Saved locally", description: "We couldn't reach the server. We'll try again later." });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate this summary</DialogTitle>
          <DialogDescription>Your feedback keeps improving results.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map((n) => (
              <button key={n} onClick={() => setRating(n)} aria-label={`${n} star`} className={`text-2xl ${rating && n <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</button>
            ))}
          </div>
          <Textarea placeholder="What worked well? What can be better?" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Later</Button>
          <Button onClick={submitFeedback} disabled={loading}>{loading ? 'Submitting…' : 'Submit'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
