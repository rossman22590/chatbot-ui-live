import { MutableRefObject } from 'react';

import { storageCreateMessage } from '@/utils/app/storage/message';

import { Namespace } from '@/types/learning';
import { InstalledPlugin } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';

import { storageUpdateConversation } from '../storage/conversation';
import { messageReceiver } from './helpers/messageReceiver';
import { messageSender } from './helpers/messageSender';
import { namespaceMessageSender } from './helpers/namespaceMessageSender';

import { Database } from '@chatbot-ui/core';

export const sendHandlerFunction = async (
  user: User,
  selectedNamespace: Namespace | null,
  message: Message,
  installedPlugins: InstalledPlugin[],
  stopConversationRef: MutableRefObject<boolean>,
  selectedConversation: Conversation | undefined,
  conversations: Conversation[],
  database: Database,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) => {
  console.log('installedPlugins', installedPlugins);

  if (selectedConversation) {
    homeDispatch({ field: 'messageIsStreaming', value: true });
    homeDispatch({ field: 'loading', value: true });

    // Saving the user message
    let { single: updatedConversation, all: updatedConversations } =
      storageCreateMessage(
        database,
        user,
        selectedConversation,
        message,
        conversations,
      );

    homeDispatch({
      field: 'selectedConversation',
      value: updatedConversation,
    });

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

    // Sending the message to the namespace API server if a namespace is selected
    if (selectedNamespace && selectedNamespace.namespace != 'none') {
      namespaceMessageSender(
        user,
        selectedNamespace,
        database,
        updatedConversation,
        updatedConversations,
        homeDispatch,
      );
    } else {
      const { data, controller } = await messageSender(
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

      // Sending the message to OpenAI otherwise
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
  }
};
