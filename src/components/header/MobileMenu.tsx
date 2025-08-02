
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Book, LogOut, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

type MobileMenuProps = {
  session: any;
  profile: any | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleSignOut: () => Promise<void>;
};

export const MobileMenu = ({
  session,
  profile,
  isOpen,
  setIsOpen,
  handleSignOut,
}: MobileMenuProps) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[80%] sm:w-[385px]">
          <nav className="flex flex-col gap-4 mt-8">
            <Button
              variant="ghost"
              onClick={() => {
                navigate("/features");
                setIsOpen(false);
              }}
              className="justify-start"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                navigate("/pricing");
                setIsOpen(false);
              }}
              className="justify-start"
            >
              Pricing
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                navigate("/security");
                setIsOpen(false);
              }}
              className="justify-start"
            >
              Security
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                navigate("/contact");
                setIsOpen(false);
              }}
              className="justify-start"
            >
              Contact
            </Button>
            {session ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate("/dashboard");
                    setIsOpen(false);
                  }}
                  className="justify-start"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  className="justify-start"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="justify-start text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                onClick={() => {
                  navigate("/auth");
                  setIsOpen(false);
                }}
                className="w-full"
              >
                Sign In
              </Button>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};
