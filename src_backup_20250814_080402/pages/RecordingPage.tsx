import React, { useState, useRef, useCallback, useEffect } from 'react';
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
 
import { api } from '../services/apiClient';
import {
  PlayIcon,
  StopIcon,
  PauseIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  DocumentIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';

interface Recording {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'screen';
  duration: number;
  size: number;
  createdAt: string;
  status: 'recording' | 'completed' | 'processing' | 'error';
  url?: string;
}

interface RecordingStats {
  totalRecordings: number;
  totalDuration: number;
  totalSize: number;
  activeRecordings: number;
}

const RecordingPage: React.FC = () => {
  const { t } = useTranslation();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [stats, setStats] = useState<RecordingStats>({
    totalRecordings: 0,
    totalDuration: 0,
    totalSize: 0,
    activeRecordings: 0
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingType, setRecordingType] = useState<'audio' | 'video' | 'screen'>('audio');
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch recordings on component mount
  useEffect(() => {
    fetchRecordings();
  }, []);

  // Update recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const response = await api.recording.list();
      const recordingsData = response.data || [];
      setRecordings(recordingsData);
      
      // Calculate stats
      const stats = recordingsData.reduce((acc: RecordingStats, recording: Recording) => ({
        totalRecordings: acc.totalRecordings + 1,
        totalDuration: acc.totalDuration + recording.duration,
        totalSize: acc.totalSize + recording.size,
        activeRecordings: acc.activeRecordings + (recording.status === 'recording' ? 1 : 0)
      }), {
        totalRecordings: 0,
        totalDuration: 0,
        totalSize: 0,
        activeRecordings: 0
      });
      
      setStats(stats);
    } catch (err) {
      setError('Failed to fetch recordings');
      console.error('Error fetching recordings:', err);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      let stream: MediaStream;

      switch (recordingType) {
        case 'audio':
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          break;
        case 'video':
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          break;
        case 'screen':
          stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
          break;
        default:
          throw new Error('Invalid recording type');
      }

      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { 
          type: recordingType === 'audio' ? 'audio/webm' : 'video/webm' 
        });
        
        // Create a new recording entry
        const newRecording: Recording = {
          id: Date.now().toString(),
          name: `${recordingType}-${new Date().toISOString().split('T')[0]}-${Date.now()}`,
          type: recordingType,
          duration: recordingTime,
          size: blob.size,
          createdAt: new Date().toISOString(),
          status: 'completed',
          url: URL.createObjectURL(blob)
        };

        // Save recording via API
        try {
          await api.recording.start({
            name: newRecording.name,
            type: recordingType,
            duration: recordingTime,
            size: blob.size
          });
          
          setRecordings(prev => [newRecording, ...prev]);
          setStats(prev => ({
            totalRecordings: prev.totalRecordings + 1,
            totalDuration: prev.totalDuration + recordingTime,
            totalSize: prev.totalSize + blob.size,
            activeRecordings: prev.activeRecordings
          }));
        } catch (err) {
          console.error('Error saving recording:', err);
          setError('Failed to save recording');
        }

        // Cleanup
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setCurrentRecording(null);
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      
      const recording: Recording = {
        id: 'current',
        name: `Recording ${recordingType}...`,
        type: recordingType,
        duration: 0,
        size: 0,
        createdAt: new Date().toISOString(),
        status: 'recording'
      };
      
      setCurrentRecording(recording);
      
    } catch (err) {
      setError(`Failed to start ${recordingType} recording. Please check permissions.`);
      console.error('Error starting recording:', err);
    }
  }, [recordingType, recordingTime]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  }, [isRecording, isPaused]);

  const deleteRecording = async (id: string) => {
    try {
      await api.recording.delete(id);
      setRecordings(prev => prev.filter(r => r.id !== id));
      setStats(prev => ({
        ...prev,
        totalRecordings: prev.totalRecordings - 1
      }));
    } catch (err) {
      setError('Failed to delete recording');
      console.error('Error deleting recording:', err);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getRecordingIcon = (type: string) => {
    switch (type) {
      case 'video':
      case 'screen':
        return VideoCameraIcon;
      case 'audio':
      default:
        return MicrophoneIcon;
    }
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
       case 'recording':
        return PlayIcon;
      case 'processing':
        return ClockIcon;
      case 'error':
        return ExclamationTriangleIcon;
      default:
        return DocumentIcon;
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
 
        return 'text-green-600 dark:text-green-400';
      case 'recording':
        return 'text-blue-600 dark:text-blue-400';
      case 'processing':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }
 
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
         title={t('nav.recording', 'Recording')}
        description="Record and process audio/video content for legal documentation and analysis."
        headerActions={
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" size="sm" onClick={fetchRecordings}>
              <MusicalNoteIcon className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {!isRecording && (
              <div className="flex gap-2">
                <select
                  value={recordingType}
                  onChange={(e) => setRecordingType(e.target.value as any)}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                  <option value="screen">Screen</option>
                </select>
                <Button size="sm" onClick={startRecording}>
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              </div>
            )}
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
       {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
              className="ml-auto text-red-600 dark:text-red-400"
            >
              ×
            </Button>
          </div>
        </motion.div>
      )}

      {/* Current Recording Status */}
      {currentRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <PlayIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recording {recordingType}...
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Duration: {formatDuration(recordingTime)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={pauseRecording}
                disabled={!isRecording}
              >
                <PauseIcon className="h-4 w-4 mr-2" />
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={stopRecording}
                disabled={!isRecording}
              >
                <StopIcon className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recording Statistics */}
      <DashboardSection
        title="Recording Statistics"
        description="Overview of your recording activity and storage usage"
      >
        <GridLayout {...DashboardGrids.metrics}>
          <MetricCard
            title="Total Recordings"
            value={stats.totalRecordings}
            change={{
              value: recordings.length > 0 ? "+1" : "0",
              type: recordings.length > 0 ? "increase" : "neutral",
              label: "this session"
            }}
            icon={DocumentIcon}
            iconColor="blue"
            delay={0}
            loading={loading}
          />
          <MetricCard
            title="Total Duration"
            value={formatDuration(stats.totalDuration)}
            change={{
              value: `${Math.round(stats.totalDuration / 60)} min`,
              type: "neutral",
              label: "total time"
            }}
            icon={ClockIcon}
            iconColor="green"
            delay={0.1}
            loading={loading}
          />
          <MetricCard
            title="Storage Used"
            value={formatFileSize(stats.totalSize)}
            change={{
              value: `${recordings.length} files`,
              type: "neutral",
              label: "stored"
            }}
            icon={MusicalNoteIcon}
            iconColor="purple"
            delay={0.2}
            loading={loading}
          />
          <MetricCard
            title="Active Recordings"
            value={stats.activeRecordings}
            change={{
              value: isRecording ? "Recording..." : "Idle",
              type: isRecording ? "increase" : "neutral"
            }}
            icon={getStatusIcon(isRecording ? 'recording' : 'completed')}
            iconColor={isRecording ? 'red' : 'gray'}
            delay={0.3}
            loading={loading}
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
       {/* Recordings List */}
      <DashboardSection
        title="Recent Recordings"
        description="Manage and access your recorded content"
      >
        <Card variant="elevated" padding="none">
          <CardBody>
            {recordings.length === 0 ? (
              <div className="text-center py-12">
                <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No recordings yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start your first recording to see it here
                </p>
                {!isRecording && (
                  <Button onClick={() => startRecording()}>
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recordings.map((recording, index) => {
                  const Icon = getRecordingIcon(recording.type);
                  const StatusIcon = getStatusIcon(recording.status);
                  
                  return (
                    <motion.div
                      key={recording.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {recording.name}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDuration(recording.duration)}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatFileSize(recording.size)}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(recording.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`flex items-center space-x-1 ${getStatusColor(recording.status)}`}>
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-xs font-medium capitalize">
                              {recording.status}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            {recording.url && (
                              <Button variant="ghost" size="sm">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            )}
                            {recording.url && (
                              <Button variant="ghost" size="sm">
                                <ArrowDownTrayIcon className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRecording(recording.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </DashboardSection>
     </div>
  );
};

export default RecordingPage;