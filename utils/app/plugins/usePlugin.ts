import { MutableRefObject } from 'react';

import { InstalledPlugin, PSMMCall } from '@/types/plugin';
import { AiModel } from '@chatbot-ui/core/types/ai-models';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';

import { storageCreateMessages } from '../storage/messages';
import { saveSelectedConversation } from '../storage/selectedConversation';
import { getApiCalls } from './PSMM';
import { executeApiCall } from './autoExecutor';
import { findPluginById } from './finder';

import { Database } from '@chatbot-ui/core';

export async function usePlugin(
  user: User,
  models: AiModel[],
  database: Database,
  text: string,
  installedPlugins: InstalledPlugin[],
  conversation: Conversation,
  conversations: Conversation[],
  stopConversationRef: MutableRefObject<boolean>,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) {
  const invocations = getInvocations(text);

  const newMessages: Message[] = [];
  for (const invocation of invocations) {
    try {
      const psmmCall = JSON.parse(invocation) as PSMMCall;
      const plugin = findPluginById(psmmCall.id, installedPlugins);

      if (!plugin) {
        console.error('Plugin not found:', psmmCall.id);
        continue;
      }
      const apiCalls = await getApiCalls(
        models,
        psmmCall.query,
        plugin,
        conversation,
        stopConversationRef,
        apiKey,
        homeDispatch,
      );

      for (const apiCall of apiCalls) {
        const newMessage = await executeApiCall(
          models,
          plugin,
          apiCall,
          conversation,
          stopConversationRef,
          apiKey,
          homeDispatch,
        );

        if (newMessage) {
          newMessages.push(newMessage);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  homeDispatch({ field: 'loading', value: false });
  homeDispatch({ field: 'messageIsStreaming', value: false });

  for (let i = 0; i < newMessages.length; i++) {
    conversation.messages.pop();
  }

  const { single, all } = storageCreateMessages(
    database,
    user,
    conversation,
    newMessages,
    conversations,
  );

  homeDispatch({
    field: 'selectedConversation',
    value: single,
  });

  homeDispatch({ field: 'conversations', value: all });
  saveSelectedConversation(user, single);
}

function getInvocations(text: string) {
  const queries = text.match(/(?<=λ\/)[^\/λ]*(?=\/λ)/g);

  if (!queries) return text;

  const invocations = [];
  for (const query of queries) {
    try {
      invocations.push(query);
    } catch (err) {
      console.error('Invalid JSON:', query);
    }
  }

  return invocations;
}
