import React from 'react';
import { Card, CardHeader, CardBody, CardTitle } from '../components/UI/Card';

const SystemPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        System Health
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>System Monitoring</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor system health, performance metrics, and alerts.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default SystemPage;