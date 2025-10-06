"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Share2, Tag, Folder, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GeneratedReel } from "./types";
import { useState } from "react";

interface GeneratedReelsProps {
  generatedReels: GeneratedReel[];
}

export function GeneratedReels({ generatedReels }: GeneratedReelsProps) {
  const { toast } = useToast();
  const [localFiles, setLocalFiles] = useState<any[]>([]);
  const [showLocalFiles, setShowLocalFiles] = useState(false);

  if (generatedReels.length === 0) return null;

  const handleDownload = (reel: GeneratedReel) => {
    const url = reel.downloadUrl || '#';
    window.open(url, '_blank');
    toast({
      title: "📥 Download Started",
      description: `Downloading ${reel.filename || 'video'}...`,
      variant: "success",
    });
  };

  const handleDownloadAll = () => {
    generatedReels.forEach((reel: GeneratedReel, index: number) => {
      const link = document.createElement('a');
      link.href = reel.downloadUrl || '#';
      link.download = `ai_reel_${index + 1}.mp4`;
      link.click();
    });
    toast({
      title: "📦 Bulk Download Started",
      description: `Downloading all ${generatedReels.length} Instagram reels...`,
      variant: "success",
    });
  };

  const fetchLocalFiles = async () => {
    try {
      const response = await fetch('/api/local-files');
      if (response.ok) {
        const data = await response.json();
        setLocalFiles(data.files || []);
        setShowLocalFiles(true);
        toast({
          title: "📁 Local Files Loaded",
          description: `Found ${data.files?.length || 0} files in development directory.`,
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to load local files.",
        variant: "destructive",
      });
    }
  };

  const clearLocalFiles = async () => {
    try {
      const response = await fetch('/api/local-files', { method: 'DELETE' });
      if (response.ok) {
        setLocalFiles([]);
        toast({
          title: "🧹 Files Cleared",
          description: "All temporary files have been cleared.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to clear local files.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence>
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
              <div className="flex items-center gap-2">
                <Button
                  onClick={fetchLocalFiles}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <Folder className="w-4 h-4 mr-2" />
                  Local Files
                </Button>
                <Badge variant="secondary" className="px-3 py-1">
                  {generatedReels.length} reels created
                </Badge>
              </div>
            </div>
            
            {/* Development Mode Info */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Development Mode</p>
                  <p className="text-amber-700 mt-1">
                    Files are saved locally for development. Click "Local Files" to see all available downloads. 
                    For real video processing, install FFmpeg or deploy to production.
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedReels.map((reel: GeneratedReel, index: number) => (
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
                        src={reel.downloadUrl || '#'}
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
                            onClick={() => handleDownload(reel)}
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
                onClick={handleDownloadAll}
                className="px-8"
              >
                <Download className="mr-2 h-4 w-4" />
                Download All Reels
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Local Files Section */}
        {showLocalFiles && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-blue-500" />
                    Local Development Files
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={clearLocalFiles}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Clear All
                    </Button>
                    <Button
                      onClick={() => setShowLocalFiles(false)}
                      variant="outline"
                      size="sm"
                    >
                      Hide
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {localFiles.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No local files found. Process a video to generate downloadable files.
                  </p>
                ) : (
                  <div className="grid gap-2">
                    {localFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            {file.filename.endsWith('.mp4') ? '🎥' : 
                             file.filename.endsWith('.srt') ? '📝' : '📄'}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{file.filename}</p>
                            <p className="text-xs text-gray-500">
                              Local development file
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            window.open(file.downloadUrl, '_blank');
                            toast({
                              title: "📥 Download Started",
                              description: `Downloading ${file.filename}...`,
                              variant: "success",
                            });
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export type { GeneratedReel };