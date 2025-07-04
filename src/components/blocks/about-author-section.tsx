
import { InView } from "@/components/ui/in-view";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Twitter, Linkedin } from "lucide-react";

export const AboutAuthorSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <InView
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                About the Creator
              </h2>
              <p className="text-lg text-gray-600">
                Meet the mind behind LegalBriefAI
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
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-4xl md:text-5xl font-bold">
                    SC
                  </div>
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Sumanth Chary
                  </h3>
                  <p className="text-lg text-purple-600 font-semibold mb-4">
                    Full-Stack Developer & AI Enthusiast
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Passionate about leveraging cutting-edge AI technology to solve real-world problems in the legal industry. 
                    With expertise in modern web development and artificial intelligence, I created LegalBriefAI to help legal 
                    professionals streamline their document analysis workflow and make informed decisions faster.
                  </p>
                  
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-purple-200 hover:bg-purple-50"
                      onClick={() => window.open('https://x.com/SumanthChary07', '_blank')}
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-purple-200 hover:bg-purple-50"
                      onClick={() => window.open('https://peerlist.io/sumanthdev', '_blank')}
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      Peerlist
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-purple-200 hover:bg-purple-50"
                      onClick={() => window.open('https://github.com/sumanthchary', '_blank')}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
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
