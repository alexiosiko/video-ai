import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string; filename: string }> }
) {
  try {
    // Await the params - this is crucial for Next.js 15
    const { sessionId, filename } = await context.params;
    
    console.log(`📥 Download request for session: ${sessionId}, file: ${filename}`);
    
    // In a serverless environment, files are stored in cloud storage (Vercel Blob)
    // The actual download URLs are returned in the processing response
    // This endpoint serves as a redirect/proxy to the actual blob storage
    
    // For the serverless architecture, return information about the file
    return NextResponse.json({
      success: true,
      message: 'Serverless SaaS Mode - Files are stored in cloud storage',
      sessionId,
      filename,
      info: {
        note: 'In production, this would redirect to the actual blob storage URL or stream the file',
        architecture: 'Serverless with Vercel Blob Storage',
        downloadMethod: 'Direct blob URL or streaming proxy'
      },
      mockBlobUrl: `https://blob.vercel-storage.com/processed/${sessionId}/${filename}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in download endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Download endpoint error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}