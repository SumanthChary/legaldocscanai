
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();

  const articles = [
    {
      id: "ai-legal-transformation",
      title: "The AI Revolution in Legal Document Analysis",
      description: "How artificial intelligence is transforming the legal industry through advanced document analysis and processing",
      author: "Sarah Matthews, J.D.",
      date: "March 15, 2024",
      readTime: "8 min read",
      content: `
        The legal industry is experiencing a profound transformation through the integration of artificial intelligence in document analysis. This technological revolution is not just about speed - it's about enhanced accuracy, deeper insights, and improved efficiency in legal work.

        Key Benefits of AI in Legal Document Analysis:
        • Reduced review time by up to 75%
        • Increased accuracy in contract analysis
        • Better identification of potential risks
        • Consistent interpretation across documents

        The Future of Legal Work:
        As AI technology continues to evolve, we're seeing more sophisticated applications in legal document processing. From automated contract review to intelligent case law analysis, AI is becoming an indispensable tool in the modern legal practice.
      `
    },
    {
      id: "compliance-automation",
      title: "Automating Compliance: A Guide to Modern Regulatory Requirements",
      description: "Understanding how automation can help maintain compliance with complex regulatory frameworks",
      author: "Michael Chen, Compliance Expert",
      date: "March 12, 2024",
      readTime: "6 min read",
      content: `
        In today's rapidly evolving regulatory landscape, maintaining compliance has become increasingly complex. Automation through AI-powered tools offers a solution to this growing challenge.

        Key Areas Where Automation Excels:
        • Real-time regulatory updates tracking
        • Automated compliance checking
        • Risk assessment and reporting
        • Document version control and audit trails

        Best Practices for Implementation:
        1. Start with a clear compliance framework
        2. Identify key automation opportunities
        3. Implement robust testing procedures
        4. Maintain human oversight
      `
    },
    {
      id: "gdpr-compliance",
      title: "GDPR and Document Processing: Essential Guidelines",
      description: "A comprehensive guide to maintaining GDPR compliance in document processing systems",
      author: "Dr. Elena Rodriguez, Privacy Expert",
      date: "March 8, 2024",
      readTime: "10 min read",
      content: `
        With GDPR enforcement becoming increasingly stringent, organizations must ensure their document processing systems are fully compliant. This guide explores essential requirements and best practices.

        Critical GDPR Requirements:
        • Data minimization principles
        • Lawful basis for processing
        • Data subject rights
        • Security measures

        Implementation Steps:
        1. Conduct thorough data mapping
        2. Implement privacy by design
        3. Establish clear data retention policies
        4. Regular compliance audits
      `
    },
    {
      id: "ai-legal-ethics",
      title: "Ethical Considerations in AI-Powered Legal Analysis",
      description: "Exploring the ethical implications and considerations of using AI in legal document analysis",
      author: "Prof. James Wilson, Legal Ethics",
      date: "March 5, 2024",
      readTime: "7 min read",
      content: `
        As AI becomes more prevalent in legal analysis, it's crucial to address the ethical considerations that arise from its use. This article examines key ethical challenges and proposed solutions.

        Key Ethical Considerations:
        • Bias in AI algorithms
        • Transparency in decision-making
        • Privacy and confidentiality
        • Professional responsibility

        Recommended Ethical Framework:
        1. Regular bias testing and mitigation
        2. Clear disclosure of AI use
        3. Maintaining human oversight
        4. Ongoing ethical training
      `
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8">Latest Articles</h1>
          <div className="space-y-8">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">{article.title}</CardTitle>
                  <CardDescription className="text-lg">{article.description}</CardDescription>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {article.readTime}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 whitespace-pre-line">
                    {article.content.substring(0, 200)}...
                  </p>
                  <Button 
                    variant="link" 
                    className="mt-4 p-0 h-auto font-semibold"
                    onClick={() => navigate(`/blog/${article.id}`)}
                  >
                    Read More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
