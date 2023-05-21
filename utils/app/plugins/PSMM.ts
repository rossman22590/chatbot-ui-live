import { MutableRefObject } from 'react';

import { getTimestampWithTimezoneOffset } from '@chatbot-ui/core/utils/time';

import { InstalledPlugin } from '@/types/plugin';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';
import { OpenAIModels } from '@chatbot-ui/core/types/openai';

import { sendChatRequest } from '../chat';
import { getPSMMPrompt } from './PSMMPrompt';
import { findPluginInChat } from './finder';

// Invoke the Plugin System Manager Model
export const invokePSMM = async (
  prompt: string,
  enabledPlugins: InstalledPlugin[],
  conversation: Conversation,
  stopConversationRef: MutableRefObject<boolean>,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) => {
  const systemPrompt = getPSMMPrompt(enabledPlugins, null);

  const length = conversation.messages.length;
  const messages: Message[] = [
    {
      id: '0',
      content: prompt,
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
    console.log('Error sending PSMM request');
    return '';
  }
  const data = response.body;
  if (!data) {
    console.log('Error sending PSMM request');
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

    // This is a request to use a plugin
    if (text.includes('λ/')) {
      conversation.messages[length - 1].content = 'Using plugin...';
      homeDispatch({
        field: 'selectedConversation',
        value: conversation,
      });
    } else if (text.includes('λ-')) {
      conversation.messages[length - 1].content = 'Using plugin...';
      homeDispatch({
        field: 'selectedConversation',
        value: conversation,
      });
    } else {
      conversation.messages[length - 1].content = text;

      homeDispatch({
        field: 'selectedConversation',
        value: conversation,
      });
    }
  }

  return text;
};
