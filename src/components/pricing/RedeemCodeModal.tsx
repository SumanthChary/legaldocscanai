
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface RedeemCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RedeemCodeModal = ({ isOpen, onClose }: RedeemCodeModalProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Check if the user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to redeem a code",
          variant: "destructive"
        });
        navigate("/auth");
        onClose();
        return;
      }

      // 2. Verify the redemption code
      const { data: codeData, error: codeError } = await supabase
        .from('redemption_codes')
        .select('*')
        .eq('code', code)
        .eq('active', true)
        .single();

      if (codeError || !codeData) {
        throw new Error("Invalid redemption code");
      }

      // 3. Check if the user has already used this code
      const { data: existingRedemption, error: redemptionError } = await supabase
        .from('code_redemptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('code_id', codeData.id)
        .maybeSingle();

      if (existingRedemption) {
        throw new Error("You have already used this code");
      }

      // 4. Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + codeData.duration_days);

      // 5. Record the redemption
      const { error: insertError } = await supabase
        .from('code_redemptions')
        .insert({
          user_id: session.user.id,
          code_id: codeData.id,
          expires_at: expiresAt.toISOString()
        });

      if (insertError) {
        throw new Error("Failed to redeem code");
      }

      // 6. Update user's subscription if needed
      // For now, this is a simple notification
      toast({
        title: "Code redeemed successfully!",
        description: `You've activated ${codeData.duration_days} days of the ${codeData.plan_type} plan.`,
      });

      onClose();

    } catch (error: any) {
      toast({
        title: "Error redeeming code",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Redeem a Code</DialogTitle>
          <DialogDescription>
            Enter your promotional code to get access to premium features
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Promotion Code</Label>
            <Input 
              id="code" 
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter your code (e.g. LEGAL3X)"
              className="uppercase"
              autoComplete="off"
              disabled={isLoading}
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!code || isLoading}>
              {isLoading ? "Redeeming..." : "Redeem Code"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
