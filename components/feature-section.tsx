"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Scissors, 
  Type, 
  Smartphone, 
  Zap, 
  Shield,
  Clock,
  TrendingUp,
  Palette
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "AI Content Analysis",
    description: "Advanced AI analyzes your video to identify the most engaging moments, viral-worthy clips, and peak engagement points.",
    badge: "AI-Powered",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30"
  },
  {
    icon: Scissors,
    title: "Smart Video Editing",
    description: "Automatically extract, resize, and optimize clips for Instagram Reels format (9:16 aspect ratio) with professional quality.",
    badge: "Automated",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30"
  },
  {
    icon: Type,
    title: "Dynamic Subtitles",
    description: "Generate eye-catching subtitles with multiple styles: Modern, Bold & Chunky, Neon Glow, and Classic designs.",
    badge: "Customizable",
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30"
  },
  {
    icon: Smartphone,
    title: "Mobile-Optimized",
    description: "Perfect 9:16 aspect ratio, optimized file sizes, and mobile-friendly formatting for seamless social media sharing.",
    badge: "Mobile-First",
    color: "text-pink-600",
    bgColor: "bg-pink-100 dark:bg-pink-900/30"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process videos 10x faster than manual editing. Generate multiple reels from a single video in minutes, not hours.",
    badge: "High Performance",
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30"
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "Secure processing, batch operations, and scalable infrastructure designed for professional content creators.",
    badge: "Secure",
    color: "text-teal-600",
    bgColor: "bg-teal-100 dark:bg-teal-900/30"
  }
];

const stats = [
  {
    icon: TrendingUp,
    value: "95%",
    label: "Accuracy Rate",
    description: "AI highlight detection"
  },
  {
    icon: Clock,
    value: "2 min",
    label: "Average Time",
    description: "From upload to download"
  },
  {
    icon: Palette,
    value: "4+",
    label: "Subtitle Styles",
    description: "Professional designs"
  }
];

export function FeatureSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            ✨ Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need to create{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              viral content
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools and professional video editing capabilities, all in one platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/20 border-2 border-transparent">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-card rounded-2xl border p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">
            Ready to create viral content?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of content creators who are already using AI to grow their social media presence.
          </p>
        </div>
      </div>
    </section>
  );
}