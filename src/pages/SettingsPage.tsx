import React from 'react';
import { Card, CardHeader, CardBody, CardTitle } from '../components/UI/Card';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Settings
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 dark:text-gray-400">
            Configure user preferences and system settings.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsPage;