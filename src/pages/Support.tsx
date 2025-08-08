import { PageLayout } from "@/components/layout";

const Support = () => {
  return (
    <PageLayout>
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact & Support</h1>
          <p className="text-gray-600 mb-8">Have questions or need help? We're here for you.</p>

          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold mb-2">Email</h2>
              <a href="mailto:sumanthchary.business@gmail.com" className="text-blue-600 hover:underline">
                sumanthchary.business@gmail.com
              </a>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold mb-2">Phone</h2>
              <p className="text-gray-700">+91 8125228079</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Support;
