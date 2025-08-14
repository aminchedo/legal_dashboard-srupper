import React from 'react';
import { Card, CardHeader, CardBody, CardTitle } from '../components/UI/Card';

const DataPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Data Management
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Data Tables</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage structured data tables and exports.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default DataPage;