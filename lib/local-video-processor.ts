import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

export interface LocalVideoSegment {
  id: string;
  start: number;
  duration: number;
  transcript: string;
  keywords: string[];
  videoUrl: string;
}

export interface LocalProcessedClip {
  id: string;
  filePath: string;
  downloadUrl: string;
  filename: string;
  duration: number;
  transcript: string;
  keywords: string[];
}

export class LocalVideoProcessor {
  private tempDir: string;

  constructor() {
    // Create temp directory for local development
    this.tempDir = path.join(os.tmpdir(), 'video-ai-downloads');
    this.ensureTempDir();
  }

  private ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
      console.log(`📁 Created temp directory: ${this.tempDir}`);
    }
  }

  async processClipsLocally(segments: LocalVideoSegment[]): Promise<LocalProcessedClip[]> {
    console.log(`🎬 Processing ${segments.length} video clips locally...`);
    
    const processedClips: LocalProcessedClip[] = [];
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      console.log(`✂️ Processing clip ${i + 1}/${segments.length}...`);
      
      try {
        const processedClip = await this.processIndividualClipLocally(segment);
        processedClips.push(processedClip);
        console.log(`✅ Clip ${i + 1} processed successfully`);
      } catch (error) {
        console.error(`❌ Failed to process clip ${i + 1}:`, error);
        // Create a mock file for failed clips
        const mockClip = await this.createMockClip(segment);
        processedClips.push(mockClip);
      }
    }
    
    return processedClips;
  }

  private async processIndividualClipLocally(segment: LocalVideoSegment): Promise<LocalProcessedClip> {
    console.log(`🔄 Processing clip ${segment.id} locally...`);
    
    const filename = `local_reel_${segment.id}_${Date.now()}.mp4`;
    const filePath = path.join(this.tempDir, filename);
    
    // Check if ffmpeg is available for actual video processing
    try {
      execSync('ffmpeg -version', { stdio: 'ignore' });
      console.log('🎥 FFmpeg detected - attempting real video processing...');
      
      // If we have ffmpeg, we could actually process the video
      // For now, we'll create a sample video file
      await this.createSampleVideo(filePath, segment.duration);
      
    } catch (error) {
      console.log('⚠️ FFmpeg not available - creating mock video file...');
      await this.createMockVideoFile(filePath, segment);
    }
    
    const downloadUrl = `/api/local-download/${filename}`;
    
    return {
      id: segment.id,
      filePath,
      downloadUrl,
      filename,
      duration: segment.duration,
      transcript: segment.transcript,
      keywords: segment.keywords,
    };
  }

  private async createMockClip(segment: LocalVideoSegment): Promise<LocalProcessedClip> {
    const filename = `mock_reel_${segment.id}_${Date.now()}.json`;
    const filePath = path.join(this.tempDir, filename);
    
    // Create a JSON file with clip information instead of video
    const clipData = {
      id: segment.id,
      type: 'mock_video_clip',
      duration: segment.duration,
      transcript: segment.transcript,
      keywords: segment.keywords,
      note: 'This is a mock file for development. In production, this would be an actual video file.',
      originalVideoUrl: segment.videoUrl,
      timestamp: new Date().toISOString(),
    };
    
    fs.writeFileSync(filePath, JSON.stringify(clipData, null, 2));
    
    const downloadUrl = `/api/local-download/${filename}`;
    
    return {
      id: segment.id,
      filePath,
      downloadUrl,
      filename,
      duration: segment.duration,
      transcript: segment.transcript,
      keywords: segment.keywords,
    };
  }

  private async createSampleVideo(filePath: string, duration: number): Promise<void> {
    try {
      // Create a simple color video with duration using ffmpeg
      const command = `ffmpeg -f lavfi -i color=c=blue:size=1080x1920:duration=${duration} -c:v libx264 -t ${duration} -pix_fmt yuv420p -y "${filePath}"`;
      execSync(command, { stdio: 'ignore' });
      console.log(`✅ Created sample video: ${filePath}`);
    } catch (error) {
      console.log('⚠️ Failed to create sample video, falling back to mock file...');
      await this.createMockVideoFile(filePath, { duration } as LocalVideoSegment);
    }
  }

  private async createMockVideoFile(filePath: string, segment: Partial<LocalVideoSegment>): Promise<void> {
    // Create a mock MP4 file (just a text file with .mp4 extension for demo)
    const mockContent = `
# Mock Video File for Development
ID: ${segment.id || 'unknown'}
Duration: ${segment.duration || 0} seconds
Transcript: ${segment.transcript || 'No transcript'}
Keywords: ${segment.keywords?.join(', ') || 'None'}

This is a mock video file created for local development.
In a production environment, this would be an actual MP4 video file.

To enable real video processing, install FFmpeg:
- Windows: Download from https://ffmpeg.org/download.html
- macOS: brew install ffmpeg  
- Linux: sudo apt install ffmpeg

Created: ${new Date().toISOString()}
`;
    
    fs.writeFileSync(filePath, mockContent);
    console.log(`📝 Created mock video file: ${filePath}`);
  }

  async generateSubtitleFile(
    segments: Array<{ start: number; end: number; text: string }>,
    filename: string
  ): Promise<string> {
    const srtContent = segments
      .map((segment, index) => {
        const start = this.formatTime(segment.start);
        const end = this.formatTime(segment.end);
        return `${index + 1}\n${start} --> ${end}\n${segment.text}\n`;
      })
      .join('\n');

    const filePath = path.join(this.tempDir, filename);
    fs.writeFileSync(filePath, srtContent, 'utf-8');
    
    console.log(`📝 Created subtitle file: ${filePath}`);
    return `/api/local-download/${filename}`;
  }

  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms
      .toString()
      .padStart(3, '0')}`;
  }

  getTempDirectory(): string {
    return this.tempDir;
  }

  listDownloadedFiles(): string[] {
    try {
      return fs.readdirSync(this.tempDir);
    } catch (error) {
      console.error('Error listing downloaded files:', error);
      return [];
    }
  }

  clearTempFiles(): void {
    try {
      const files = fs.readdirSync(this.tempDir);
      files.forEach(file => {
        const filePath = path.join(this.tempDir, file);
        fs.unlinkSync(filePath);
      });
      console.log(`🧹 Cleared ${files.length} temp files`);
    } catch (error) {
      console.error('Error clearing temp files:', error);
    }
  }
}