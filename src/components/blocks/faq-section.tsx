
import { HelpCircle, Shield, Clock, FileText, Users } from "lucide-react";
import { InView } from "@/components/ui/in-view";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
  icon?: any;
}

export const FAQSection = ({ faqs }: { faqs: FAQ[] }) => {
  const faqsWithIcons = faqs.map((faq, index) => {
    const icons = [Shield, Clock, FileText, Users, HelpCircle];
    return {
      ...faq,
      icon: icons[index % icons.length]
    };
  });

  return (
    <div className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get answers to common questions about LegalBriefAI and how it can transform your legal workflow.
              </p>
            </div>
          </InView>
          
          <Accordion type="single" collapsible className="space-y-4 md:space-y-6">
            {faqsWithIcons.map((faq, index) => (
              <InView
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AccordionItem 
                  value={`item-${index}`} 
                  className="bg-gradient-to-r from-white to-blue-50/30 border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <faq.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-base md:text-lg font-semibold text-gray-900">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-sm md:text-base text-gray-600 leading-relaxed">
                    <div className="pl-14">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </InView>
            ))}
          </Accordion>

          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Still have questions?</h3>
              <p className="text-gray-600 mb-4">
                Our support team is here to help you get the most out of LegalBriefAI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@legalbriefai.com" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Contact Support
                </a>
                <a 
                  href="/documentation" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  View Documentation
                </a>
              </div>
            </div>
          </InView>
        </div>
      </div>
    </div>
  );
};
