export const LawFirmLogos = () => {
  const firms = [
    "Wilson Sonsini",
    "Latham & Watkins", 
    "Skadden Arps",
    "Sullivan & Cromwell",
    "Cravath Swaine",
    "Davis Polk"
  ];

  return (
    <div className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-sm md:text-base text-navy-600 font-medium">
            Trusted by leading law firms worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {firms.map((firm, index) => (
            <div 
              key={index}
              className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <div className="bg-navy-100 px-4 py-2 rounded-lg">
                <span className="text-xs md:text-sm font-semibold text-navy-700">
                  {firm}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Featured Testimonial */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-navy-50 rounded-2xl p-6 md:p-8 border-l-4 border-gold-500">
            <blockquote className="text-lg md:text-xl text-navy-800 mb-4 leading-relaxed">
              "LegalDeep AI cut our contract review time by 75%. What used to take our associates 3-4 hours now takes 45 minutes. The AI identifies risks we might miss and provides relevant case citations instantly."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-navy-200 rounded-full flex items-center justify-center">
                <span className="text-navy-700 font-semibold">SC</span>
              </div>
              <div>
                <div className="font-semibold text-navy-900">Sarah Chen</div>
                <div className="text-sm text-navy-600">Partner, Corporate Law</div>
                <div className="text-sm text-navy-500">Morrison & Foerster LLP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};