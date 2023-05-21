import { MutableRefObject, useContext } from 'react';
import toast from 'react-hot-toast';

import { storageUpdateConversation } from '@/utils/app/storage/conversation';
import {
  storageCreateMessage,
  storageUpdateMessage,
} from '@/utils/app/storage/message';
import { saveSelectedConversation } from '@/utils/app/storage/selectedConversation';
import { getTimestampWithTimezoneOffset } from '@chatbot-ui/core/utils/time';

import { InstalledPlugin } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';

import { sendChatRequest } from '../chat';
import { autoExecute } from '../plugins/autoExecutor';
import { injectKnowledgeOfPluginSystem } from '../plugins/systemPromptInjector';
import { storageDeleteMessages } from '../storage/messages';
import { messageReceiver } from './helpers/messageReceiver';

import { Database } from '@chatbot-ui/core';
import { v4 as uuidv4 } from 'uuid';

export const editMessageHandler = async (
  user: User,
  installedPlugins: InstalledPlugin[],
  message: Message,
  index: number,
  stopConversationRef: MutableRefObject<boolean>,
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

    homeDispatch({
      field: 'selectedConversation',
      value: update1.single,
    });

    homeDispatch({ field: 'loading', value: true });
    homeDispatch({ field: 'messageIsStreaming', value: true });

    let newPrompt = selectedConversation.prompt;

    // Make the chatbot aware of the installed plugins
    if (installedPlugins.length > 0) {
      newPrompt = injectKnowledgeOfPluginSystem(
        selectedConversation.prompt,
        installedPlugins,
      );
    }

    const pluginInjectedConversation = {
      ...updatedConversation,
      prompt: newPrompt,
    };

    const { response, controller } = await sendChatRequest(
      pluginInjectedConversation,
      apiKey,
    );

    if (!response.ok) {
      homeDispatch({ field: 'loading', value: false });
      homeDispatch({ field: 'messageIsStreaming', value: false });
      toast.error(response.statusText);
      return;
    }
    const data = response.body;
    if (!data) {
      homeDispatch({ field: 'loading', value: false });
      homeDispatch({ field: 'messageIsStreaming', value: false });
      return;
    }

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
        conversations,
      );
    }
    homeDispatch({ field: 'loading', value: false });

    await messageReceiver(
      user,
      database,
      data,
      controller,
      installedPlugins,
      updatedConversation,
      conversations,
      stopConversationRef,
      apiKey,
      homeDispatch,
    );
  }
};
