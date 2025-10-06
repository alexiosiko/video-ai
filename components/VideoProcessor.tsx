'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Progress } from './ui/progress';

interface FormData {
  youtubeUrl: string;
  clipDuration: number;
  numberOfReels: number;
  subtitleStyle: 'modern' | 'bold' | 'neon' | 'classic';
}

interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
}

export default function VideoProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [generatedReels, setGeneratedReels] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      clipDuration: 30,
      numberOfReels: 3,
      subtitleStyle: 'modern',
    },
  });

  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/;
    return youtubeRegex.test(url) || 'Please enter a valid YouTube URL';
  };

  const onSubmit = async (data: FormData) => {
    setIsProcessing(true);
    setGeneratedReels([]);
    
    const steps: ProcessingStep[] = [
      { id: 'download', name: 'Downloading YouTube video', status: 'processing', progress: 0 },
      { id: 'analyze', name: 'AI content analysis', status: 'pending' },
      { id: 'highlights', name: 'Detecting highlights', status: 'pending' },
      { id: 'clips', name: 'Creating video clips', status: 'pending' },
      { id: 'subtitles', name: 'Generating subtitles', status: 'pending' },
      { id: 'render', name: 'Rendering final reels', status: 'pending' },
    ];
    
    setProcessingSteps(steps);

    // Simulate progress updates
    const updateProgress = (stepId: string, progress: number, status: 'processing' | 'completed' = 'processing') => {
      setProcessingSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, progress, status }
          : step
      ));
    };

    // Simulate step progression
    const simulateStepProgress = async (stepId: string, duration: number) => {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, duration / 10));
        updateProgress(stepId, i, i === 100 ? 'completed' : 'processing');
        if (i === 100) {
          // Start next step
          const stepIndex = steps.findIndex(s => s.id === stepId);
          if (stepIndex < steps.length - 1) {
            const nextStep = steps[stepIndex + 1];
            setProcessingSteps(prev => prev.map(step => 
              step.id === nextStep.id 
                ? { ...step, status: 'processing', progress: 0 }
                : step
            ));
          }
        }
      }
    };

    try {
      // Start processing simulation
      const stepPromises = [
        simulateStepProgress('download', 3000),
        new Promise(resolve => setTimeout(resolve, 3000)).then(() => simulateStepProgress('analyze', 2000)),
        new Promise(resolve => setTimeout(resolve, 5000)).then(() => simulateStepProgress('highlights', 1500)),
        new Promise(resolve => setTimeout(resolve, 6500)).then(() => simulateStepProgress('clips', 4000)),
        new Promise(resolve => setTimeout(resolve, 10500)).then(() => simulateStepProgress('subtitles', 3000)),
        new Promise(resolve => setTimeout(resolve, 13500)).then(() => simulateStepProgress('render', 2500)),
      ];

      // Start actual API call
      const apiPromise = fetch('/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Wait for both simulation and API to complete
      const [, response] = await Promise.all([
        Promise.all(stepPromises),
        apiPromise
      ]);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process video');
      }

      const result = await response.json();
      setGeneratedReels(result.reels);
      
      // Mark all steps as completed
      setProcessingSteps(prev => prev.map(step => ({ ...step, status: 'completed', progress: 100 })));
      
    } catch (error) {
      console.error('Error processing video:', error);
      // Update current processing step to error
      setProcessingSteps(prev => 
        prev.map(step => 
          step.status === 'processing' 
            ? { ...step, status: 'error' }
            : step
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* YouTube URL Input */}
          <div>
            <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              YouTube Video URL
            </label>
            <input
              {...register('youtubeUrl', {
                required: 'YouTube URL is required',
                validate: validateYouTubeUrl,
              })}
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={isProcessing}
            />
            {errors.youtubeUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.youtubeUrl.message}</p>
            )}
          </div>

          {/* Basic Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Clip Duration */}
            <div>
              <label htmlFor="clipDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clip Duration (seconds)
              </label>
              <select
                {...register('clipDuration')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isProcessing}
              >
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
              </select>
            </div>

            {/* Number of Reels */}
            <div>
              <label htmlFor="numberOfReels" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Reels
              </label>
              <select
                {...register('numberOfReels')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isProcessing}
              >
                <option value={1}>1 Reel</option>
                <option value={3}>3 Reels</option>
                <option value={5}>5 Reels</option>
                <option value={10}>10 Reels</option>
              </select>
            </div>

            {/* Subtitle Style */}
            <div>
              <label htmlFor="subtitleStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subtitle Style
              </label>
              <select
                {...register('subtitleStyle')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isProcessing}
              >
                <option value="modern">✨ Modern</option>
                <option value="bold">💥 Bold & Chunky</option>
                <option value="neon">🌟 Neon Glow</option>
                <option value="classic">📝 Classic</option>
              </select>
            </div>
          </div>

          {/* Advanced Settings */}
          <details className="mb-6">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 select-none hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              ⚙️ Advanced Settings
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              {/* Video Quality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Video Quality
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="high">High (8000k bitrate)</option>
                  <option value="medium">Medium (4000k bitrate)</option>
                  <option value="low">Low (2000k bitrate)</option>
                </select>
              </div>

              {/* AI Sensitivity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AI Sensitivity
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="high">High - More clips</option>
                  <option value="medium">Medium - Balanced</option>
                  <option value="low">Low - Only best moments</option>
                </select>
              </div>

              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content Type
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="auto">🤖 Auto Detect</option>
                  <option value="educational">📚 Educational</option>
                  <option value="entertainment">🎭 Entertainment</option>
                  <option value="music">🎵 Music</option>
                  <option value="sports">⚽ Sports</option>
                  <option value="comedy">😂 Comedy</option>
                </select>
              </div>

              {/* Subtitle Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subtitle Position
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="bottom">Bottom</option>
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                </select>
              </div>

              {/* Audio Enhancement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Audio Enhancement
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="auto">Auto Enhance</option>
                  <option value="boost">Boost Volume</option>
                  <option value="normalize">Normalize</option>
                  <option value="none">No Enhancement</option>
                </select>
              </div>

              {/* Visual Effects */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Visual Effects
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Sharpen video</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Add glow effect</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Color enhance</span>
                  </label>
                </div>
              </div>
            </div>
          </details>

          {/* Quick Presets */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              🎯 Quick Presets
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                type="button"
                className="p-3 border-2 border-purple-200 dark:border-purple-800 rounded-lg hover:border-purple-400 dark:hover:border-purple-600 transition-colors text-center"
                onClick={() => {
                  // Set viral preset values
                }}
              >
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-xs font-medium">Viral</div>
                <div className="text-xs text-gray-500">Short & punchy</div>
              </button>
              <button
                type="button"
                className="p-3 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors text-center"
              >
                <div className="text-2xl mb-1">🎓</div>
                <div className="text-xs font-medium">Educational</div>
                <div className="text-xs text-gray-500">Informative clips</div>
              </button>
              <button
                type="button"
                className="p-3 border-2 border-green-200 dark:border-green-800 rounded-lg hover:border-green-400 dark:hover:border-green-600 transition-colors text-center"
              >
                <div className="text-2xl mb-1">😂</div>
                <div className="text-xs font-medium">Comedy</div>
                <div className="text-xs text-gray-500">Funny moments</div>
              </button>
              <button
                type="button"
                className="p-3 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg hover:border-yellow-400 dark:hover:border-yellow-600 transition-colors text-center"
              >
                <div className="text-2xl mb-1">✨</div>
                <div className="text-xs font-medium">Highlights</div>
                <div className="text-xs text-gray-500">Best moments</div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Processing Video...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6z" />
                </svg>
                Create AI Reels
              </>
            )}
          </button>
        </form>
      </div>

      {/* Processing Steps */}
      {processingSteps.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Processing Status</h3>
          <div className="space-y-4">
            {processingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {step.status === 'completed' && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {step.status === 'processing' && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                  {step.status === 'error' && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  {step.status === 'pending' && (
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    step.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                    step.status === 'processing' ? 'text-blue-600 dark:text-blue-400' :
                    step.status === 'error' ? 'text-red-600 dark:text-red-400' :
                    'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.name}
                  </p>
                  {step.status === 'processing' && step.progress !== undefined && (
                    <div className="mt-2">
                      <Progress value={step.progress} className="w-full h-2" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Reels */}
      {generatedReels.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Reels</h3>
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
              {generatedReels.length} reels created
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedReels.map((reel: any, index: number) => (
              <div key={reel.id || index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="aspect-[9/16] bg-black rounded-lg mb-4 relative overflow-hidden">
                  <video
                    src={reel.downloadUrl || reel}
                    controls
                    className="w-full h-full object-cover"
                    poster="/api/placeholder/200/355" // Placeholder poster
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    {reel.duration || 30}s
                  </div>
                </div>
                
                {/* Reel Info */}
                {reel.keywords && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {reel.keywords.slice(0, 3).map((keyword: string, i: number) => (
                        <span
                          key={i}
                          className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {reel.transcript && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {reel.transcript}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(reel.downloadUrl || reel, '_blank')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={() => navigator.share?.({ 
                      title: `AI Generated Reel ${index + 1}`,
                      url: reel.downloadUrl || reel 
                    })}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg transition duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bulk Actions */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                generatedReels.forEach((reel: any, index: number) => {
                  const link = document.createElement('a');
                  link.href = reel.downloadUrl || reel;
                  link.download = `ai_reel_${index + 1}.mp4`;
                  link.click();
                });
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Download All Reels
            </button>
          </div>
        </div>
      )}
    </div>
  );
}