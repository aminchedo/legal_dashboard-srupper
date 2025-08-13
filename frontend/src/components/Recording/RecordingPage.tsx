import React, { useState, useRef, useCallback } from 'react';
import { Play, Square, Download, Monitor, Mic, MicOff } from 'lucide-react';

interface RecordingPageProps {}

const RecordingPage: React.FC<RecordingPageProps> = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [error, setError] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  const startRecording = useCallback(async () => {
    try {
      setError('');
      
      // Request screen capture
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: audioEnabled
      });

      // If audio is enabled and not captured from screen, add microphone
      let finalStream = screenStream;
      if (audioEnabled && !screenStream.getAudioTracks().length) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ 
            audio: { echoCancellation: true, noiseSuppression: true } 
          });
          
          // Combine video and audio tracks
          const combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
          ]);
          finalStream = combinedStream;
        } catch (audioError) {
          console.warn('Could not capture audio:', audioError);
          // Continue with screen video only
        }
      }

      streamRef.current = finalStream;

      // Show preview
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = finalStream;
        previewVideoRef.current.play();
      }

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(finalStream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        
        // Stop all tracks
        finalStream.getTracks().forEach(track => track.stop());
        
        // Clear preview
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please ensure you grant screen sharing permissions.');
    }
  }, [audioEnabled]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const downloadRecording = useCallback(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `screen-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [recordedBlob]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Monitor className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Screen Recording Demo</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Recording Controls</h3>
              
              {/* Audio Toggle */}
              <div className="flex items-center space-x-3 mb-4">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                    audioEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                  disabled={isRecording}
                >
                  {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  <span>{audioEnabled ? 'Audio On' : 'Audio Off'}</span>
                </button>
              </div>

              {/* Recording Status */}
              {isRecording && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
                </div>
              )}

              {/* Main Controls */}
              <div className="flex space-x-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop Recording</span>
                  </button>
                )}

                {recordedBlob && (
                  <button
                    onClick={downloadRecording}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                )}
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-blue-900 mb-2">How it works:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Click "Start Recording" to begin screen capture</li>
                <li>• Select which screen/window to share</li>
                <li>• Recording will show in the preview area</li>
                <li>• Click "Stop Recording" when finished</li>
                <li>• Download your recording as a WebM file</li>
              </ul>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={previewVideoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                {!isRecording && !streamRef.current && (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Preview will appear here when recording starts</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recording Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold mb-2">Recording Details</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Format:</strong> WebM (VP9 + Opus)</p>
                <p><strong>Quality:</strong> Up to 1080p</p>
                <p><strong>Audio:</strong> {audioEnabled ? 'Enabled' : 'Disabled'}</p>
                <p><strong>Status:</strong> {isRecording ? 'Recording...' : recordedBlob ? 'Ready to download' : 'Ready to start'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Browser Compatibility */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-md font-semibold text-yellow-900 mb-2">Browser Compatibility</h4>
        <p className="text-sm text-yellow-800">
          This demo requires a modern browser with Screen Capture API support (Chrome 72+, Firefox 66+, Safari 13+).
          Make sure to grant screen sharing permissions when prompted.
        </p>
      </div>
    </div>
  );
};

export default RecordingPage;