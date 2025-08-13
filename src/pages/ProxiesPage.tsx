import React from 'react';
import { Card, CardHeader, CardBody, CardTitle } from '../components/UI/Card';

const ProxiesPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Proxy Management
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Proxies</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 dark:text-gray-400">
            Configure and monitor proxy servers for web scraping operations.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProxiesPage;