# AI Reel Creator 🎬✨

Transform YouTube videos into viral Instagram reels with AI-powered highlight detection and dynamic subtitles!

## 🚀 Features

- **YouTube Video Processing**: Download and analyze any YouTube video
- **AI Content Analysis**: Automatically detect the most engaging segments using OpenAI
- **Smart Highlight Detection**: Find viral-worthy moments based on emotional impact and engagement potential
- **Dynamic Subtitle Generation**: Create "juicy" subtitles with multiple styling options:
  - ✨ Modern - Clean and professional
  - 💥 Bold & Chunky - High-impact text with bright colors
  - 🌟 Neon Glow - Eye-catching glowing effects
  - 📝 Classic - Traditional styling
- **Instagram Reel Format**: Automatically resize videos to 9:16 aspect ratio
- **Visual Enhancements**: Apply sharpening, color correction, and effects
- **Batch Processing**: Generate multiple reels from a single video
- **Real-time Progress**: Track processing status with detailed progress indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Video Processing**: FFmpeg, fluent-ffmpeg
- **AI Analysis**: OpenAI GPT-4 for content analysis and subtitle enhancement
- **YouTube Integration**: ytdl-core for video downloading
- **UI Components**: Custom components with Radix UI primitives

## 🏗️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- FFmpeg installed on your system
- OpenAI API key (optional, will use mock data without it)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd video-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Install FFmpeg**
   
   **Windows (with Chocolatey):**
   ```bash
   choco install ffmpeg
   ```
   
   **macOS (with Homebrew):**
   ```bash
   brew install ffmpeg
   ```
   
   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt update
   sudo apt install ffmpeg
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Enter YouTube URL**: Paste any YouTube video URL
2. **Configure Settings**: 
   - Choose clip duration (15s - 90s)
   - Set number of reels to generate (1-10)
   - Select subtitle style
   - Adjust advanced settings (quality, AI sensitivity, etc.)
3. **Process Video**: Click "Create AI Reels" and watch the magic happen
4. **Download Results**: Preview and download your generated reels

## 🎯 Quick Presets

- **🔥 Viral**: Short, punchy clips optimized for maximum engagement
- **🎓 Educational**: Longer clips focusing on informative content
- **😂 Comedy**: Clips that capture funny and entertaining moments
- **✨ Highlights**: The absolute best moments from the video

## 🔧 Advanced Configuration

### Video Quality Options
- **High**: 8000k bitrate - Best quality for professional use
- **Medium**: 4000k bitrate - Balanced quality and file size
- **Low**: 2000k bitrate - Smaller files for quick sharing

### AI Sensitivity Levels
- **High**: Generates more clips, captures subtle moments
- **Medium**: Balanced approach, good for most content
- **Low**: Only the most engaging moments, quality over quantity

### Content Type Detection
- **Auto Detect**: Let AI determine the best approach
- **Educational**: Optimized for tutorials and learning content
- **Entertainment**: Focus on engaging and fun moments
- **Music**: Detect beat drops and musical highlights
- **Sports**: Capture exciting plays and moments
- **Comedy**: Find the funniest segments

## 🏗️ Architecture

### Core Services

- **YouTubeProcessor**: Handles video downloading and metadata extraction
- **AIContentAnalyzer**: Uses OpenAI to analyze content and find highlights
- **VideoEditor**: Processes clips with FFmpeg (extraction, resizing, effects)
- **SubtitleGenerator**: Creates and burns dynamic subtitles into videos

### API Endpoints

- `POST /api/process-video`: Main processing endpoint
- `GET /api/download/[sessionId]/[filename]`: Download processed videos
- `GET /api/placeholder/[width]/[height]`: Generate placeholder images

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Docker

```bash
# Build the image
docker build -t ai-reel-creator .

# Run the container
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key ai-reel-creator
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -am 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 and content analysis capabilities
- FFmpeg team for powerful video processing tools
- Next.js team for the amazing React framework
- YouTube for providing accessible video content

## 🐛 Known Issues

- Large videos (>1GB) may take significant processing time
- Some YouTube videos with restrictions cannot be downloaded
- Subtitle timing may need fine-tuning for certain content types

## 🔮 Roadmap

- [ ] Add support for multiple languages
- [ ] Implement video thumbnail generation
- [ ] Add social media scheduling integration
- [ ] Support for other video platforms (TikTok, Vimeo)
- [ ] Advanced video effects and transitions
- [ ] User accounts and project management
- [ ] Analytics and performance tracking

---

Made with ❤️ for content creators who want to go viral! 🚀
