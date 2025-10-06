import OpenAI from 'openai';
import { put } from '@vercel/blob';

export interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
  enhanced: boolean;
}

export interface SubtitleStyle {
  fontFamily: string;
  fontSize: string;
  color: string;
  backgroundColor: string;
  position: 'top' | 'center' | 'bottom';
  animation: 'none' | 'fade' | 'slide' | 'bounce';
}

export class ServerlessSubtitleGenerator {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generateEnhancedSubtitles(
    transcript: string,
    keywords: string[],
    style: 'modern' | 'bold' | 'neon' | 'classic'
  ): Promise<SubtitleSegment[]> {
    console.log(`🎨 Generating ${style} subtitles with AI enhancement...`);

    try {
      // Enhance transcript with AI to make it more engaging
      const enhancedTranscript = await this.enhanceTranscriptForSocialMedia(transcript, keywords);
      
      // Generate subtitle segments
      const segments = this.createSubtitleSegments(enhancedTranscript);
      
      return segments;
    } catch (error) {
      console.error('Failed to generate enhanced subtitles:', error);
      
      // Fallback to basic subtitles
      return this.createBasicSubtitleSegments(transcript);
    }
  }

  private async enhanceTranscriptForSocialMedia(
    transcript: string,
    keywords: string[]
  ): Promise<string> {
    console.log('🤖 Enhancing transcript with OpenAI...');

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert at creating engaging social media content. Your task is to enhance video transcripts to make them more viral and engaging for Instagram Reels. 

Rules:
1. Keep the core message intact
2. Add engaging hooks and power words
3. Use strategic emojis (max 3 per sentence)
4. Break into short, punchy sentences
5. Add calls to action when appropriate
6. Make it feel conversational and energetic
7. Focus on these keywords: ${keywords.join(', ')}

Format the output as short subtitle-friendly segments separated by "|"`
          },
          {
            role: 'user',
            content: `Enhance this transcript for maximum engagement: "${transcript}"`
          }
        ],
        max_tokens: 500,
        temperature: 0.8,
      });

      const enhanced = response.choices[0]?.message?.content || transcript;
      console.log('✅ Transcript enhanced successfully');
      
      return enhanced;
    } catch (error) {
      console.error('AI enhancement failed:', error);
      return transcript;
    }
  }

  private createSubtitleSegments(text: string): SubtitleSegment[] {
    const segments = text.split('|').filter(segment => segment.trim());
    const segmentDuration = 3; // 3 seconds per segment
    
    return segments.map((segment, index) => ({
      start: index * segmentDuration,
      end: (index + 1) * segmentDuration,
      text: segment.trim(),
      enhanced: true,
    }));
  }

  private createBasicSubtitleSegments(transcript: string): SubtitleSegment[] {
    const words = transcript.split(' ');
    const wordsPerSegment = 5;
    const segments: SubtitleSegment[] = [];
    
    for (let i = 0; i < words.length; i += wordsPerSegment) {
      const segmentWords = words.slice(i, i + wordsPerSegment);
      const start = (i / wordsPerSegment) * 3; // 3 seconds per segment
      const end = start + 3;
      
      segments.push({
        start,
        end,
        text: segmentWords.join(' '),
        enhanced: false,
      });
    }
    
    return segments;
  }

  getSubtitleStyle(styleName: 'modern' | 'bold' | 'neon' | 'classic'): SubtitleStyle {
    const styles: Record<string, SubtitleStyle> = {
      modern: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        color: '#FFFFFF',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'bottom',
        animation: 'fade',
      },
      bold: {
        fontFamily: 'Impact, Arial Black, sans-serif',
        fontSize: '28px',
        color: '#FFFF00',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        position: 'center',
        animation: 'bounce',
      },
      neon: {
        fontFamily: 'Orbitron, monospace',
        fontSize: '26px',
        color: '#00FFFF',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        position: 'bottom',
        animation: 'slide',
      },
      classic: {
        fontFamily: 'Times New Roman, serif',
        fontSize: '22px',
        color: '#FFFFFF',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        position: 'bottom',
        animation: 'none',
      },
    };

    return styles[styleName] || styles.modern;
  }

  async generateSubtitleFile(
    segments: SubtitleSegment[],
    format: 'srt' | 'vtt' | 'ass' = 'srt'
  ): Promise<string> {
    console.log(`📝 Generating ${format.toUpperCase()} subtitle file...`);

    let content = '';

    if (format === 'srt') {
      content = this.generateSRT(segments);
    } else if (format === 'vtt') {
      content = this.generateVTT(segments);
    } else if (format === 'ass') {
      content = this.generateASS(segments);
    }

    // Store subtitle file in blob storage
    const filename = `subtitles_${Date.now()}.${format}`;
    const blob = await put(filename, content, {
      access: 'public',
      contentType: 'text/plain',
    });

    console.log('✅ Subtitle file generated:', blob.url);
    return blob.url;
  }

  private generateSRT(segments: SubtitleSegment[]): string {
    return segments
      .map((segment, index) => {
        const start = this.formatTime(segment.start);
        const end = this.formatTime(segment.end);
        return `${index + 1}\n${start} --> ${end}\n${segment.text}\n`;
      })
      .join('\n');
  }

  private generateVTT(segments: SubtitleSegment[]): string {
    const header = 'WEBVTT\n\n';
    const content = segments
      .map((segment) => {
        const start = this.formatTime(segment.start);
        const end = this.formatTime(segment.end);
        return `${start} --> ${end}\n${segment.text}\n`;
      })
      .join('\n');
    
    return header + content;
  }

  private generateASS(segments: SubtitleSegment[]): string {
    const header = `[Script Info]
Title: AI Generated Subtitles
ScriptType: v4.00+

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,24,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

    const events = segments
      .map((segment) => {
        const start = this.formatTimeASS(segment.start);
        const end = this.formatTimeASS(segment.end);
        return `Dialogue: 0,${start},${end},Default,,0,0,0,,${segment.text}`;
      })
      .join('\n');

    return header + events;
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

  private formatTimeASS(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
      .toFixed(2)
      .padStart(5, '0')}`;
  }

  async processVideoWithSubtitles(
    videoUrl: string,
    segments: SubtitleSegment[],
    style: SubtitleStyle,
    outputFilename: string
  ): Promise<string> {
    console.log('🎬 Processing video with embedded subtitles...');

    // In production, this would:
    // 1. Download video from blob storage
    // 2. Use cloud video processing service (like Remotion Lambda)
    // 3. Embed subtitles with the specified style
    // 4. Upload final video back to blob storage
    // 5. Return the final video URL

    // For now, simulate the process
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock final video URL
    const finalVideoUrl = `https://blob.vercel-storage.com/processed/${outputFilename}`;
    
    console.log('✅ Video with subtitles processed:', finalVideoUrl);
    return finalVideoUrl;
  }
}