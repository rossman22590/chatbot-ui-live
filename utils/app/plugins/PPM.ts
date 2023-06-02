import { MutableRefObject } from 'react';

import { getTimestampWithTimezoneOffset } from '@chatbot-ui/core/utils/time';

import { InstalledPlugin, PluginCall } from '@/types/plugin';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';
import { OpenAIModels } from '@chatbot-ui/core/types/openai';

import { sendChatRequest } from '../chat';
import { getPPMPrompt } from './PPMPrompt';

import { v4 as uuidv4 } from 'uuid';

// Invoke the Plugin Parser Model
export const invokePPM = async (
  call: PluginCall,
  operationResult: any,
  conversation: Conversation,
  plugin: InstalledPlugin,
  stopConversationRef: MutableRefObject<boolean>,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
  message?: Message,
) => {
  // Get the prompt for the Plugin Parser Model
  const systemPrompt = getPPMPrompt(plugin, null);

  const completeLog = `
  User:
  ${call.goal}

  Result:
  ${JSON.stringify(operationResult)}
  `;

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
    console.error('Error sending parse request');
    return;
  }
  const data = response.body;
  if (!data) {
    console.error('Error sending parse request');
    return;
  }

  const reader = data.getReader();
  const decoder = new TextDecoder();

  let index = 0;
  if (!message) {
    const assistantMessageId = uuidv4();
    conversation.messages.push({
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      plugin: call.plugin.manifest.id,
      timestamp: getTimestampWithTimezoneOffset(),
    });
    index = conversation.messages.length - 1;
  } else {
    // The index of the message whose id matches the id of the message that was passed in
    index = conversation.messages.findIndex((m) => m.id === message.id);
  }
  const length = conversation.messages.length;

  let text = '';
  let done = false;
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

    conversation.messages[index].content = text.trim();

    homeDispatch({
      field: 'selectedConversation',
      value: conversation,
    });
  }

  return conversation.messages[index];
};
