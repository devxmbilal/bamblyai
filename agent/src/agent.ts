import { GoogleGenerativeAI, FunctionDeclarationsTool, FunctionCallingMode, SchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Social Media Agent
 * 
 * Ye agent Gemini AI use karta hai ReAct pattern ke saath
 * jo step-by-step sochta hai aur tools call karta hai
 */
export class SocialMediaAgent {
    private genAI: GoogleGenerativeAI;
    private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

    // Agent ke tools ka declaration
    private tools: FunctionDeclarationsTool[] = [
        {
            functionDeclarations: [
                {
                    name: 'generateCaption',
                    description: 'Generate an engaging social media caption for a given topic',
                    parameters: {
                        type: SchemaType.OBJECT,
                        properties: {
                            topic: {
                                type: SchemaType.STRING,
                                description: 'The topic or theme for the caption'
                            },
                            platform: {
                                type: SchemaType.STRING,
                                enum: ['instagram', 'twitter', 'linkedin'],
                                description: 'Target social media platform'
                            },
                            tone: {
                                type: SchemaType.STRING,
                                enum: ['professional', 'casual', 'witty', 'inspiring'],
                                description: 'Desired tone of the caption'
                            }
                        },
                        required: ['topic', 'platform']
                    }
                },
                {
                    name: 'generateHashtags',
                    description: 'Generate relevant hashtags for a social media post',
                    parameters: {
                        type: SchemaType.OBJECT,
                        properties: {
                            topic: {
                                type: SchemaType.STRING,
                                description: 'The topic for hashtag generation'
                            },
                            count: {
                                type: SchemaType.NUMBER,
                                description: 'Number of hashtags to generate'
                            }
                        },
                        required: ['topic']
                    }
                },
                {
                    name: 'analyzeImage',
                    description: 'Analyze an image and provide description for social media',
                    parameters: {
                        type: SchemaType.OBJECT,
                        properties: {
                            imageUrl: {
                                type: SchemaType.STRING,
                                description: 'URL or path of the image to analyze'
                            }
                        },
                        required: ['imageUrl']
                    }
                },
                {
                    name: 'createDraft',
                    description: 'Create a draft post with all generated content',
                    parameters: {
                        type: SchemaType.OBJECT,
                        properties: {
                            caption: {
                                type: SchemaType.STRING,
                                description: 'The post caption'
                            },
                            hashtags: {
                                type: SchemaType.ARRAY,
                                items: { type: SchemaType.STRING },
                                description: 'List of hashtags'
                            },
                            platform: {
                                type: SchemaType.STRING,
                                description: 'Target platform'
                            }
                        },
                        required: ['caption', 'platform']
                    }
                },
                {
                    name: 'schedulePost',
                    description: 'Schedule a post for future publishing',
                    parameters: {
                        type: SchemaType.OBJECT,
                        properties: {
                            postId: {
                                type: SchemaType.STRING,
                                description: 'The draft post ID to schedule'
                            },
                            scheduledTime: {
                                type: SchemaType.STRING,
                                description: 'ISO datetime string for scheduling'
                            }
                        },
                        required: ['postId', 'scheduledTime']
                    }
                },
                {
                    name: 'publishPost',
                    description: 'Publish a post immediately to the platform',
                    parameters: {
                        type: SchemaType.OBJECT,
                        properties: {
                            postId: {
                                type: SchemaType.STRING,
                                description: 'The post ID to publish'
                            },
                            platform: {
                                type: SchemaType.STRING,
                                description: 'Target platform'
                            }
                        },
                        required: ['postId', 'platform']
                    }
                }
            ]
        }
    ];

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is required');
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            tools: this.tools,
            toolConfig: {
                functionCallingConfig: {
                    mode: FunctionCallingMode.AUTO
                }
            }
        });
    }

    /**
     * ReAct Pattern: Agent sochta hai aur tools call karta hai
     */
    async process(userRequest: string): Promise<{
        thought: string;
        actions: Array<{ tool: string; args: Record<string, unknown>; result: unknown }>;
        finalResponse: string;
    }> {
        const systemPrompt = `You are a Social Media Content Creation Agent. 

Your job is to help users create engaging social media content.

When given a request, think step by step:
1. Understand what the user wants
2. Decide which tools to use
3. Execute the tools in order
4. Provide the final result

Available tools:
- generateCaption: Create engaging captions
- generateHashtags: Generate relevant hashtags
- analyzeImage: Analyze images for descriptions
- createDraft: Save content as draft
- schedulePost: Schedule for later
- publishPost: Publish immediately

Always provide helpful, engaging content.`;

        const chat = this.model.startChat({
            history: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'model', parts: [{ text: 'Understood! I am ready to help create social media content.' }] }
            ]
        });

        const actions: Array<{ tool: string; args: Record<string, unknown>; result: unknown }> = [];
        let response = await chat.sendMessage(userRequest);
        let thought = '';
        let finalResponse = '';

        // Process function calls (ReAct loop)
        while (response.response.candidates?.[0]?.content?.parts) {
            const parts = response.response.candidates[0].content.parts;

            for (const part of parts) {
                if (part.text) {
                    thought += part.text;
                    finalResponse = part.text;
                }

                if (part.functionCall) {
                    const { name, args } = part.functionCall;
                    console.log(`🔧 Tool called: ${name}`, args);

                    // Execute the tool
                    const result = await this.executeTool(name, args as Record<string, unknown>);
                    actions.push({ tool: name, args: args as Record<string, unknown>, result });

                    // Send result back to model
                    response = await chat.sendMessage([{
                        functionResponse: {
                            name,
                            response: { result }
                        }
                    }]);
                }
            }

            // Check if we should continue
            const hasMoreCalls = parts.some(p => p.functionCall);
            if (!hasMoreCalls) break;
        }

        return { thought, actions, finalResponse };
    }

    /**
     * Tool execution - ye actual tools ka implementation hai
     */
    private async executeTool(name: string, args: Record<string, unknown>): Promise<unknown> {
        switch (name) {
            case 'generateCaption':
                return this.toolGenerateCaption(
                    args.topic as string,
                    args.platform as string,
                    args.tone as string
                );

            case 'generateHashtags':
                return this.toolGenerateHashtags(
                    args.topic as string,
                    (args.count as number) || 5
                );

            case 'analyzeImage':
                return this.toolAnalyzeImage(args.imageUrl as string);

            case 'createDraft':
                return this.toolCreateDraft(
                    args.caption as string,
                    args.hashtags as string[],
                    args.platform as string
                );

            case 'schedulePost':
                return this.toolSchedulePost(
                    args.postId as string,
                    args.scheduledTime as string
                );

            case 'publishPost':
                return this.toolPublishPost(
                    args.postId as string,
                    args.platform as string
                );

            default:
                return { error: `Unknown tool: ${name}` };
        }
    }

    // Tool implementations
    private async toolGenerateCaption(topic: string, platform: string, tone?: string): Promise<string> {
        const prompt = `Generate an engaging ${platform} caption about: ${topic}. Tone: ${tone || 'professional'}. Return only the caption.`;
        const result = await this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }).generateContent(prompt);
        return result.response.text();
    }

    private async toolGenerateHashtags(topic: string, count: number): Promise<string[]> {
        const prompt = `Generate ${count} relevant hashtags for: ${topic}. Return only hashtags, one per line.`;
        const result = await this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }).generateContent(prompt);
        return result.response.text().split('\n').filter(h => h.startsWith('#'));
    }

    private async toolAnalyzeImage(imageUrl: string): Promise<string> {
        // In real implementation, this would use Gemini Vision
        return `Image analysis for: ${imageUrl} - Professional content suitable for social media.`;
    }

    private async toolCreateDraft(caption: string, hashtags: string[], platform: string): Promise<object> {
        // In real implementation, this would save to database
        return {
            id: `draft_${Date.now()}`,
            caption,
            hashtags,
            platform,
            status: 'draft',
            createdAt: new Date().toISOString()
        };
    }

    private async toolSchedulePost(postId: string, scheduledTime: string): Promise<object> {
        // In real implementation, this would add to BullMQ queue
        return {
            postId,
            scheduledTime,
            status: 'scheduled',
            message: 'Post scheduled successfully'
        };
    }

    private async toolPublishPost(postId: string, platform: string): Promise<object> {
        // In real implementation, this would call platform APIs
        return {
            postId,
            platform,
            status: 'published',
            publishedAt: new Date().toISOString(),
            message: `Published to ${platform} successfully`
        };
    }
}

// Example usage
async function main() {
    try {
        const agent = new SocialMediaAgent();

        const result = await agent.process(
            'Create an Instagram post about launching our new AI-powered features. Make it exciting and professional.'
        );

        console.log('\n📝 Agent Thought:', result.thought);
        console.log('\n🔧 Actions taken:', JSON.stringify(result.actions, null, 2));
        console.log('\n✅ Final Response:', result.finalResponse);
    } catch (error) {
        console.error('Agent error:', error);
    }
}

// Run if executed directly
main();
