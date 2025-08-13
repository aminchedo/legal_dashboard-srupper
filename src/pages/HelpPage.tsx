import React from 'react';
import { Card, CardHeader, CardBody, CardTitle } from '../components/UI/Card';

const HelpPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Help & Support
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 dark:text-gray-400">
            Search documentation and get help with using the platform.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default HelpPage;