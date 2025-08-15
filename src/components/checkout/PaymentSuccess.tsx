import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Shield, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  const planName = searchParams.get('plan') || 'Professional';
  const amount = searchParams.get('amount') || '79';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border-0">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Welcome to the {planName} plan! Your subscription is now active.
            </p>

            {/* Payment Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{planName} Plan</p>
                    <p className="text-sm text-gray-600">Active Now</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Monthly Billing</p>
                    <p className="text-sm text-gray-600">${amount}/month</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Full Access</p>
                    <p className="text-sm text-gray-600">All Features</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Upload Documents</p>
                    <p className="text-sm text-gray-600">Start analyzing your contracts immediately</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-xs font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Explore Features</p>
                    <p className="text-sm text-gray-600">Discover advanced AI insights and reports</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-redirect Notice */}
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to dashboard in {countdown} seconds...
            </p>

            {/* Action Button */}
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>

            {/* Trust Elements */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">60-Day Guarantee</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Cancel Anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};