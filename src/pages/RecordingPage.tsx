import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardTitle, 
  CardDescription 
} from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import MetricCard from '../components/UI/MetricCard';
import { GridLayout, GridItem, DashboardSection, DashboardGrids } from '../components/UI/GridLayout';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  DocumentArrowDownIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FolderIcon,
  ClockIcon,
  SpeakerWaveIcon,
  FilmIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

// Mock data for recording functionality
const mockRecordingStats = {
  totalRecordings: 24,
  activeRecordings: 2,
  totalDuration: '4h 32m',
  storageUsed: '2.3 GB',
  processingQueue: 3,
  successRate: 96.8,
};

const mockRecordings = [
  {
    id: '1',
    title: 'Client Meeting - Legal Consultation',
    duration: '1h 23m',
    date: '2024-01-15T10:30:00Z',
    type: 'video' as const,
    status: 'completed' as const,
    fileSize: '145 MB',
    participants: ['John Doe', 'Jane Smith', 'Mike Johnson'],
  },
  {
    id: '2',
    title: 'Court Hearing Audio Record',
    duration: '2h 15m',
    date: '2024-01-15T14:00:00Z',
    type: 'audio' as const,
    status: 'processing' as const,
    fileSize: '67 MB',
    participants: ['Judge Williams', 'Attorney Brown'],
  },
  {
    id: '3',
    title: 'Deposition Session',
    duration: '45m',
    date: '2024-01-14T16:30:00Z',
    type: 'video' as const,
    status: 'completed' as const,
    fileSize: '89 MB',
    participants: ['Witness Thompson', 'Attorney Davis'],
  },
  {
    id: '4',
    title: 'Contract Negotiation Call',
    duration: '1h 8m',
    date: '2024-01-14T09:15:00Z',
    type: 'audio' as const,
    status: 'failed' as const,
    fileSize: '0 MB',
    participants: ['Client Wilson', 'Partner Lee'],
  },
];

const RecordingPage: React.FC = () => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'audio' | 'video'>('audio');
  const [selectedRecordings, setSelectedRecordings] = useState<string[]>([]);

  const handleStartRecording = () => {
    setIsRecording(true);
    // Add recording logic here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Add stop recording logic here
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircleIcon;
      case 'processing':
        return ClockIcon;
      case 'failed':
        return ExclamationTriangleIcon;
      default:
        return ClockIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'processing':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'failed':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const recordingActions = [
    {
      title: 'New Audio Recording',
      description: 'Start recording audio for legal documentation',
      action: () => {
        setRecordingType('audio');
        handleStartRecording();
      },
      icon: MicrophoneIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'New Video Recording',
      description: 'Start recording video with audio',
      action: () => {
        setRecordingType('video');
        handleStartRecording();
      },
      icon: VideoCameraIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Import Recording',
      description: 'Upload existing audio/video files',
      action: () => console.log('Import recording'),
      icon: DocumentArrowDownIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Batch Process',
      description: 'Process multiple recordings at once',
      action: () => console.log('Batch process'),
      icon: FolderIcon,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <DashboardSection
        title="Audio/Video Recording"
        description="Record, process, and manage audio/video content for legal documentation and analysis."
        headerActions={
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Schedule Recording
            </Button>
            <Button size="sm" disabled={isRecording}>
              <PlusIcon className="h-4 w-4 mr-2" />
              {isRecording ? 'Recording...' : 'New Recording'}
            </Button>
          </div>
        }
      />

      {/* Recording Stats */}
      <DashboardSection>
        <GridLayout {...DashboardGrids.metrics}>
          <MetricCard
            title="Total Recordings"
            value={mockRecordingStats.totalRecordings}
            change={{
              value: "+3",
              type: "increase",
              label: "this week"
            }}
            icon={FilmIcon}
            iconColor="blue"
            delay={0}
          />
          <MetricCard
            title="Active Recordings"
            value={mockRecordingStats.activeRecordings}
            change={{
              value: "2 in progress",
              type: "neutral",
            }}
            icon={PlayIcon}
            iconColor="green"
            delay={0.1}
          />
          <MetricCard
            title="Total Duration"
            value={mockRecordingStats.totalDuration}
            change={{
              value: "+1h 25m",
              type: "increase",
              label: "from last week"
            }}
            icon={ClockIcon}
            iconColor="purple"
            delay={0.2}
          />
          <MetricCard
            title="Storage Used"
            value={mockRecordingStats.storageUsed}
            change={{
              value: "78% capacity",
              type: "neutral",
            }}
            icon={SpeakerWaveIcon}
            iconColor="orange"
            delay={0.3}
          />
        </GridLayout>
      </DashboardSection>

      {/* Recording Control Panel */}
      <DashboardSection
        title="Recording Control"
        description="Start new recordings or manage active sessions"
      >
        <Card variant="elevated" padding="lg">
          <CardBody>
            <GridLayout {...DashboardGrids.metrics}>
              {recordingActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={action.action}
                    disabled={isRecording && action.title.includes('New')}
                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {action.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </GridLayout>

            {/* Current Recording Status */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        Recording in progress - {recordingType === 'video' ? 'Video' : 'Audio'}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Duration: 00:15:23
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <PauseIcon className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                    <Button variant="danger" size="sm" onClick={handleStopRecording}>
                      <StopIcon className="h-4 w-4 mr-1" />
                      Stop
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </CardBody>
        </Card>
      </DashboardSection>

      <GridLayout {...DashboardGrids.twoColumn}>
        {/* Recent Recordings */}
        <GridItem span={{ default: 1, lg: 2 }}>
          <DashboardSection
            title="Recent Recordings"
            description="Manage and review your audio/video recordings"
          >
            <Card variant="elevated" padding="lg">
              <CardBody>
                <div className="space-y-4">
                  {mockRecordings.map((recording, index) => {
                    const StatusIcon = getStatusIcon(recording.status);
                    return (
                      <motion.div
                        key={recording.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            recording.type === 'video' 
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                              : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          }`}>
                            {recording.type === 'video' ? (
                              <VideoCameraIcon className="h-5 w-5" />
                            ) : (
                              <MicrophoneIcon className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {recording.title}
                              </h4>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recording.status)}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {recording.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {recording.duration} • {recording.fileSize} • {formatTime(recording.date)}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Participants: {recording.participants.join(', ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {recording.status === 'completed' && (
                            <>
                              <Button variant="ghost" size="sm">
                                <ArrowDownTrayIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" fullWidth>
                    <FolderIcon className="h-4 w-4 mr-2" />
                    View All Recordings
                  </Button>
                </div>
              </CardBody>
            </Card>
          </DashboardSection>
        </GridItem>

        {/* Processing Queue */}
        <GridItem>
          <DashboardSection
            title="Processing Queue"
            description="Files currently being processed"
          >
            <Card variant="elevated" padding="lg">
              <CardBody>
                <div className="space-y-4">
                  {mockRecordingStats.processingQueue > 0 ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Processing Files
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {mockRecordingStats.processingQueue} files
                        </span>
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="flex items-center space-x-3">
                            <LoadingSpinner size="sm" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-white">
                                Processing file {item}...
                              </p>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${30 + (item * 20)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No files in processing queue
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </DashboardSection>

          {/* Storage Information */}
          <DashboardSection
            title="Storage Information"
            description="Current storage usage and limits"
          >
            <Card variant="elevated" padding="lg">
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Storage Used
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {mockRecordingStats.storageUsed} / 10 GB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '23%' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Audio Files</p>
                      <p className="font-medium text-gray-900 dark:text-white">1.2 GB</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Video Files</p>
                      <p className="font-medium text-gray-900 dark:text-white">1.1 GB</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" fullWidth>
                    Manage Storage
                  </Button>
                </div>
              </CardBody>
            </Card>
          </DashboardSection>
        </GridItem>
      </GridLayout>
    </div>
  );
};

export default RecordingPage;