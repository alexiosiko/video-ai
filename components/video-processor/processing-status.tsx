"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

import { ProcessingStep } from "./types";

interface ProcessingStatusProps {
  processingSteps: ProcessingStep[];
}

export function ProcessingStatus({ processingSteps }: ProcessingStatusProps) {
  if (processingSteps.length === 0) return null;

  return (
    <AnimatePresence>
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
    </AnimatePresence>
  );
}

export type { ProcessingStep };