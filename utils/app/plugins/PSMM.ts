import { MutableRefObject } from 'react';

import { getTimestampWithTimezoneOffset } from '@chatbot-ui/core/utils/time';

import { InstalledPlugin, PluginCall } from '@/types/plugin';
import { PossibleAiModels } from '@chatbot-ui/core/types/ai-models';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';
import { SystemPrompt } from '@chatbot-ui/core/types/system-prompt';

import { sendChatRequest } from '../chat';
import { getPSMMPrompt } from './PSMMPrompt';
import { findPluginById } from './finder';

import { v4 as uuidv4 } from 'uuid';

// Invoke the Plugin System Manager Model
export const getApiCalls = async (
  prompt: string,
  installedPlugins: InstalledPlugin[],
  conversation: Conversation,
  stopConversationRef: MutableRefObject<boolean>,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) => {
  const systemPromptContent = getPSMMPrompt(installedPlugins, null);

  const systemPrompt: SystemPrompt = {
    id: '0',
    name: 'custom',
    content: systemPromptContent,
    models: [],
    folderId: null,
  };

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
    model: PossibleAiModels['claude-instant-v1-100k'],
    name: 'Plugin Parser',
    temperature: 0.1,
    messages: messages,
    systemPrompt: systemPrompt,
    folderId: null,
    timestamp: new Date().toISOString(),
    enabledPlugins: [],
  };

  const { response, controller } = await sendChatRequest(
    customConversation,
    apiKey,
  );

  if (!response.ok) {
    console.error('Error sending PSMM request');
    return [];
  }
  const data = response.body;
  if (!data) {
    console.error('Error sending PSMM request');
    return [];
  }

  const reader = data.getReader();
  const decoder = new TextDecoder();
  const assistantMessageId = uuidv4();
  conversation.messages.push({
    id: assistantMessageId,
    role: 'assistant',
    content: '',
    timestamp: getTimestampWithTimezoneOffset(),
  });
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

  conversation.messages.pop();

  const callTexts = text.match(/(?<=λ\/)[^\/λ]*(?=\/λ)/g);

  if (!callTexts) return [];

  const calls: PluginCall[] = [];
  for (const callText of callTexts) {
    try {
      const rawCall = JSON.parse(callText) as {
        id: string;
        operationId: string;
        args: Map<string, string>;
        goal: string;
      };

      const plugin = findPluginById(rawCall.id, installedPlugins);

      if (!plugin) {
        console.error('Plugin not found:', rawCall.id);
      } else {
        const call: PluginCall = {
          plugin: plugin,
          operationId: rawCall.operationId,
          args: rawCall.args,
          goal: rawCall.goal,
        };
        calls.push(call);
      }
    } catch (e) {
      console.error('Error parsing plugin call:', callText);
    }
  }

  return calls;
};
