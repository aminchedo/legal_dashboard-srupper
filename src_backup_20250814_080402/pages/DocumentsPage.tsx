import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../components/UI/Card';
import Button from '../components/UI/Button';
import {
  DocumentIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

const DocumentsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Documents
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and process your legal documents
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardBody className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="h-full">
              <CardBody className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DocumentIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Contract Agreement {item}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PDF • 2.3 MB • Processed
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Uploaded 2 hours ago
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    Processed
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="xs">
                      View
                    </Button>
                    <Button variant="ghost" size="xs">
                      Download
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Upload</CardTitle>
          <CardDescription>
            Drag and drop documents here or click to browse
          </CardDescription>
        </CardHeader>
        <CardBody>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
            <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drop files here or click to upload
            </p>
            <Button>Choose Files</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DocumentsPage;