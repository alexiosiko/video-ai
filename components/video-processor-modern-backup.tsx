"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Youtube, 
  Sparkles, 
  Download, 
  Share2, 
  Clock, 
  Tag,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play,
  Settings,
  Zap,
  Palette,
  Volume2
} from "lucide-react";

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

export function VideoProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [generatedReels, setGeneratedReels] = useState<any[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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
    
    // Show processing started toast
    toast({
      title: "🚀 Processing Started!",
      description: "Your YouTube video is being processed into Instagram reels...",
      variant: "default",
    });
    
    const steps: ProcessingStep[] = [
      { id: 'download', name: 'Downloading YouTube video', status: 'processing', progress: 0 },
      { id: 'analyze', name: 'AI content analysis', status: 'pending' },
      { id: 'highlights', name: 'Detecting highlights', status: 'pending' },
      { id: 'clips', name: 'Creating video clips', status: 'pending' },
      { id: 'subtitles', name: 'Generating subtitles', status: 'pending' },
      { id: 'render', name: 'Rendering final reels', status: 'pending' },
    ];
    
    setProcessingSteps(steps);

    // Progress simulation
    const updateProgress = (stepId: string, progress: number, status: 'processing' | 'completed' = 'processing') => {
      setProcessingSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, progress, status }
          : step
      ));
    };

    const simulateStepProgress = async (stepId: string, duration: number) => {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, duration / 10));
        updateProgress(stepId, i, i === 100 ? 'completed' : 'processing');
        if (i === 100) {
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
      // MUCH FASTER processing simulation! ⚡
      const stepPromises = [
        simulateStepProgress('download', 800),
        new Promise(resolve => setTimeout(resolve, 800)).then(() => simulateStepProgress('analyze', 600)),
        new Promise(resolve => setTimeout(resolve, 1400)).then(() => simulateStepProgress('highlights', 500)),
        new Promise(resolve => setTimeout(resolve, 1900)).then(() => simulateStepProgress('clips', 700)),
        new Promise(resolve => setTimeout(resolve, 2600)).then(() => simulateStepProgress('subtitles', 600)),
        new Promise(resolve => setTimeout(resolve, 3200)).then(() => simulateStepProgress('render', 500)),
      ];

      const apiPromise = fetch('/api/process-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const [, response] = await Promise.all([Promise.all(stepPromises), apiPromise]);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process video');
      }

      const result = await response.json();
      setGeneratedReels(result.reels);
      setProcessingSteps(prev => prev.map(step => ({ ...step, status: 'completed', progress: 100 })));
      
      // Show success toast
      toast({
        title: "🎉 Processing Complete!",
        description: `Successfully generated ${result.reels.length} Instagram reels from "${result.videoTitle}"`,
        variant: "success",
      });
      
    } catch (error) {
      console.error('Error processing video:', error);
      setProcessingSteps(prev => 
        prev.map(step => 
          step.status === 'processing' 
            ? { ...step, status: 'error' }
            : step
        )
      );
      
      // Show error toast
      toast({
        title: "❌ Processing Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during video processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const presetConfigs = {
    viral: { clipDuration: 15, numberOfReels: 5, subtitleStyle: 'bold' as const },
    educational: { clipDuration: 60, numberOfReels: 3, subtitleStyle: 'modern' as const },
    comedy: { clipDuration: 30, numberOfReels: 5, subtitleStyle: 'neon' as const },
    highlights: { clipDuration: 45, numberOfReels: 3, subtitleStyle: 'classic' as const },
  };

  const applyPreset = (preset: keyof typeof presetConfigs) => {
    const config = presetConfigs[preset];
    setValue('clipDuration', config.clipDuration);
    setValue('numberOfReels', config.numberOfReels);
    setValue('subtitleStyle', config.subtitleStyle);
    
    // Show preset applied toast
    toast({
      title: `✨ ${preset.charAt(0).toUpperCase() + preset.slice(1)} Preset Applied`,
      description: `Settings updated: ${config.clipDuration}s clips, ${config.numberOfReels} reels, ${config.subtitleStyle} subtitles`,
      variant: "default",
    });
  };

  return (
    <div id="video-processor" className="max-w-6xl mx-auto space-y-8">
      {/* Main Processing Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Youtube className="h-6 w-6 text-red-500" />
            AI Reel Creator
          </CardTitle>
          <CardDescription className="text-base">
            Transform any YouTube video into engaging Instagram reels with AI
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* YouTube URL Input */}
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl" className="text-sm font-medium">
                YouTube Video URL
              </Label>
              <div className="relative">
                <Youtube className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('youtubeUrl', {
                    required: 'YouTube URL is required',
                    validate: validateYouTubeUrl,
                  })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="pl-10 h-12"
                  disabled={isProcessing}
                />
              </div>
              {errors.youtubeUrl && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.youtubeUrl.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Quick Presets */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Label className="text-sm font-medium">Quick Presets</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries({
                  viral: { icon: "🔥", name: "Viral", desc: "Short & punchy" },
                  educational: { icon: "🎓", name: "Educational", desc: "Informative" },
                  comedy: { icon: "😂", name: "Comedy", desc: "Funny moments" },
                  highlights: { icon: "✨", name: "Highlights", desc: "Best clips" },
                }).map(([key, preset], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.1 * index,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => applyPreset(key as keyof typeof presetConfigs)}
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted/50 border-2 hover:border-primary/20 transition-all duration-200"
                      disabled={isProcessing}
                    >
                      <motion.span 
                        className="text-2xl"
                        whileHover={{ 
                          scale: 1.2,
                          rotate: [0, -10, 10, -10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        {preset.icon}
                      </motion.span>
                      <div className="text-center">
                        <div className="font-medium text-xs">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">{preset.desc}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <Separator />

            {/* Configuration Tabs */}
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Clip Duration
                    </Label>
                    <Select
                      value={watch('clipDuration')?.toString()}
                      onValueChange={(value) => setValue('clipDuration', parseInt(value))}
                      disabled={isProcessing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">60 seconds</SelectItem>
                        <SelectItem value="90">90 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Number of Reels
                    </Label>
                    <Select
                      value={watch('numberOfReels')?.toString()}
                      onValueChange={(value) => setValue('numberOfReels', parseInt(value))}
                      disabled={isProcessing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Reel</SelectItem>
                        <SelectItem value="3">3 Reels</SelectItem>
                        <SelectItem value="5">5 Reels</SelectItem>
                        <SelectItem value="10">10 Reels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Subtitle Style
                    </Label>
                    <Select
                      value={watch('subtitleStyle')}
                      onValueChange={(value) => setValue('subtitleStyle', value as FormData['subtitleStyle'])}
                      disabled={isProcessing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">✨ Modern</SelectItem>
                        <SelectItem value="bold">💥 Bold & Chunky</SelectItem>
                        <SelectItem value="neon">🌟 Neon Glow</SelectItem>
                        <SelectItem value="classic">📝 Classic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="h-4 w-4" />
                      <Label className="font-medium">Video Quality</Label>
                    </div>
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High (8000k bitrate)</SelectItem>
                        <SelectItem value="medium">Medium (4000k bitrate)</SelectItem>
                        <SelectItem value="low">Low (2000k bitrate)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Volume2 className="h-4 w-4" />
                      <Label className="font-medium">Audio Enhancement</Label>
                    </div>
                    <Select defaultValue="auto">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto Enhance</SelectItem>
                        <SelectItem value="boost">Boost Volume</SelectItem>
                        <SelectItem value="normalize">Normalize</SelectItem>
                        <SelectItem value="none">No Enhancement</SelectItem>
                      </SelectContent>
                    </Select>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                disabled={isProcessing}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                  animate={isProcessing ? {} : {
                    translateX: ['100%', '200%'],
                    transition: {
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear"
                    }
                  }}
                />
                
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="mr-2 h-4 w-4" />
                    </motion.div>
                    <motion.span
                      animate={{ 
                        opacity: [1, 0.7, 1],
                        transition: { duration: 1.5, repeat: Infinity }
                      }}
                    >
                      Creating Reels...
                    </motion.span>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                        transition: { duration: 2, repeat: Infinity }
                      }}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                    </motion.div>
                    Create AI Reels
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
      </motion.div>

      {/* Processing Status */}
      <AnimatePresence>
        {processingSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {processingSteps.map((step, index) => (
              <motion.div 
                key={step.id} 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <motion.div 
                  className="flex-shrink-0"
                  animate={step.status === 'processing' ? {
                    scale: [1, 1.1, 1],
                    transition: { duration: 1, repeat: Infinity }
                  } : {}}
                >
                  {step.status === 'completed' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                  {step.status === 'processing' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="h-5 w-5 text-blue-500" />
                    </motion.div>
                  )}
                  {step.status === 'error' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </motion.div>
                  )}
                  {step.status === 'pending' && (
                    <motion.div 
                      className="h-5 w-5 rounded-full bg-muted"
                      animate={{ 
                        opacity: [0.3, 0.7, 0.3],
                        transition: { duration: 2, repeat: Infinity }
                      }}
                    />
                  )}
                </motion.div>
                <div className="flex-1">
                  <motion.p 
                    className="text-sm font-medium"
                    animate={step.status === 'processing' ? {
                      color: ['#3b82f6', '#1d4ed8', '#3b82f6'],
                      transition: { duration: 2, repeat: Infinity }
                    } : {}}
                  >
                    {step.name}
                  </motion.p>
                  {step.status === 'processing' && step.progress !== undefined && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Progress value={step.progress} className="mt-2 h-2" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Reels */}
      <AnimatePresence>
        {generatedReels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Generated Reels
              </CardTitle>
              <Badge variant="secondary" className="px-3 py-1">
                {generatedReels.length} reels created
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedReels.map((reel: any, index: number) => (
                <motion.div
                  key={reel.id || index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -8, 
                    transition: { duration: 0.2 }
                  }}
                  className="group"
                >
                  <Card className="overflow-hidden border-2 group-hover:border-primary/20 transition-all duration-300 group-hover:shadow-xl">
                    <motion.div 
                      className="aspect-[9/16] bg-muted relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <video
                        src={reel.downloadUrl || reel}
                        controls
                        className="w-full h-full object-cover"
                        poster="/api/placeholder/200/355"
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <Badge className="absolute top-2 right-2 bg-black/80 text-white">
                          {reel.duration || 30}s
                        </Badge>
                      </motion.div>
                      
                      {/* Cool overlay effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                    
                    <CardContent className="p-4">
                      {reel.keywords && (
                        <motion.div 
                          className="flex flex-wrap gap-1 mb-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                        >
                          {reel.keywords.slice(0, 3).map((keyword: string, i: number) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + i * 0.1 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              <Badge variant="outline" className="text-xs border-primary/20 hover:border-primary/40 transition-colors">
                                <Tag className="mr-1 h-3 w-3" />
                                {keyword}
                              </Badge>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                      
                      {reel.transcript && (
                        <motion.p 
                          className="text-sm text-muted-foreground mb-3 line-clamp-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                        >
                          {reel.transcript}
                        </motion.p>
                      )}

                      <motion.div 
                        className="flex gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                      >
                        <motion.div
                          className="flex-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            size="sm"
                            onClick={() => {
                              window.open(reel.downloadUrl || reel, '_blank');
                              toast({
                                title: "📥 Download Started",
                                description: `Downloading ${reel.filename}...`,
                                variant: "success",
                              });
                            }}
                            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button variant="outline" size="sm" className="hover:bg-primary/10">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  generatedReels.forEach((reel: any, index: number) => {
                    const link = document.createElement('a');
                    link.href = reel.downloadUrl || reel;
                    link.download = `ai_reel_${index + 1}.mp4`;
                    link.click();
                  });
                  toast({
                    title: "📦 Bulk Download Started",
                    description: `Downloading all ${generatedReels.length} Instagram reels...`,
                    variant: "success",
                  });
                }}
                className="px-8"
              >
                <Download className="mr-2 h-4 w-4" />
                Download All Reels
              </Button>
            </div>
          </CardContent>
        </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}