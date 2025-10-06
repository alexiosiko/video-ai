import { NextRequest, NextResponse } from 'next/server';
import { LocalVideoProcessor } from '@/lib/local-video-processor';

export async function GET() {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }

    const localProcessor = new LocalVideoProcessor();
    const files = localProcessor.listDownloadedFiles();
    const tempDir = localProcessor.getTempDirectory();

    return NextResponse.json({
      success: true,
      mode: 'development',
      tempDirectory: tempDir,
      availableFiles: files.length,
      files: files.map(filename => ({
        filename,
        downloadUrl: `/api/local-download/${filename}`,
        created: new Date().toISOString() // We could get actual file stats here
      })),
      info: {
        note: 'This shows files available for download in local development mode',
        totalFiles: files.length,
        directoryPath: tempDir,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error getting local files:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get local files', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }

    const localProcessor = new LocalVideoProcessor();
    localProcessor.clearTempFiles();

    return NextResponse.json({
      success: true,
      message: 'Temp files cleared successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error clearing temp files:', error);
    return NextResponse.json(
      { 
        error: 'Failed to clear temp files', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}