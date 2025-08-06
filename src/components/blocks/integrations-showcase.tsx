import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const IntegrationsShowcase = () => {
  const integrations = [
    {
      name: "Clio",
      description: "Seamless case management integration",
      status: "Live"
    },
    {
      name: "LexisNexis",
      description: "Direct legal research access",
      status: "Live"
    },
    {
      name: "Westlaw",
      description: "Case law citation verification",
      status: "Live"
    },
    {
      name: "Thomson Reuters",
      description: "Document management sync",
      status: "Beta"
    },
    {
      name: "NetDocuments",
      description: "Cloud document storage",
      status: "Coming Soon"
    },
    {
      name: "Microsoft 365",
      description: "Word & Outlook integration",
      status: "Live"
    }
  ];

  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              Works with Your Existing Legal Tools
            </h2>
            <p className="text-lg md:text-xl text-navy-600 max-w-3xl mx-auto">
              LegalDeep AI integrates seamlessly with the legal software you already use. 
              Setup takes less than 5 minutes.
            </p>
          </div>

          {/* Integration Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {integrations.map((integration, index) => (
              <div key={index} className="border border-navy-200 rounded-xl p-6 hover:border-gold-400 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center">
                    <span className="text-navy-700 font-semibold text-sm">
                      {integration.name.slice(0, 2)}
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    integration.status === 'Live' 
                      ? 'bg-green-100 text-green-700'
                      : integration.status === 'Beta'
                      ? 'bg-gold-100 text-gold-700'
                      : 'bg-navy-100 text-navy-700'
                  }`}>
                    {integration.status}
                  </div>
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">{integration.name}</h3>
                <p className="text-sm text-navy-600">{integration.description}</p>
              </div>
            ))}
          </div>

          {/* Workflow Demo */}
          <div className="bg-navy-50 rounded-2xl p-6 md:p-8 mb-12">
            <h3 className="text-xl md:text-2xl font-semibold text-navy-900 mb-6 text-center">
              Your Workflow, Enhanced
            </h3>
            
            <div className="grid md:grid-cols-4 gap-4 items-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-2xl">📄</span>
                </div>
                <h4 className="font-medium text-navy-900 mb-1">Upload Contract</h4>
                <p className="text-xs text-navy-600">From your DMS or email</p>
              </div>
              
              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-navy-400 hidden md:block" />
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="font-medium text-navy-900 mb-1">AI Analysis</h4>
                <p className="text-xs text-navy-600">43 seconds average</p>
              </div>
              
              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-navy-400 hidden md:block" />
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-medium text-navy-900 mb-1">Instant Results</h4>
                <p className="text-xs text-navy-600">Back to your system</p>
              </div>
            </div>
          </div>

          {/* API & Enterprise */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-navy-900 text-white p-6 md:p-8 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3">API Access</h3>
              <p className="text-navy-300 mb-4">
                Build custom integrations with our REST API. Complete documentation and SDKs available.
              </p>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-400" />
                  Bulk document processing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-400" />
                  Webhook notifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-400" />
                  Custom data export
                </li>
              </ul>
              <Button variant="outline" className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-navy-900">
                View API Docs
              </Button>
            </div>

            <div className="bg-gradient-to-br from-gold-50 to-gold-100 p-6 md:p-8 rounded-2xl">
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Enterprise SSO</h3>
              <p className="text-navy-700 mb-4">
                Secure single sign-on with your existing identity provider.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-navy-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-600" />
                  SAML 2.0 & OIDC support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-600" />
                  Active Directory integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-600" />
                  Role-based permissions
                </li>
              </ul>
              <Button className="bg-navy-900 hover:bg-navy-800 text-white">
                Contact IT Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};