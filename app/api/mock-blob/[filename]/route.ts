import { NextRequest, NextResponse } from 'next/server';
import { LocalVideoProcessor } from '@/lib/local-video-processor';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    // Await the params - this matches the Next.js 15 format
    const { filename } = await context.params;
    
    console.log(`🎭 Mock blob request for: ${filename}`);
    
    // In development mode, serve files from temp directory
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }

    const localProcessor = new LocalVideoProcessor();
    const tempDir = localProcessor.getTempDirectory();
    const filePath = path.join(tempDir, filename);
    
    console.log(`🔍 Looking for file at: ${filePath}`);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error('❌ File not found:', filePath);

      // If it's an mp4, generate a blank video and return base64
      if (path.extname(filename).toLowerCase() === '.mp4') {
        try {
          const base64Mp4 = await localProcessor.generateMp4Base64(5, 1080, 1920); // 5s blank video
          return NextResponse.json({
            success: true,
            filename,
            base64: base64Mp4,
            contentType: 'video/mp4',
            note: 'Generated blank MP4 as fallback'
          });
        } catch (err) {
          return NextResponse.json({
            success: false,
            error: 'Failed to generate fallback MP4',
            details: err instanceof Error ? err.message : String(err)
          }, { status: 500 });
        }
      }

      // List available files for debugging
      const availableFiles = localProcessor.listDownloadedFiles();
      
      // Return JSON with error and available files
      return NextResponse.json({
        success: false,
        message: 'Mock blob file not found',
        filename,
        error: 'File not found',
        availableFiles,
        tempDirectory: tempDir,
        note: 'This is a development mock blob endpoint'
      }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileStats = fs.statSync(filePath);
    
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.srt') contentType = 'text/plain';
    else if (ext === '.json') contentType = 'application/json';

    console.log(`✅ Serving mock blob: ${filename} (${fileStats.size} bytes, ${contentType})`);

    // Return the file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileStats.size.toString(),
      },
    });
    
  } catch (error) {
    console.error('❌ Mock blob error:', error);
    return NextResponse.json(
      { 
        error: 'Mock blob endpoint error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}