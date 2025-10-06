"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isProcessing: boolean;
}

export function SubmitButton({ isProcessing }: SubmitButtonProps) {
  return (
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
  );
}