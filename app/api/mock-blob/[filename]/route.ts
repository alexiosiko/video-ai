import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    console.log(`🎭 Mock blob request for: ${filename}`);
    
    // Return mock video file info for development
    return NextResponse.json({
      success: true,
      message: 'Mock blob storage for development',
      filename,
      url: `https://localhost:3001/api/mock-blob/${filename}`,
      note: 'This is a development mock. In production, this would be a real video file from Vercel Blob Storage.',
      mockData: {
        size: '25.4 MB',
        duration: '30 seconds',
        format: 'MP4',
        resolution: '1080x1920 (Instagram Reel format)'
      },
      downloadInfo: {
        message: 'In production, this URL would stream or download the actual processed video file',
        contentType: 'video/mp4',
        access: 'public'
      }
    });
  } catch (error) {
    console.error('Mock blob error:', error);
    return NextResponse.json(
      { error: 'Mock blob endpoint error' },
      { status: 500 }
    );
  }
}