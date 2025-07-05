
import { InView } from "@/components/ui/in-view";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Twitter, Linkedin, Code2, Zap } from "lucide-react";

export const AboutAuthorSection = () => {
  const stats = [
    { label: "Years of Experience", value: "5+" },
    { label: "Projects Built", value: "50+" },
    { label: "Technologies Mastered", value: "20+" }
  ];

  const socialLinks = [
    {
      icon: Twitter,
      label: "Twitter",
      url: "https://x.com/SumanthChary07",
      color: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
    },
    {
      icon: Linkedin,
      label: "Peerlist",
      url: "https://peerlist.io/sumanthdev",
      color: "hover:bg-green-50 hover:text-green-600 hover:border-green-200"
    },
    {
      icon: Github,
      label: "GitHub",
      url: "https://github.com/sumanthchary",
      color: "hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <InView
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Meet the Creator
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The visionary developer behind LegalBriefAI's innovative technology
              </p>
            </div>
          </InView>

          <InView
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 }
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-3xl p-8 md:p-12 border border-gray-200">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                {/* Profile Section */}
                <div className="lg:col-span-1 text-center lg:text-left">
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-2xl">
                      SC
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Sumanth Chary
                  </h3>
                  <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Full-Stack Developer & AI Innovator
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-700">About Me</span>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                      Passionate about leveraging cutting-edge AI technology to solve real-world problems in the legal industry. 
                      With expertise in modern web development and artificial intelligence, I created LegalBriefAI to help legal 
                      professionals streamline their document analysis workflow and make informed decisions faster.
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-gray-700">Currently building the future of legal tech</span>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex flex-wrap gap-3">
                      {socialLinks.map((link, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className={`border-gray-200 transition-all duration-300 ${link.color}`}
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <link.icon className="w-4 h-4 mr-2" />
                          {link.label}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </InView>
        </div>
      </div>
    </section>
  );
};
