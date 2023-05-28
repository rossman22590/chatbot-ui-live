import { MutableRefObject } from 'react';

import { InstalledPlugin, PluginCall } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';

import { storageCreateMessages } from '../storage/messages';
import { saveSelectedConversation } from '../storage/selectedConversation';
import { getApiCalls } from './PSMM';
import { autoParseMessages, executeApiCall } from './autoExecutor';

import { Database } from '@chatbot-ui/core';

export async function usePlugin(
  database: Database,
  user: User,
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
    const apiCalls = await getApiCalls(
      invocation,
      installedPlugins,
      conversation,
      stopConversationRef,
      apiKey,
      homeDispatch,
    );

    for (const apiCall of apiCalls) {
      const newMessage = await executeApiCall(
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
      console.log('Invalid JSON:', query);
    }
  }

  return invocations;
}
