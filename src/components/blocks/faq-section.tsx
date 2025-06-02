
import { HelpCircle } from "lucide-react";
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
}

export const FAQSection = ({ faqs }: { faqs: FAQ[] }) => {
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-8 md:mb-12 text-center">
              Frequently Asked Questions
            </h2>
          </InView>
          
          <Accordion type="single" collapsible className="space-y-4 md:space-y-6">
            {faqs.map((faq, index) => (
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
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <AccordionTrigger className="px-4 md:px-6 py-4 md:py-5 hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <HelpCircle className="h-4 w-4 md:h-5 md:w-5 text-accent flex-shrink-0" />
                      <span className="text-base md:text-lg font-semibold">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 md:px-6 pb-4 md:pb-5 text-sm md:text-base text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </InView>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};
