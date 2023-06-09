import { MutableRefObject } from 'react';

import { InstalledPlugin } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation } from '@chatbot-ui/core/types/chat';
import { SystemPrompt } from '@chatbot-ui/core/types/system-prompt';

import { storageDeleteMessages } from '../storage/messages';
import { messageReceiver } from './helpers/messageReceiver';
import { messageSender } from './helpers/messageSender';

import { Database } from '@chatbot-ui/core';

export const regenerateMessageHandler = async (
  user: User,
  installedPlugins: InstalledPlugin[],
  stopConversationRef: MutableRefObject<boolean>,
  builtInSystemPrompts: SystemPrompt[],
  selectedConversation: Conversation | undefined,
  conversations: Conversation[],
  database: Database,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) => {
  if (selectedConversation) {
    const deleteCount = 1;

    const conversationLength = selectedConversation.messages.length;
    const messagesToBeDeleted: string[] = [];

    for (let i = 0; i < deleteCount; i++) {
      const currentMessage =
        selectedConversation.messages[conversationLength - 1 - i];
      messagesToBeDeleted.push(currentMessage.id);
    }

    let { single: updatedConversation, all: updatedConversations } =
      storageDeleteMessages(
        database,
        user,
        messagesToBeDeleted,
        selectedConversation,
        selectedConversation.messages,
        conversations,
      );

    homeDispatch({
      field: 'selectedConversation',
      value: updatedConversation,
    });

    homeDispatch({ field: 'loading', value: true });
    homeDispatch({ field: 'messageIsStreaming', value: true });

    const { data, controller } = await messageSender(
      builtInSystemPrompts,
      updatedConversation,
      installedPlugins,
      selectedConversation,
      apiKey,
      homeDispatch,
    );

    // Failed to send message
    if (!data || !controller) {
      return;
    }

    await messageReceiver(
      user,
      database,
      data,
      controller,
      installedPlugins,
      updatedConversation,
      updatedConversations,
      stopConversationRef,
      apiKey,
      homeDispatch,
    );
  }
};
