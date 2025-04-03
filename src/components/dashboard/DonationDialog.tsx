
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Gift, Heart } from "lucide-react";

type DonationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DonationDialog = ({ open, onOpenChange }: DonationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Heart className="h-6 w-6 text-red-500 animate-pulse" />
            Support LegalBriefAI
          </DialogTitle>
          <Separator className="my-4" />
          <DialogDescription className="text-base space-y-4">
            <div className="flex items-start gap-3">
              <Gift className="h-5 w-5 text-primary mt-1" />
              <p>
                We need Donations for Multiple Improvements and if anyone does we will provide him Pro Plan Features for 1-2 months.
              </p>
            </div>
            <div className="bg-accent/10 p-4 rounded-lg mt-4">
              <p className="font-medium text-sm text-accent">
                Your support helps us continue improving our AI capabilities and adding new features!
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
          <Button
            variant="default"
            onClick={() => {
              window.open("https://www.figma.com/proto/eWAJORd1BV6OLT8V8a7CeE/LegalBriefAI?node-id=1-2&p=f&t=lxhZSOMTKwa7ZmrQ-1&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1", "_blank");
              onOpenChange(false);
            }}
            className="gap-2"
          >
            <Heart className="h-4 w-4" />
            Support Us
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
