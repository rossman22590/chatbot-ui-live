import { MutableRefObject } from 'react';

import { storageUpdateMessage } from '@/utils/app/storage/message';

import { InstalledPlugin } from '@/types/plugin';
import { AiModel } from '@chatbot-ui/core/types/ai-models';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';
import { SystemPrompt } from '@chatbot-ui/core/types/system-prompt';

import { storageUpdateConversation } from '../storage/conversation';
import { storageDeleteMessages } from '../storage/messages';
import { messageReceiver } from './helpers/messageReceiver';
import { messageSender } from './helpers/messageSender';

import { Database } from '@chatbot-ui/core';

export const editMessageHandler = async (
  user: User,
  models: AiModel[],
  installedPlugins: InstalledPlugin[],
  message: Message,
  index: number,
  stopConversationRef: MutableRefObject<boolean>,
  builtInSystemPrompts: SystemPrompt[],
  selectedConversation: Conversation | undefined,
  conversations: Conversation[],
  database: Database,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) => {
  if (selectedConversation) {
    const deleteCount = selectedConversation?.messages.length - index - 1;
    let updatedConversation: Conversation;

    if (deleteCount) {
      const conversationLength = selectedConversation.messages.length;
      const messagesToBeDeleted: string[] = [];

      for (let i = 1; i <= deleteCount; i++) {
        const currentMessage =
          selectedConversation.messages[conversationLength - i];
        messagesToBeDeleted.push(currentMessage.id);
      }
      const deleteUpdate = storageDeleteMessages(
        database,
        user,
        messagesToBeDeleted,
        selectedConversation,
        selectedConversation.messages,
        conversations,
      );

      updatedConversation = deleteUpdate.single;
    } else {
      updatedConversation = selectedConversation;
    }

    // Update the user message
    const update1 = storageUpdateMessage(
      database,
      user,
      updatedConversation,
      message,
      conversations,
    );

    updatedConversation = update1.single;
    const updatedConversations = update1.all;

    homeDispatch({
      field: 'selectedConversation',
      value: update1.single,
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

    // Updating the conversation name
    if (updatedConversation.messages.length === 1) {
      const { content } = message;
      const customName =
        content.length > 30 ? content.substring(0, 30) + '...' : content;
      updatedConversation = {
        ...updatedConversation,
        name: customName,
      };

      // Saving the conversation name
      storageUpdateConversation(
        database,
        user,
        { ...selectedConversation, name: updatedConversation.name },
        updatedConversations,
      );
    }

    await messageReceiver(
      user,
      models,
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
