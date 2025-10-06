import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Test endpoint called');
    
    // Test environment variables
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const nodeEnv = process.env.NODE_ENV;
    
    // Test basic imports
    const ytdl = await import('ytdl-core');
    const uuid = await import('uuid');
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: {
        hasOpenAI,
        nodeEnv,
        ytdlAvailable: typeof ytdl.default.validateURL === 'function',
        uuidAvailable: typeof uuid.v4 === 'function',
      }
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Test POST body:', body);
    
    // Test YouTube URL validation with a simple URL
    const ytdl = await import('ytdl-core');
    const testUrl = body.testUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    
    const isValid = ytdl.default.validateURL(testUrl);
    
    return NextResponse.json({
      success: true,
      testUrl,
      isValidUrl: isValid,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}