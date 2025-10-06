"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Youtube } from "lucide-react";

// Import organized components
import { QuickPresets } from './video-processor/quick-presets';
import { YouTubeUrlInput } from './video-processor/youtube-url-input';
import { ConfigurationTabs } from './video-processor/configuration-tabs';
import { SubmitButton } from './video-processor/submit-button';
import { ProcessingStatus } from './video-processor/processing-status';
import { GeneratedReels } from './video-processor/generated-reels';

// Import shared types
import { FormData, ProcessingStep, GeneratedReel } from './video-processor/types';

export function VideoProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [generatedReels, setGeneratedReels] = useState<GeneratedReel[]>([]);
  const { toast } = useToast();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      youtubeUrl: '',
      clipDuration: 30,
      numberOfReels: 3,
      subtitleStyle: 'modern'
    }
  });

  const watchedValues = watch();

  const handlePresetSelect = (presetKey: 'viral' | 'educational' | 'comedy' | 'highlights') => {
    const presetConfigs = {
      viral: { clipDuration: 15, numberOfReels: 5, subtitleStyle: 'neon' as const },
      educational: { clipDuration: 60, numberOfReels: 3, subtitleStyle: 'modern' as const },
      comedy: { clipDuration: 30, numberOfReels: 4, subtitleStyle: 'bold' as const },
      highlights: { clipDuration: 45, numberOfReels: 2, subtitleStyle: 'classic' as const }
    };
    
    const preset = presetConfigs[presetKey];
    setValue('clipDuration', preset.clipDuration);
    setValue('numberOfReels', preset.numberOfReels);
    setValue('subtitleStyle', preset.subtitleStyle);
    
    toast({
      title: "🎯 Preset Applied",
      description: `"${presetKey}" settings have been applied.`,
      variant: "success",
    });
  };

  const onSubmit = async (data: FormData) => {
    if (!data.youtubeUrl.trim()) {
      toast({
        title: "❌ URL Required",
        description: "Please enter a valid YouTube URL to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setGeneratedReels([]);
    
    // Initialize processing steps
    const steps: ProcessingStep[] = [
      { id: '1', name: 'Downloading YouTube video', status: 'processing', progress: 0 },
      { id: '2', name: 'Analyzing content with AI', status: 'pending' },
      { id: '3', name: 'Identifying viral moments', status: 'pending' },
      { id: '4', name: 'Generating subtitles', status: 'pending' },
      { id: '5', name: 'Creating reel videos', status: 'pending' },
      { id: '6', name: 'Finalizing output', status: 'pending' }
    ];
    
    setProcessingSteps(steps);

    try {
      // Call the REAL API endpoint
      console.log('🚀 Starting real video processing...');
      
      // Start with first step
      setProcessingSteps(prev => prev.map(step => 
        step.id === '1' 
          ? { ...step, status: 'processing' as const, progress: 0 }
          : step
      ));

      const response = await fetch('/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtubeUrl: data.youtubeUrl,
          clipDuration: data.clipDuration,
          numberOfReels: data.numberOfReels,
          subtitleStyle: data.subtitleStyle,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Simulate progress updates while waiting for response
      const simulateProgress = async () => {
        const steps = ['1', '2', '3', '4', '5', '6'];
        for (let i = 0; i < steps.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds per step
          
          // Mark current step as completed
          setProcessingSteps(prev => prev.map(step => 
            step.id === steps[i] 
              ? { ...step, status: 'completed' as const, progress: 100 }
              : step
          ));

          // Start next step
          if (i < steps.length - 1) {
            setProcessingSteps(prev => prev.map(step => 
              step.id === steps[i + 1] 
                ? { ...step, status: 'processing' as const, progress: 0 }
                : step
            ));
          }
        }
      };

      // Start progress simulation
      simulateProgress();

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Processing failed');
      }

      console.log('✅ Processing completed:', result);

      // Mark all steps as completed
      setProcessingSteps(prev => prev.map(step => ({
        ...step,
        status: 'completed' as const,
        progress: 100
      })));

      // Convert API response to GeneratedReel format
      const processedReels: GeneratedReel[] = result.reels.map((reel: any) => ({
        id: reel.id,
        filename: reel.filename,
        downloadUrl: reel.downloadUrl,
        duration: reel.duration,
        keywords: reel.keywords || ['ai-generated', 'reel'],
        transcript: reel.transcript,
      }));

      setGeneratedReels(processedReels);
      
      console.log('📁 Generated reels with download URLs:', processedReels.map(r => ({ filename: r.filename, url: r.downloadUrl })));
      
      toast({
        title: "🎉 Processing Complete!",
        description: `Successfully generated ${processedReels.length} downloadable reels! Click download buttons or "Local Files" to get your videos.`,
        variant: "success",
      });

    } catch (error) {
      console.error('❌ Processing error:', error);
      toast({
        title: "❌ Processing Failed",
        description: error instanceof Error ? error.message : "An error occurred while processing your video. Please try again.",
        variant: "destructive",
      });
      
      // Mark current step as error
      setProcessingSteps(prev => prev.map(step => 
        step.status === 'processing' 
          ? { ...step, status: 'error' as const }
          : step
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
            </motion.div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              AI Video Processor
            </h1>
            <p className="text-xl text-slate-600 mb-4">
              Transform YouTube videos into viral Instagram reels with AI
            </p>
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
              <Sparkles className="w-4 h-4 mr-1" />
              Powered by Advanced AI
            </Badge>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Quick Presets */}
            <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  Quick Presets
                </CardTitle>
                <CardDescription>
                  Choose a preset to get started quickly with optimized settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuickPresets 
                  isProcessing={isProcessing}
                  onApplyPreset={handlePresetSelect}
                />
              </CardContent>
            </Card>

            {/* YouTube URL Input */}
            <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Youtube className="w-4 h-4 text-white" />
                  </div>
                  YouTube Video
                </CardTitle>
                <CardDescription>
                  Enter the YouTube URL you want to convert into reels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <YouTubeUrlInput 
                  register={register} 
                  errors={errors}
                  isProcessing={isProcessing}
                />
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  Configuration
                </CardTitle>
                <CardDescription>
                  Customize your AI reel generation settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigurationTabs 
                  watch={watch}
                  setValue={setValue}
                  isProcessing={isProcessing}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <SubmitButton isProcessing={isProcessing} />
          </form>

          {/* Processing Status */}
          {isProcessing && (
            <ProcessingStatus 
              processingSteps={processingSteps}
            />
          )}

          {/* Generated Reels */}
          {generatedReels.length > 0 && (
            <GeneratedReels generatedReels={generatedReels} />
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default VideoProcessor;