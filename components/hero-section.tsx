"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Video, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const scrollToProcessor = () => {
    const element = document.getElementById('video-processor');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px]" />
      
      {/* Floating Orbs */}
      <motion.div 
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div 
        className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-violet-400/20 to-cyan-400/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      {/* Main gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 blur-3xl" />
      
      <div className="container relative mx-auto px-4 pt-20 pb-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Video Creation
          </Badge>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Transform{" "}
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            YouTube videos
          </span>
          <br />
          into{" "}
          <span className="bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            viral reels
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          AI-powered highlight detection finds the most engaging moments. 
          Dynamic subtitles keep viewers hooked. Professional results in minutes.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button 
            size="lg" 
            className="h-12 px-8 text-base font-medium transform transition-transform hover:scale-105"
            onClick={scrollToProcessor}
          >
            Start Creating
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 text-base transform transition-transform hover:scale-105">
            Watch Demo
            <Video className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { icon: Zap, value: "10x", label: "Faster than manual editing", color: "bg-primary/10", iconColor: "text-primary" },
            { icon: Sparkles, value: "95%", label: "AI accuracy rate", color: "bg-violet-100 dark:bg-violet-900/30", iconColor: "text-violet-600" },
            { icon: Video, value: "1M+", label: "Reels created", color: "bg-orange-100 dark:bg-orange-900/30", iconColor: "text-orange-600" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${stat.color}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}