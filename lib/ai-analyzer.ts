import OpenAI from 'openai';

export interface Highlight {
  start: number;
  end: number;
  score: number;
  keywords: string[];
  transcript: string;
  reason: string;
}

export interface AnalysisResult {
  highlights: Highlight[];
  summary: string;
  viralPotential: number;
}

export class AIContentAnalyzer {
  private openai: OpenAI;

  constructor(apiKey?: string) {
    if (!apiKey) {
      console.warn('OpenAI API key not provided, using mock analysis');
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey || 'mock-key',
    });
  }

  async analyzeContent(
    videoInfo: any,
    transcript: string[],
    videoDuration: number
  ): Promise<AnalysisResult> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return this.getMockAnalysis(videoInfo, transcript, videoDuration);
      }

      const prompt = this.buildAnalysisPrompt(videoInfo, transcript);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert social media content analyzer. Your job is to identify the most engaging and viral-worthy segments from video content that would work well as Instagram Reels."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;
      return this.parseAnalysisResponse(response, videoDuration);

    } catch (error) {
      console.error('AI analysis failed:', error);
      return this.getMockAnalysis(videoInfo, transcript, videoDuration);
    }
  }

  private buildAnalysisPrompt(videoInfo: any, transcript: string[]): string {
    return `
    Analyze this video content for the best Instagram Reel segments:

    Video Title: ${videoInfo.title}
    Video Duration: ${videoInfo.duration} seconds
    Description: ${videoInfo.description.substring(0, 500)}...

    Transcript segments:
    ${transcript.map((segment, index) => `${index * 10}s: ${segment}`).join('\n')}

    Please identify the top 5-10 most engaging segments that would make great Instagram Reels. For each segment, provide:

    1. Start time (in seconds)
    2. End time (in seconds) 
    3. Engagement score (1-10)
    4. Keywords that describe the content
    5. Brief transcript summary
    6. Reason why this segment would be viral

    Focus on segments that have:
    - High emotional impact
    - Surprising or unexpected content
    - Clear visual storytelling
    - Quotable moments
    - Educational value
    - Entertainment factor

    Respond in JSON format with an array of segments.
    `;
  }

  private parseAnalysisResponse(response: string | null, videoDuration: number): AnalysisResult {
    try {
      if (!response) throw new Error('No response from AI');
      
      const parsed = JSON.parse(response);
      const highlights = parsed.segments?.map((segment: any) => ({
        start: Math.max(0, segment.start || 0),
        end: Math.min(videoDuration, segment.end || segment.start + 30),
        score: (segment.score || 5) / 10,
        keywords: segment.keywords || ['engaging'],
        transcript: segment.transcript || '',
        reason: segment.reason || 'AI selected for engagement potential',
      })) || [];

      return {
        highlights: highlights.sort((a: Highlight, b: Highlight) => b.score - a.score),
        summary: parsed.summary || 'AI analysis completed',
        viralPotential: parsed.viralPotential || 0.7,
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.getMockAnalysis({ duration: videoDuration }, [], videoDuration);
    }
  }

  private getMockAnalysis(videoInfo: any, transcript: string[], videoDuration: number): AnalysisResult {
    const highlights: Highlight[] = [];
    const segmentCount = Math.min(8, Math.floor(videoDuration / 30));

    for (let i = 0; i < segmentCount; i++) {
      const start = Math.floor((videoDuration / segmentCount) * i);
      const end = Math.min(start + 30, videoDuration);
      
      highlights.push({
        start,
        end,
        score: 0.9 - (i * 0.1), // Decreasing scores
        keywords: this.getMockKeywords(i),
        transcript: transcript[i] || `Engaging content segment at ${start}s`,
        reason: this.getMockReason(i),
      });
    }

    return {
      highlights: highlights.sort((a, b) => b.score - a.score),
      summary: 'Mock analysis - detected multiple engaging segments with high viral potential',
      viralPotential: 0.8,
    };
  }

  private getMockKeywords(index: number): string[] {
    const keywordSets = [
      ['shocking', 'surprising', 'wow'],
      ['funny', 'hilarious', 'comedy'],
      ['educational', 'tutorial', 'howto'],
      ['inspirational', 'motivational', 'uplifting'],
      ['trending', 'viral', 'popular'],
      ['dramatic', 'intense', 'emotional'],
      ['creative', 'artistic', 'unique'],
      ['informative', 'facts', 'knowledge'],
    ];
    
    return keywordSets[index % keywordSets.length];
  }

  private getMockReason(index: number): string {
    const reasons = [
      'High emotional impact with surprising content',
      'Humorous moment likely to be shared',
      'Educational value that provides clear benefit',
      'Inspirational message with broad appeal',
      'Trending topic with viral potential',
      'Dramatic peak that hooks viewers',
      'Creative demonstration with visual appeal',
      'Informative content that answers common questions',
    ];
    
    return reasons[index % reasons.length];
  }

  async generateEngagingTitle(originalTitle: string, segment: Highlight): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      return this.getMockTitle(segment);
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a viral social media content creator. Create engaging, clickable titles for Instagram Reels that will maximize views and engagement."
          },
          {
            role: "user",
            content: `Create a catchy title for this video segment:
            
            Original title: ${originalTitle}
            Segment content: ${segment.transcript}
            Keywords: ${segment.keywords.join(', ')}
            Why it's engaging: ${segment.reason}
            
            Make it short (under 50 characters), engaging, and optimized for social media.`
          }
        ],
        temperature: 0.8,
      });

      return completion.choices[0].message.content?.substring(0, 50) || this.getMockTitle(segment);
    } catch (error) {
      console.error('Title generation failed:', error);
      return this.getMockTitle(segment);
    }
  }

  private getMockTitle(segment: Highlight): string {
    const templates = [
      `${segment.keywords[0].toUpperCase()}! You won't believe this...`,
      `This ${segment.keywords[0]} moment is INSANE`,
      `${segment.keywords[0]} content that went VIRAL`,
      `Wait for it... ${segment.keywords[0]} surprise!`,
      `${segment.keywords[0]} hack everyone needs to see`,
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.substring(0, 50);
  }
}