
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Send, Twitter, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call the subscribe-email edge function
      const { data, error } = await supabase.functions.invoke('subscribe-email', {
        body: { email }
      });

      if (error) throw error;

      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToFAQs = () => {
    const faqSection = document.querySelector('#faqs');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#faqs');
    }
  };

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Stay Connected</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Get updates on new features and releases
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
                disabled={isLoading}
                type="submit"
              >
                <Send className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
              </Button>
            </form>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <a href="/" className="block text-muted-foreground hover:text-primary">
                Home
              </a>
              <a href="/features" className="block text-muted-foreground hover:text-primary">
                Features
              </a>
              <a href="/pricing" className="block text-muted-foreground hover:text-primary">
                Pricing
              </a>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 h-auto font-normal text-sm text-muted-foreground hover:text-primary"
                onClick={scrollToFAQs}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQs
              </Button>
            </nav>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>sumanthchary.business@gmail.com</p>
              <p>+91 8125228079</p>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://x.com/SumanthChary07" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://www.instagram.com/sumanth_chary07" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://www.linkedin.com/in/sumanthchary" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 LegalAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
