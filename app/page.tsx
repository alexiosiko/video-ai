import { HeroSection } from "@/components/hero-section";
import { VideoProcessor } from "@/components/video-processor-modern";
import { FeatureSection } from "@/components/feature-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <div className="container mx-auto px-4 py-16">
        <VideoProcessor />
      </div>
      <FeatureSection />
    </div>
  );
}
