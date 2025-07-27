import { RequestHandler } from 'express';
import { JoseyAI } from '@/lib/ai';

export const handleAIChat: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');
    const { prompt, projectId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const joseyAI = new JoseyAI();
    const response = await joseyAI.chat(prompt, userId, projectId);

    res.json(response);
  } catch (error) {
    console.error('AI chat error:', error);
    
    if (error.message === 'AI edit limit reached') {
      return res.status(429).json({ 
        error: 'You have reached your AI edit limit. Please upgrade to Premium for unlimited edits.',
        code: 'LIMIT_REACHED'
      });
    }

    res.status(500).json({ error: 'AI service temporarily unavailable' });
  }
};
