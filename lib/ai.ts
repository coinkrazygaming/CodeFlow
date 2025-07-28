import { supabaseAdmin } from './database';

export interface AIResponse {
  content: string;
  usage: {
    tokens: number;
    cost: number;
  };
}

export class JoseyAI {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY!;
  }

  async chat(prompt: string, userId: string, projectId?: string): Promise<AIResponse> {
    try {
      // Check user's AI edit limit
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('ai_edits_used, subscription_tier')
        .eq('id', userId)
        .single();

      if (!user) throw new Error('User not found');

      const limit = user.subscription_tier === 'premium' ? 1000 : 25;
      if (user.ai_edits_used >= limit) {
        throw new Error('AI edit limit reached');
      }

      // Simulate AI response (replace with actual OpenAI API call)
      const response: AIResponse = {
        content: `Here's how I can help with: "${prompt}"`,
        usage: {
          tokens: 150,
          cost: 0.001
        }
      };

      // Log the AI edit
      await supabaseAdmin.from('ai_edits').insert({
        user_id: userId,
        project_id: projectId,
        prompt,
        response: response.content
      });

      // Update user's edit count
      await supabaseAdmin
        .from('users')
        .update({ ai_edits_used: user.ai_edits_used + 1 })
        .eq('id', userId);

      return response;
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  }

  async generateCode(prompt: string, language: string = 'javascript'): Promise<string> {
    // Simulate code generation
    return `// Generated code for: ${prompt}\nfunction generatedCode() {\n  console.log('Hello from Josey AI!');\n}`;
  }

  async debugCode(code: string, error: string): Promise<string> {
    return `The error "${error}" in your code can be fixed by: [debugging suggestions]`;
  }

  async generateSocialMediaPost(prompt: string, platform: 'facebook' | 'instagram' | 'twitter'): Promise<string> {
    return `Generated ${platform} post: ${prompt}`;
  }
}
