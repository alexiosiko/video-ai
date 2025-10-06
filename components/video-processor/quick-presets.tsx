"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { PresetConfig } from "./types";

interface QuickPresetsProps {
  isProcessing: boolean;
  onApplyPreset: (preset: keyof typeof presetConfigs) => void;
}

const presetConfigs = {
  viral: { clipDuration: 15, numberOfReels: 5, subtitleStyle: 'bold' as const },
  educational: { clipDuration: 60, numberOfReels: 3, subtitleStyle: 'modern' as const },
  comedy: { clipDuration: 30, numberOfReels: 5, subtitleStyle: 'neon' as const },
  highlights: { clipDuration: 45, numberOfReels: 3, subtitleStyle: 'classic' as const },
};

export function QuickPresets({ isProcessing, onApplyPreset }: QuickPresetsProps) {
  return (
    <motion.div 
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <label className="text-sm font-medium">Quick Presets</label>
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
              onClick={() => onApplyPreset(key as keyof typeof presetConfigs)}
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
  );
}

export { presetConfigs };
export type { PresetConfig };