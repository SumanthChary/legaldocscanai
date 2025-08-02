import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ProfessionalFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-neutral-800 text-neutral-300">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          {/* Logo and Tagline */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Legal Deep AI</h3>
            <p className="text-neutral-400 italic">Making legal work more efficient through AI</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <Button
              variant="link"
              className="text-neutral-300 hover:text-white p-0 h-auto"
              onClick={() => navigate("/privacy")}
            >
              Privacy Policy
            </Button>
            <Button
              variant="link"
              className="text-neutral-300 hover:text-white p-0 h-auto"
              onClick={() => navigate("/terms")}
            >
              Terms of Service
            </Button>
            <Button
              variant="link"
              className="text-neutral-300 hover:text-white p-0 h-auto"
              onClick={() => navigate("/contact")}
            >
              Contact
            </Button>
            <Button
              variant="link"
              className="text-neutral-300 hover:text-white p-0 h-auto"
              onClick={() => navigate("/support")}
            >
              Support
            </Button>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-neutral-700">
            <p className="text-neutral-500 text-sm">
              © 2025 Legal Deep AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};