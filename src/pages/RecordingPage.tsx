import React from 'react';
import { Card, CardHeader, CardBody, CardTitle } from '../components/UI/Card';

const RecordingPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Recording
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Audio/Video Recording</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 dark:text-gray-400">
            Record and process audio/video content for legal documentation.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default RecordingPage;