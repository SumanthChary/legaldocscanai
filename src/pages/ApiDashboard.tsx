import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ApiDashboard as ApiDashboardComponent } from '@/components/api/ApiDashboard';

const ApiDashboard = () => {
  return (
    <PageLayout>
      <ApiDashboardComponent />
    </PageLayout>
  );
};

export default ApiDashboard;