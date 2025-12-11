import { GoogleGenerativeAI } from '@google/generative-ai';

interface GenerateContentParams {
    topic: string;
    platforms: string[];
    tone?: string;
    brandVoice?: string;
}

interface GeneratedContent {
    caption: string;
    hashtags: string[];
}

export class AgentService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey && apiKey !== 'your-gemini-api-key-here') {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        }
    }

    /**
     * Tool 1: Generate Caption
     * Gemini se topic ke basis par engaging caption generate karta hai
     */
    async generateCaption(topic: string, platform: string, tone: string = 'professional'): Promise<string> {
        if (!this.model) {
            return this.getMockCaption(topic, platform);
        }

        const prompt = `You are a social media expert. Generate an engaging ${platform} post caption for the following topic:

Topic: ${topic}
Tone: ${tone}
Platform: ${platform}

Requirements:
- Make it engaging and shareable
- Use appropriate length for ${platform} (Twitter: concise, Instagram: can be longer)
- Include a call to action if appropriate
- Add 1-2 relevant emojis
- Do NOT include hashtags (they'll be added separately)

Return ONLY the caption text, nothing else.`;

        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            console.error('Gemini caption error:', error);
            return this.getMockCaption(topic, platform);
        }
    }

    /**
     * Tool 2: Generate Hashtags
     * Topic aur platform ke liye relevant hashtags generate karta hai
     */
    async generateHashtags(topic: string, platform: string, count: number = 5): Promise<string[]> {
        if (!this.model) {
            return this.getMockHashtags(topic);
        }

        const prompt = `Generate ${count} relevant and trending hashtags for a ${platform} post about:

Topic: ${topic}

Requirements:
- Mix of popular and niche hashtags
- Relevant to the topic
- ${platform === 'instagram' ? 'Can include up to 30 hashtags' : 'Keep it to 3-5 hashtags'}
- Return ONLY hashtags, one per line, including the # symbol`;

        try {
            const result = await this.model.generateContent(prompt);
            const text = result.response.text();
            const hashtags = text
                .split('\n')
                .map(h => h.trim())
                .filter(h => h.startsWith('#'))
                .slice(0, count);
            return hashtags.length > 0 ? hashtags : this.getMockHashtags(topic);
        } catch (error) {
            console.error('Gemini hashtags error:', error);
            return this.getMockHashtags(topic);
        }
    }

    /**
     * Tool 3: Analyze Image
     * Gemini Vision se image ka analysis karta hai
     */
    async analyzeImage(imageBase64: string, mimeType: string): Promise<string> {
        if (!this.model) {
            return 'A professional image suitable for social media posting.';
        }

        try {
            const result = await this.model.generateContent([
                'Describe this image in detail for a social media post. Focus on key elements, mood, colors, and suggest how it could be used in marketing.',
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType
                    }
                }
            ]);
            return result.response.text().trim();
        } catch (error) {
            console.error('Gemini image analysis error:', error);
            return 'A professional image suitable for social media posting.';
        }
    }

    /**
     * Main generate content function
     * Topic ke basis par caption aur hashtags generate karta hai
     */
    async generateContent(params: GenerateContentParams): Promise<GeneratedContent> {
        const { topic, platforms, tone = 'professional' } = params;
        const primaryPlatform = platforms[0] || 'instagram';

        const [caption, hashtags] = await Promise.all([
            this.generateCaption(topic, primaryPlatform, tone),
            this.generateHashtags(topic, primaryPlatform)
        ]);

        return { caption, hashtags };
    }

    /**
     * Tool 4: Create Draft
     * AI content + media = complete draft
     */
    async createDraft(topic: string, platforms: string[], mediaUrls: string[] = []): Promise<GeneratedContent & { mediaUrls: string[] }> {
        const content = await this.generateContent({ topic, platforms });
        return {
            ...content,
            mediaUrls
        };
    }

    // Mock responses when API key is not set
    private getMockCaption(topic: string, platform: string): string {
        const captions: Record<string, string> = {
            instagram: `Exciting news! 🚀 We've just launched our new ${topic}. It's never been easier to create engaging content at scale. What do you think? Drop a comment below! 👇`,
            twitter: `Big announcement! 🎉 Introducing ${topic}. The future of content creation is here. #Innovation`,
            linkedin: `I'm thrilled to share that we've launched ${topic}. This represents a significant milestone in our journey to help businesses create impactful content. Here's what makes it special...`
        };
        return captions[platform] || captions.instagram;
    }

    private getMockHashtags(topic: string): string[] {
        const words = topic.toLowerCase().split(' ').filter(w => w.length > 3);
        const baseHashtags = ['#AI', '#Innovation', '#Technology', '#ContentCreation', '#SocialMedia'];
        const topicHashtags = words.slice(0, 2).map(w => `#${w.charAt(0).toUpperCase() + w.slice(1)}`);
        return [...topicHashtags, ...baseHashtags].slice(0, 5);
    }
}
