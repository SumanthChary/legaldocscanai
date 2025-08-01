import { Star, Quote } from "lucide-react";

export const LegalTestimonials = () => {
  const testimonials = [
    {
      name: "Sarah Mitchell, Esq.",
      firm: "Mitchell & Associates",
      practice: "Corporate Law",
      avatar: "/lovable-uploads/d4f6190e-3f8c-497d-b549-b42ff6e42fc9.png",
      text: "DocBriefly AI reduced our contract review time from 3 hours to 15 minutes. The accuracy is remarkable and it catches issues we might have missed.",
      savings: "85% time reduction",
      rating: 5
    },
    {
      name: "Michael Rodriguez, Esq.",
      firm: "Rodriguez Legal Group",
      practice: "Litigation",
      avatar: "/lovable-uploads/35e692b0-631a-4e2b-aa40-cb49baefe0bc.png",
      text: "The AI's ability to analyze depositions and extract key facts has revolutionized our case preparation. Absolutely essential for modern legal practice.",
      savings: "$50K+ annual savings",
      rating: 5
    },
    {
      name: "Emily Chen, Esq.",
      firm: "Chen Family Law",
      practice: "Family Law",
      avatar: "/lovable-uploads/a579bbd7-742e-438a-9342-e6a274fad70e.png",
      text: "As a solo practitioner, DocBriefly AI levels the playing field. I can now handle complex document analysis with the efficiency of a large firm.",
      savings: "300% productivity increase",
      rating: 5
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-slate-50 to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Leading Law Firms</h2>
          <p className="text-lg text-gray-600">See how legal professionals are transforming their practice</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <Quote className="h-8 w-8 text-blue-600 mb-4" />
              
              <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.text}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.firm}</p>
                  <p className="text-xs text-blue-600">{testimonial.practice}</p>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <span className="text-sm font-semibold text-green-700">{testimonial.savings}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};