import { MutableRefObject } from 'react';

import { getTimestampWithTimezoneOffset } from '@chatbot-ui/core/utils/time';

import { InstalledPlugin } from '@/types/plugin';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';
import { OpenAIModels } from '@chatbot-ui/core/types/openai';

import { sendChatRequest } from '../chat';
import { getPPMPrompt } from './PPMPrompt';

// Invoke the Plugin Parser Model
export const invokePPM = async (
  operationId: string,
  operationResult: any,
  conversation: Conversation,
  plugin: InstalledPlugin,
  stopConversationRef: MutableRefObject<boolean>,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) => {
  // Get the prompt for the Plugin Parser Model
  const systemPrompt = getPPMPrompt(plugin, null);

  const completeLog = `
  Calling ${operationId}.

  Result:
  ${JSON.stringify(operationResult)}
  `;

  const length = conversation.messages.length;
  const messages: Message[] = [
    {
      id: '0',
      content: completeLog,
      role: 'user',
      timestamp: getTimestampWithTimezoneOffset(),
    },
  ];

  const customConversation: Conversation = {
    id: conversation.id,
    model: OpenAIModels['gpt-4'],
    name: 'Plugin Parser',
    temperature: 0.1,
    messages: messages,
    prompt: systemPrompt,
    folderId: null,
    timestamp: new Date().toISOString(),
  };

  const { response, controller } = await sendChatRequest(
    customConversation,
    apiKey,
  );

  if (!response.ok) {
    console.log('Error sending parse request');
    return '';
  }
  const data = response.body;
  if (!data) {
    console.log('Error sending parse request');
    return '';
  }

  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let text = conversation.messages[length - 1].content;

  while (!done) {
    if (stopConversationRef.current === true) {
      controller.abort();
      done = true;
      break;
    }
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    text += chunkValue;

    conversation.messages[length - 1].content = text;

    homeDispatch({
      field: 'selectedConversation',
      value: conversation,
    });
  }

  return text;
};
