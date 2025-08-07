import { useState } from "react";
import { PageLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Phone, Clock, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const faqs = [
    {
      question: "What is LegalDeep AI?",
      answer: "LegalDeep AI is an advanced AI-powered platform designed to help legal professionals analyze, summarize, and extract key information from legal documents efficiently. Our tool uses cutting-edge technology to save time and improve accuracy in legal document processing."
    },
    {
      question: "How secure is my data on LegalDeep AI?",
      answer: "We prioritize your data security with end-to-end encryption and compliance with major privacy regulations including GDPR, HIPAA, and SOC 2. All documents are stored securely with bank-grade encryption, and we maintain strict access controls to ensure your sensitive legal information remains confidential."
    },
    {
      question: "What types of documents can LegalDeep AI process?",
      answer: "LegalDeep AI can process a wide range of legal documents including contracts, agreements, legal briefs, court documents, regulatory filings, and complex PDFs with images and charts. Our advanced AI can handle multiple formats and extract insights from both text and visual content."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a free tier that allows you to analyze up to 3 documents to experience our platform's capabilities. You can upgrade to our professional or enterprise plans for additional features and higher document limits."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI system maintains a high accuracy rate in document analysis and summary generation, powered by advanced models including Llama 4 and specialized legal training. However, we recommend using it as a supportive tool alongside professional legal judgment, not as a replacement for legal expertise."
    },
    {
      question: "Can I integrate LegalDeep AI with my existing workflow?",
      answer: "Absolutely! LegalDeep AI is designed to seamlessly integrate with your existing legal workflow. Our platform offers API access, bulk processing capabilities, and can be customized to fit your firm's specific needs and requirements."
    },
    {
      question: "How much money can I save with LegalDeep AI?",
      answer: "On average, our users save 2.3 hours per contract review, which equals approximately $920 in billable time recovery at standard attorney rates. With our 40% discount, you can save even more while increasing your efficiency."
    },
    {
      question: "What's the difference between plans?",
      answer: "Our Starter Plan ($19.90/month) includes 25 documents and basic features. Professional Plan ($99/month) offers 500 documents, advanced analytics, and team features. Enterprise includes unlimited documents and custom solutions."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Support Center
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Get help with LegalDeep AI and find answers to common questions
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Cards */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Email Support
                  </CardTitle>
                  <CardDescription>
                    Get detailed help via email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    support@legaldeep.ai
                  </p>
                  <Button className="w-full" onClick={() => window.open('mailto:support@legaldeep.ai')}>
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    Live Chat
                  </CardTitle>
                  <CardDescription>
                    Chat with our support team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Clock className="h-4 w-4" />
                    9 AM - 6 PM EST
                  </div>
                  <Button className="w-full" variant="outline">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-purple-600" />
                    Phone Support
                  </CardTitle>
                  <CardDescription>
                    Call us for urgent issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    Professional & Enterprise only
                  </p>
                  <p className="text-sm font-medium mb-4">
                    +1 (555) 123-4567
                  </p>
                  <Button className="w-full" variant="outline">
                    Request Callback
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Find quick answers to common questions
                  </CardDescription>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search FAQs..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  {filteredFaqs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No FAQs found matching your search.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Still need help?</CardTitle>
                  <CardDescription>
                    Send us a message and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Your Name" required />
                      <Input type="email" placeholder="Email Address" required />
                    </div>
                    <Input placeholder="Subject" required />
                    <Textarea
                      placeholder="Describe your issue or question..."
                      rows={5}
                      required
                    />
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Support;