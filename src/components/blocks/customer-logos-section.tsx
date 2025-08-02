import { InView } from "@/components/ui/in-view";

export const CustomerLogosSection = () => {
  const logoData = [
    { name: "Wilson Sonsini", logo: "WS" },
    { name: "Morrison Foerster", logo: "MF" },
    { name: "Latham & Watkins", logo: "L&W" },
    { name: "Baker McKenzie", logo: "BM" },
    { name: "Skadden Arps", logo: "SA" },
    { name: "Jones Day", logo: "JD" }
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center mb-12">
            <p className="text-text-secondary text-sm uppercase tracking-wide font-medium mb-8">
              Trusted by leading law firms
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {logoData.map((firm, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-center h-16 px-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                >
                  <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center border">
                    <span className="text-text-primary font-bold text-sm">{firm.logo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Testimonial */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-neutral-50 border-l-4 border-legal-gold rounded-lg p-8 md:p-12">
              <blockquote className="text-xl md:text-2xl text-text-primary font-medium leading-relaxed mb-6">
                "Legal Deep AI cut my contract review time by 80%. It's a complete game-changer for our practice."
              </blockquote>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-legal-gold rounded-full flex items-center justify-center">
                  <span className="text-legal-navy font-bold text-lg">SC</span>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Sarah Chen</p>
                  <p className="text-text-secondary">Corporate Attorney, Morrison & Foerster</p>
                </div>
              </div>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
};