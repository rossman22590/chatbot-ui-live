import { MutableRefObject } from 'react';

import { storageCreateMessage } from '@/utils/app/storage/message';

import { Namespace } from '@/types/learning';
import { InstalledPlugin } from '@/types/plugin';
import { AiModel } from '@chatbot-ui/core/types/ai-models';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';

import { getApiCalls } from '../plugins/PSMM';
import { executeApiCall } from '../plugins/autoExecutor';
import { storageUpdateConversation } from '../storage/conversation';
import { saveSelectedConversation } from '../storage/selectedConversation';
import { messageReceiver } from './helpers/messageReceiver';
import { messageSender } from './helpers/messageSender';
import { namespaceMessageSender } from './helpers/namespaceMessageSender';

import { Database } from '@chatbot-ui/core';

export const sendHandlerFunction = async (
  user: User,
  models: AiModel[],
  selectedNamespace: Namespace | null,
  message: Message,
  installedPlugins: InstalledPlugin[],
  stopConversationRef: MutableRefObject<boolean>,
  builtInSystemPrompts: any[],
  selectedConversation: Conversation | undefined,
  conversations: Conversation[],
  database: Database,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) => {
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

    const messageText = message.content;
    // If the input message starts with a backward slash, it is a command
    if (messageText.startsWith('\\')) {
      const command = messageText.split(' ')[0].substring(1);
      const commandLength = command.length + 1;
      const plugin = installedPlugins.find(
        (plugin) =>
          plugin.manifest.invocation_name.toLowerCase() ===
          command.toLowerCase(),
      );
      if (plugin) {
        const apiCalls = await getApiCalls(
          models,
          messageText.substring(commandLength),
          plugin,
          updatedConversation,
          stopConversationRef,
          apiKey,
          homeDispatch,
        );

        for (const apiCall of apiCalls) {
          const newMessage = await executeApiCall(
            models,
            plugin,
            apiCall,
            updatedConversation,
            stopConversationRef,
            apiKey,
            homeDispatch,
          );

          updatedConversation.messages.pop();

          if (newMessage) {
            const { single, all } = storageCreateMessage(
              database,
              user,
              updatedConversation,
              newMessage,
              conversations,
            );

            homeDispatch({
              field: 'selectedConversation',
              value: single,
            });

            homeDispatch({ field: 'conversations', value: all });
            saveSelectedConversation(user, single);
          }
        }
      }
      homeDispatch({ field: 'loading', value: false });
      homeDispatch({ field: 'messageIsStreaming', value: false });
    } else {
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
    }
  }
};
