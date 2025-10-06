# Local Development Downloads

## Overview
In development mode, the AI Video Processor creates downloadable files locally instead of using cloud storage. This allows you to test and download the actual generated content during development.

## How It Works

### 1. File Processing
When you process a YouTube video in development mode:
- Files are stored in your system's temp directory: `{temp}/video-ai-downloads/`
- Each processing session creates downloadable files
- Both video files and subtitle files are generated

### 2. File Types Generated
- **Video Files**: `.mp4` files (mock files or actual video if FFmpeg is installed)
- **Subtitle Files**: `.srt` files with generated subtitles
- **Metadata Files**: `.json` files with processing information

### 3. Local Download Endpoints
- **`/api/local-download/[filename]`** - Download individual files
- **`/api/local-files`** - List all available files (GET) or clear all files (DELETE)

## Using the System

### Processing Videos
1. Enter a YouTube URL in the video processor
2. Configure your settings (clip duration, number of reels, subtitle style)  
3. Click "Generate AI Reels"
4. Wait for processing to complete

### Downloading Files
1. **Individual Downloads**: Click download buttons on each generated reel
2. **View All Files**: Click "Local Files" button to see all available downloads
3. **Bulk Downloads**: Use the "Download All" button
4. **Clear Files**: Use "Clear All" in the Local Files section to clean up

## Development vs Production

### Development Mode (Current)
- ✅ Files stored locally in temp directory
- ✅ Instant downloads available
- ✅ No cloud storage costs
- ⚠️ Mock video files (unless FFmpeg installed)
- ⚠️ Files cleared when temp directory is cleaned

### Production Mode (Deployed)
- ✅ Real video processing with cloud services
- ✅ Actual video clips with subtitles embedded
- ✅ Cloud storage with CDN delivery
- ✅ Persistent file storage
- 💰 Requires cloud storage and processing costs

## Installing FFmpeg (Optional)
For real video processing in development:

### Windows
1. Download from https://ffmpeg.org/download.html
2. Extract and add to PATH
3. Restart terminal/IDE

### macOS
```bash
brew install ffmpeg
```

### Linux
```bash
sudo apt install ffmpeg
```

After installing FFmpeg, the system will create actual video files instead of mock files.

## File Locations

### Temp Directory Location
- **Windows**: `C:\\Users\\{username}\\AppData\\Local\\Temp\\video-ai-downloads\\`
- **macOS**: `/tmp/video-ai-downloads/`
- **Linux**: `/tmp/video-ai-downloads/`

### Accessing Files Directly
You can also access the files directly from the temp directory using your file manager or terminal.

## API Endpoints

### GET `/api/local-files`
Returns list of all available local files:
```json
{
  "success": true,
  "availableFiles": 5,
  "files": [
    {
      "filename": "local_reel_abc123.mp4",
      "downloadUrl": "/api/local-download/local_reel_abc123.mp4"
    }
  ]
}
```

### GET `/api/local-download/[filename]`
Downloads a specific file with proper headers and content type.

### DELETE `/api/local-files`
Clears all temporary files from the download directory.

## Troubleshooting

### No Files Generated
- Check that processing completed successfully
- Look for errors in the console
- Verify temp directory permissions

### Download Links Not Working
- Ensure you're in development mode
- Check that files exist in temp directory
- Verify API endpoints are running

### Files Not Clearing
- Use the "Clear All" button in Local Files section
- Or manually delete from temp directory
- Restart the development server if needed

## Security Note
The local download endpoints are only available in development mode and will return 403 errors in production for security.