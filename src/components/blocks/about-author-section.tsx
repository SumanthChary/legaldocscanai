
import { InView } from "@/components/ui/in-view";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Twitter, Linkedin } from "lucide-react";

export const AboutAuthorSection = () => {
  const stats = [
    { label: "Years Experience", value: "5+" },
    { label: "Projects Built", value: "50+" },
    { label: "Technologies", value: "20+" }
  ];

  const socialLinks = [
    {
      icon: Twitter,
      label: "Twitter",
      url: "https://x.com/SumanthChary07"
    },
    {
      icon: Linkedin,
      label: "Peerlist",
      url: "https://peerlist.io/sumanthdev"
    },
    {
      icon: Github,
      label: "GitHub",
      url: "https://github.com/sumanthchary"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet the Creator
            </h2>
            <p className="text-lg text-gray-600">
              The developer behind LegalBriefAI
            </p>
          </div>
        </InView>

        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="text-center lg:text-left">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto lg:mx-0 mb-4">
                  SC
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Sumanth Chary
                </h3>
                <p className="text-blue-600 font-medium mb-4">
                  Full-Stack Developer
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Passionate about leveraging AI technology to solve real-world problems in the legal industry. 
                  With expertise in modern web development and artificial intelligence, I created LegalBriefAI to help 
                  legal professionals streamline their document analysis workflow.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((link, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="border-gray-200 hover:border-blue-200 hover:bg-blue-50"
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
        </InView>
      </div>
    </section>
  );
};
