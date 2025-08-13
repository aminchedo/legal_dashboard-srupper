import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../components/UI/Card';
import Button from '../components/UI/Button';
import {
  ChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Performance metrics and insights for your legal analytics platform
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Documents Processed', value: '1,247', change: '+12%', positive: true },
          { label: 'Success Rate', value: '94.2%', change: '+2.3%', positive: true },
          { label: 'Avg Processing Time', value: '3.4s', change: '-0.8s', positive: true },
          { label: 'Error Rate', value: '5.8%', change: '-1.2%', positive: true },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`text-sm ${metric.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {metric.change} from last month
                  </span>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Processing Trends</CardTitle>
            <CardDescription>
              Daily document processing volume over time
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Chart placeholder</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Interactive chart would be rendered here
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate by Document Type</CardTitle>
            <CardDescription>
              Processing success rates across different document types
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Pie chart placeholder</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Document type breakdown
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            Key insights and recommendations based on your data
          </CardDescription>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[
              {
                title: 'Peak Processing Hours',
                description: 'Most documents are processed between 9 AM - 11 AM',
                impact: 'High',
                color: 'green'
              },
              {
                title: 'Document Type Performance',
                description: 'PDF documents have 12% higher success rate than images',
                impact: 'Medium',
                color: 'yellow'
              },
              {
                title: 'Processing Time Optimization',
                description: 'Consider increasing server capacity during peak hours',
                impact: 'Medium',
                color: 'blue'
              }
            ].map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className={`h-3 w-3 rounded-full mt-2 ${
                  insight.color === 'green' ? 'bg-green-500' :
                  insight.color === 'yellow' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {insight.description}
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    insight.impact === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {insight.impact} Impact
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AnalyticsPage;