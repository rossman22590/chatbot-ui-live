import { MutableRefObject } from 'react';

import { storageUpdateMessage } from '@/utils/app/storage/message';

import { InstalledPlugin, PluginCall } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';

import { invokePPM } from '../plugins/PPM';
import { callApi } from '../plugins/execute';
import { addPluginSignInBox } from '../plugins/pluginSignIn';
import { saveSelectedConversation } from '../storage/selectedConversation';

import { Database } from '@chatbot-ui/core';

export const retryPluginHandlerFunction = async (
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

    try {
      const call = JSON.parse(message.content) as PluginCall;

      console.log('call', call);

      const { error, data } = await callApi(call, call.plugin);

      if (data) {
        // Invoking the Plugin Parser Model to get the human readable response
        const newMessage = await invokePPM(
          call,
          data,
          selectedConversation,
          call.plugin,
          stopConversationRef,
          apiKey,
          homeDispatch,
          message,
        );

        if (newMessage) {
          // Update the user message
          const { single, all } = storageUpdateMessage(
            database,
            user,
            selectedConversation,
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
      } else if (error === 'no-auth') {
        return await addPluginSignInBox(
          call,
          selectedConversation,
          homeDispatch,
        );
      }
    } catch (error) {
      console.log('error', error);
      return;
    }
  }
};
