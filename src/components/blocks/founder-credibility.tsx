import { Linkedin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FounderCredibility = () => {
  const team = [
    {
      name: "Dr. Michael Rodriguez",
      role: "Founder & CEO",
      background: "Former BigLaw Partner",
      description: "15 years at Skadden Arps, specialized in M&A and securities law. JD Harvard Law, PhD Computer Science MIT.",
      linkedin: "#"
    },
    {
      name: "Sarah Kim",
      role: "Chief Legal Officer", 
      background: "Ex-Google Legal Counsel",
      description: "Led legal tech initiatives at Google for 8 years. Expert in AI ethics and legal compliance.",
      linkedin: "#"
    },
    {
      name: "David Chen",
      role: "Chief Technology Officer",
      background: "Former OpenAI Engineer",
      description: "Core contributor to GPT models. 12 years experience in NLP and legal document processing.",
      linkedin: "#"
    }
  ];

  const advisors = [
    "Judge Patricia Williams (Ret.) - Former Federal Judge",
    "Robert Sterling - Managing Partner, Wilson Sonsini",
    "Dr. Lisa Zhang - Stanford Law School, AI & Law Professor",
    "James Morrison - Former ABA Technology Committee Chair"
  ];

  return (
    <div className="bg-gradient-to-br from-navy-900 to-navy-800 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built by Legal Professionals for Legal Professionals
            </h2>
            <p className="text-lg md:text-xl text-navy-300 max-w-3xl mx-auto">
              Our team combines decades of BigLaw experience with cutting-edge AI expertise. 
              We understand your challenges because we've lived them.
            </p>
          </div>

          {/* Leadership Team */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {team.map((member, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="w-16 h-16 bg-gold-400 rounded-full flex items-center justify-center mb-4">
                  <span className="text-navy-900 font-bold text-xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <div className="text-gold-400 font-medium mb-1">{member.role}</div>
                <div className="text-sm text-navy-300 mb-3">{member.background}</div>
                <p className="text-sm text-navy-400 mb-4">{member.description}</p>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/30 text-white hover:bg-white hover:text-navy-900"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            ))}
          </div>

          {/* Mission & Values */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gold-400">Our Mission</h3>
              <p className="text-navy-300 leading-relaxed mb-6">
                To democratize access to sophisticated legal analysis tools, making high-quality document 
                review accessible to solo practitioners and large firms alike. We believe AI should augment, 
                not replace, legal expertise.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-navy-300">
                    <strong>Transparency:</strong> No black box AI - every recommendation is explainable
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-navy-300">
                    <strong>Security:</strong> Your client data is sacred - zero retention policy
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-navy-300">
                    <strong>Excellence:</strong> Built to BigLaw standards, priced for everyone
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gold-400">Advisory Board</h3>
              <p className="text-navy-300 mb-6">
                Guided by recognized leaders in legal technology and practice:
              </p>
              <ul className="space-y-3">
                {advisors.map((advisor, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <ExternalLink className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <span className="text-sm text-navy-300">{advisor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h4 className="font-semibold text-gold-400 mb-2">Headquarters</h4>
                <p className="text-sm text-navy-300">
                  2100 Geng Road, Suite 210<br/>
                  Palo Alto, CA 94303<br/>
                  +1 (650) 555-0123
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gold-400 mb-2">Founded</h4>
                <p className="text-sm text-navy-300">
                  2022 by legal professionals frustrated<br/>
                  with inefficient document review<br/>
                  processes in BigLaw firms
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gold-400 mb-2">Backed By</h4>
                <p className="text-sm text-navy-300">
                  Andreessen Horowitz<br/>
                  Wilson Sonsini Legal Fund<br/>
                  NEA (New Enterprise Associates)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};