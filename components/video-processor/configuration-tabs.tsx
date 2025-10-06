"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Zap, Palette, Settings, Volume2 } from "lucide-react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormData } from "./types";

interface ConfigurationTabsProps {
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  isProcessing: boolean;
}

export function ConfigurationTabs({ watch, setValue, isProcessing }: ConfigurationTabsProps) {
  return (
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
  );
}