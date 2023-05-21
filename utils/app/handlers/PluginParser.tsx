import { MutableRefObject } from 'react';

import { getTimestampWithTimezoneOffset } from '@chatbot-ui/core/utils/time';

import { InstalledPlugin } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';
import { OpenAIModels } from '@chatbot-ui/core/types/openai';

import { sendChatRequest } from '../chat';
import { getPluginParserPrompt } from '../plugins/pluginParserPrompt';

export const handlePluginParse = async (
  user: User,
  operationId: string,
  operationResult: any,
  conversation: Conversation,
  plugin: InstalledPlugin,
  stopConversationRef: MutableRefObject<boolean>,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) => {
  const systemPrompt = getPluginParserPrompt(plugin, null);

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
    model: OpenAIModels['gpt-3.5-turbo'],
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
  let text = '';

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
