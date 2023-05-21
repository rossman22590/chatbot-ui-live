import { MutableRefObject } from 'react';
import toast from 'react-hot-toast';

import { InstalledPlugin } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation } from '@chatbot-ui/core/types/chat';

import { sendChatRequest } from '../chat';
import { injectKnowledgeOfPluginSystem } from '../plugins/systemPromptInjector';
import { storageDeleteMessages } from '../storage/messages';
import { messageReceiver } from './helpers/messageReceiver';

import { Database } from '@chatbot-ui/core';

export const regenerateMessageHandler = async (
  user: User,
  installedPlugins: InstalledPlugin[],
  stopConversationRef: MutableRefObject<boolean>,
  selectedConversation: Conversation | undefined,
  conversations: Conversation[],
  database: Database,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) => {
  if (selectedConversation) {
    const deleteCount = 1;
    let updatedConversation: Conversation;

    const conversationLength = selectedConversation.messages.length;
    const messagesToBeDeleted: string[] = [];

    for (let i = 0; i < deleteCount; i++) {
      const currentMessage =
        selectedConversation.messages[conversationLength - 1 - i];
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

    homeDispatch({
      field: 'selectedConversation',
      value: updatedConversation,
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
