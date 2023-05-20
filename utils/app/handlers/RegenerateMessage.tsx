import { MutableRefObject } from 'react';
import toast from 'react-hot-toast';

import { storageCreateMessage } from '@/utils/app/storage/message';
import { saveSelectedConversation } from '@/utils/app/storage/selectedConversation';
import { getTimestampWithTimezoneOffset } from '@chatbot-ui/core/utils/time';

import { InstalledPlugin, Plugin, PluginKey } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';

import { sendChatRequest } from '../chat';
import { autoExecute } from '../plugins/autoExecutor';
import { storageDeleteMessages } from '../storage/messages';
import { handlePluginParse } from './PluginParser';

import { Database } from '@chatbot-ui/core';
import { v4 as uuidv4 } from 'uuid';

export const regenerateMessageHandler = async (
  user: User,
  enabledPlugins: InstalledPlugin[],
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

    const { response, controller } = await sendChatRequest(
      updatedConversation,
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

    const assistantMessageId = uuidv4();
    const responseMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: getTimestampWithTimezoneOffset(),
    };

    homeDispatch({ field: 'loading', value: false });
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let text = '';

    updatedConversation.messages.push(responseMessage);
    const length = updatedConversation.messages.length;
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

      // This is a plugin call
      if (text.includes('λ/')) {
        updatedConversation.messages[length - 1].content = 'Using plugin';

        homeDispatch({
          field: 'selectedConversation',
          value: updatedConversation,
        });
      } else {
        updatedConversation.messages[length - 1].content = text;

        homeDispatch({
          field: 'selectedConversation',
          value: updatedConversation,
        });
      }
    }

    const pluginCallResponses = await autoExecute(text, enabledPlugins);

    if (pluginCallResponses) {
      for (const pluginCallResponse of pluginCallResponses) {
        const { operationId, result } = pluginCallResponse;

        responseMessage.content = await handlePluginParse(
          user,
          operationId,
          result,
          updatedConversation,
          enabledPlugins,
          stopConversationRef,
          apiKey,
          homeDispatch,
        );
      }
    }

    updatedConversation.messages.pop();

    homeDispatch({ field: 'loading', value: false });
    homeDispatch({ field: 'messageIsStreaming', value: false });

    // Saving the response message
    const { single, all } = storageCreateMessage(
      database,
      user,
      updatedConversation,
      responseMessage,
      conversations,
    );

    homeDispatch({
      field: 'selectedConversation',
      value: single,
    });

    homeDispatch({ field: 'conversations', value: all });
    saveSelectedConversation(user, single);
  }
};
