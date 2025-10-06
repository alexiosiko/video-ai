import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ServerlessYouTubeProcessor, VideoSegment } from '@/lib/serverless-youtube-processor';
import { ServerlessVideoEditor } from '@/lib/serverless-video-editor';
import { ServerlessSubtitleGenerator } from '@/lib/serverless-subtitle-generator';
import { AIContentAnalyzer } from '@/lib/ai-analyzer';
import { LocalVideoProcessor } from '@/lib/local-video-processor';

interface ProcessVideoRequest {
  youtubeUrl: string;
  clipDuration: number;
  numberOfReels: number;
  subtitleStyle: 'modern' | 'bold' | 'neon' | 'classic';
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Serverless video processing started...');
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not found in environment variables');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body: ProcessVideoRequest = await request.json();
    const { youtubeUrl, clipDuration, numberOfReels, subtitleStyle } = body;
    console.log('📝 Request body:', { youtubeUrl, clipDuration, numberOfReels, subtitleStyle });

    // Create unique session ID
    const sessionId = uuidv4();
    console.log('🆔 Session ID:', sessionId);

    // Initialize processors
    const youtubeProcessor = new ServerlessYouTubeProcessor();
    const videoEditor = new ServerlessVideoEditor();
    const subtitleGenerator = new ServerlessSubtitleGenerator(process.env.OPENAI_API_KEY!);
    const aiAnalyzer = new AIContentAnalyzer(process.env.OPENAI_API_KEY!);
    
    // Initialize local processor for development
    const localProcessor = new LocalVideoProcessor();
    
    // Step 1: Validate YouTube URL
    console.log('🔍 Validating YouTube URL...');
    if (!(await youtubeProcessor.validateUrl(youtubeUrl))) {
      console.error('❌ Invalid YouTube URL:', youtubeUrl);
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Step 2: Get video info
    console.log('📺 Getting video info...');
    const videoInfo = await youtubeProcessor.getVideoInfo(youtubeUrl);
    console.log(`✅ Processing video: "${videoInfo.title}" (${videoInfo.duration}s)`);

    // Step 3: Download video to cloud storage
    console.log('☁️ Downloading video to cloud storage...');
    const { blob, filename } = await youtubeProcessor.downloadVideoToBlob(youtubeUrl);
    const sourceBlobUrl = (blob as any).url;
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    console.log(`✅ Video stored in ${isDevelopment ? 'mock' : 'cloud'} storage:`, sourceBlobUrl);
    
    // Step 4: Get transcript if available
    console.log('📝 Getting video transcript...');
    const transcript = await youtubeProcessor.getVideoTranscript(youtubeUrl);
    console.log('✅ Transcript obtained:', transcript ? 'Yes' : 'Will auto-generate');
    
    // Step 5: Analyze video segments
    console.log('📊 Analyzing video segments...');
    const segments = await youtubeProcessor.analyzeVideoSegments(videoInfo, transcript);
    console.log('✅ Found', segments.length, 'potential segments');

    // Step 6: Use AI to find best highlights
    console.log('🤖 Using AI to find best highlights...');
    const transcriptArray = transcript ? [transcript] : ['Auto-generated transcript will be created'];
    const aiAnalysis = await aiAnalyzer.analyzeContent(videoInfo, transcriptArray, videoInfo.duration);
    
    // Combine AI analysis with segments
    const bestSegments = segments
      .slice(0, numberOfReels)
      .map((segment, index) => ({
        ...segment,
        id: uuidv4(),
        sourceBlobUrl,
        // Enhance with AI analysis if available
        keywords: aiAnalysis.highlights[index]?.keywords || segment.keywords,
        transcript: aiAnalysis.highlights[index]?.transcript || segment.transcript,
      }));

    console.log('✅ Selected', bestSegments.length, 'best segments for processing');

    // Step 7: Process video clips
    console.log('🎬 Processing video clips...');
    
    let processedClips;
    if (isDevelopment) {
      console.log('🏠 Using local development processing...');
      // Convert segments to local format
      const localSegments = bestSegments.map(segment => ({
        id: segment.id,
        start: segment.start,
        duration: segment.duration,
        transcript: segment.transcript,
        keywords: segment.keywords,
        videoUrl: youtubeUrl,
      }));
      
      const localClips = await localProcessor.processClipsLocally(localSegments);
      
      // Convert back to expected format
      processedClips = localClips.map(clip => ({
        id: clip.id,
        blobUrl: clip.downloadUrl, // Use local download URL
        filename: clip.filename,
        duration: clip.duration,
        transcript: clip.transcript,
        keywords: clip.keywords,
      }));
    } else {
      processedClips = await videoEditor.processClips(bestSegments);
    }
    
    console.log('✅ Clips processed successfully');

    // Step 8: Add enhanced subtitles
    console.log('📝 Adding enhanced subtitles...');
    const finalReels = [];

    for (let i = 0; i < processedClips.length; i++) {
      const clip = processedClips[i];
      console.log(`🎨 Processing reel ${i + 1}/${processedClips.length} with ${subtitleStyle} subtitles...`);
      
      try {
        // Generate enhanced subtitles
        const subtitleSegments = await subtitleGenerator.generateEnhancedSubtitles(
          clip.transcript,
          clip.keywords,
          subtitleStyle as any
        );

        // Get subtitle style
        const style = subtitleGenerator.getSubtitleStyle(subtitleStyle as any);

        // Process video with subtitles
        let finalVideoUrl;
        if (isDevelopment) {
          // For development, create subtitle file and keep original video URL
          const subtitleFilename = `subtitles_${clip.id}_${Date.now()}.srt`;
          const subtitleUrl = await localProcessor.generateSubtitleFile(
            subtitleSegments.map(seg => ({
              start: seg.start,
              end: seg.end,
              text: seg.text
            })),
            subtitleFilename
          );
          
          // Return the clip URL (which is already a local download URL)
          finalVideoUrl = clip.blobUrl;
          console.log(`📝 Subtitle file created: ${subtitleUrl}`);
        } else {
          finalVideoUrl = await subtitleGenerator.processVideoWithSubtitles(
            clip.blobUrl,
            subtitleSegments,
            style,
            `final_reel_${clip.id}.mp4`
          );
        }
        
        finalReels.push({
          id: clip.id,
          filename: `final_reel_${clip.id}.mp4`,
          downloadUrl: finalVideoUrl,
          blobUrl: finalVideoUrl,
          duration: clip.duration,
          keywords: clip.keywords,
          transcript: clip.transcript,
          subtitleSegments: subtitleSegments.length,
        });
        
        console.log(`✅ Reel ${i + 1} completed with ${subtitleSegments.length} subtitle segments`);
      } catch (error) {
        console.error(`❌ Failed to process reel ${i + 1}:`, error);
        
        // Fallback to basic processing
        finalReels.push({
          id: clip.id,
          filename: clip.filename,
          downloadUrl: clip.blobUrl,
          blobUrl: clip.blobUrl,
          duration: clip.duration,
          keywords: clip.keywords,
          transcript: clip.transcript,
          subtitleSegments: 0,
        });
      }
    }

    console.log('🎉 All reels processed successfully!');

    // Return the processed reels
    return NextResponse.json({
      success: true,
      sessionId,
      videoTitle: videoInfo.title,
      originalDuration: videoInfo.duration,
      clipsGenerated: finalReels.length,
      processing: {
        environment: isDevelopment ? 'development' : 'production',
        cloudStorage: !isDevelopment,
        mockStorage: isDevelopment,
        aiEnhanced: true,
        serverless: true,
      },
      reels: finalReels.map(reel => ({
        id: reel.id,
        filename: reel.filename,
        downloadUrl: reel.downloadUrl,
        duration: reel.duration,
        keywords: reel.keywords,
        transcript: reel.transcript,
        subtitleSegments: reel.subtitleSegments,
      })),
      developmentNote: isDevelopment ? 'Running in development mode with mock video processing. Deploy to Vercel for full production features.' : undefined,
    });

  } catch (error) {
    console.error('❌ Error processing video:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        error: 'Failed to process video',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}