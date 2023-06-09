import { AiModel } from '@chatbot-ui/core/types/ai-models';
import { Message } from '@chatbot-ui/core/types/chat';

import { streamAnthropic } from './anthropic/getStream';
import { streamOpenAI } from './openai/getStream';

export async function getStream(
  model: AiModel,
  systemPrompt: string,
  temperature: number,
  apiKey: string,
  messages: Message[],
  tokenCount: number,
) {
  console.log('systemPrompt', systemPrompt);
  if (model.vendor === 'OpenAI') {
    return streamOpenAI(
      model,
      systemPrompt,
      temperature,
      apiKey,
      messages,
      tokenCount,
    );
  } else if (model.vendor === 'Anthropic') {
    return streamAnthropic(
      model,
      systemPrompt,
      temperature,
      apiKey,
      messages,
      tokenCount,
    );
  }
  return { error: 'Unknown vendor' };
}
