import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../components/UI/Card';
import Button from '../components/UI/Button';
import {
  CogIcon,
  PlusIcon,
  PlayIcon,
  StopIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';

const JobsPage: React.FC = () => {
  const jobs = [
    { id: 1, name: 'Legal Database Scraping', status: 'running', progress: 65 },
    { id: 2, name: 'Court Records Collection', status: 'completed', progress: 100 },
    { id: 3, name: 'Case Law Research', status: 'paused', progress: 30 },
    { id: 4, name: 'Regulatory Updates', status: 'pending', progress: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Scraping Jobs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your web scraping operations
          </p>
        </div>
        <Button size="sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Job
        </Button>
      </div>

      <div className="grid gap-6">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <CogIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {job.name}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {job.progress}% complete
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {job.status === 'running' ? (
                      <>
                        <Button variant="outline" size="sm">
                          <PauseIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <StopIcon className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm">
                        <PlayIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;