import { NextRequest, NextResponse } from 'next/server';
import { LocalVideoProcessor } from '@/lib/local-video-processor';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    // Await the params
    const { filename } = await context.params;
    
    console.log('📥 Local download request for:', filename);
    
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
    
    if (!fs.existsSync(filePath)) {
      console.error('❌ File not found:', filePath);
      // List available files for debugging
      const availableFiles = localProcessor.listDownloadedFiles();
      
      return NextResponse.json(
        { error: 'File not found', requestedFile: filename, availableFiles },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileStats = fs.statSync(filePath);
    
    // Determine content type
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.srt') contentType = 'text/plain';
    else if (ext === '.json') contentType = 'application/json';

    console.log(`✅ Serving file: ${filename} (${fileStats.size} bytes, ${contentType})`);

    // Return the file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileStats.size.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Error serving file:', error);
    return NextResponse.json(
      { error: 'Failed to serve file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// This is the code block that represents the suggested code change:
// {
//   "scripts": {
//     "build": "next build --no-lint",
//     // other scripts...
//   }
// }