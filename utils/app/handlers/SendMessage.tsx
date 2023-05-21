import { MutableRefObject } from 'react';
import toast from 'react-hot-toast';

import { storageUpdateConversation } from '@/utils/app/storage/conversation';
import { storageCreateMessage } from '@/utils/app/storage/message';
import { saveSelectedConversation } from '@/utils/app/storage/selectedConversation';
import { getTimestampWithTimezoneOffset } from '@chatbot-ui/core/utils/time';

import { InstalledPlugin, Plugin, PluginKey } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';

import { sendChatRequest } from '../chat';
import { autoExecute } from '../plugins/autoExecutor';
import { findPluginInChat } from '../plugins/finder';
import { getPluginSystemPrompt } from '../plugins/pluginSystemPrompt';
import { handlePluginParse } from './PluginParser';

import { Database } from '@chatbot-ui/core';
import { v4 as uuidv4 } from 'uuid';

export const sendHandlerFunction = async (
  user: User,
  message: Message,
  enabledPlugins: InstalledPlugin[],
  stopConversationRef: MutableRefObject<boolean>,
  selectedConversation: Conversation | undefined,
  conversations: Conversation[],
  database: Database,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) => {
  if (selectedConversation) {
    homeDispatch({ field: 'loading', value: true });
    homeDispatch({ field: 'messageIsStreaming', value: true });

    let updatedConversation: Conversation;

    const newPrompt = getPluginSystemPrompt(
      selectedConversation.prompt,
      enabledPlugins,
      null,
    );

    updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
    };

    homeDispatch({
      field: 'selectedConversation',
      value: updatedConversation,
    });

    // Saving the user message
    storageCreateMessage(
      database,
      user,
      selectedConversation,
      message,
      conversations,
    );

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

    const assistantMessageId = uuidv4();
    const responseMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: getTimestampWithTimezoneOffset(),
    };

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
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let text = '';

    updatedConversation.messages.push(responseMessage);
    const length = updatedConversation.messages.length;
    let plugin: InstalledPlugin | null | undefined;
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
        plugin = findPluginInChat(text, enabledPlugins);

        if (plugin) {
          updatedConversation.messages[
            length - 1
          ].content = `![${plugin.manifest.name_for_human}-logo](${plugin.manifest.logo_url}) \n Using ${plugin.manifest.name_for_human}...`;
        } else {
          updatedConversation.messages[length - 1].content = 'Using plugin...';
        }

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

    if (pluginCallResponses && plugin) {
      for (const pluginCallResponse of pluginCallResponses) {
        const { operationId, result } = pluginCallResponse;

        responseMessage.content = await handlePluginParse(
          user,
          operationId,
          result,
          updatedConversation,
          plugin,
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
