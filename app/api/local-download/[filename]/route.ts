import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import os from 'os';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    console.log(`📥 Local development download request for file: ${filename}`);
    
    // In development mode, serve files from temp directory
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }

    // Check for temp downloads directory
    const tempDir = path.join(os.tmpdir(), 'video-ai-downloads');
    const filePath = path.join(tempDir, filename);
    
    console.log(`🔍 Looking for file at: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    const stats = fs.statSync(filePath);
    
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.mp4':
        contentType = 'video/mp4';
        break;
      case '.srt':
        contentType = 'text/plain';
        break;
      case '.vtt':
        contentType = 'text/vtt';
        break;
      case '.json':
        contentType = 'application/json';
        break;
    }

    console.log(`✅ Serving file: ${filename} (${stats.size} bytes, ${contentType})`);

    // Return the file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('❌ Error serving local file:', error);
    return NextResponse.json(
      { 
        error: 'Failed to serve file', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}