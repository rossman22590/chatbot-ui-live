import { MutableRefObject } from 'react';

import { getTimestampWithTimezoneOffset } from '@chatbot-ui/core/utils/time';

import { InstalledPlugin } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';

import { usePlugin } from '../../plugins/usePlugin';
import { storageCreateMessage } from '../../storage/message';
import { saveSelectedConversation } from '../../storage/selectedConversation';

import { Database } from '@chatbot-ui/core';
import { v4 as uuidv4 } from 'uuid';

export async function messageReceiver(
  user: User,
  database: Database,
  data: ReadableStream,
  controller: AbortController,
  installedPlugins: InstalledPlugin[],
  updatedConversation: Conversation,
  conversations: Conversation[],
  stopConversationRef: MutableRefObject<boolean>,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) {
  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let text = '';

  const assistantMessageId = uuidv4();
  const responseMessage: Message = {
    id: assistantMessageId,
    role: 'assistant',
    content: '',
    timestamp: getTimestampWithTimezoneOffset(),
  };
  updatedConversation.messages.push(responseMessage);
  const length = updatedConversation.messages.length;
  let usingPlugin = false;
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

    // This is a request to use a plugin
    if (text.includes('λ/') && !usingPlugin) {
      usingPlugin = true;
      updatedConversation.messages[length - 1].content =
        'Contacting the Plugin System Model';
      homeDispatch({
        field: 'selectedConversation',
        value: updatedConversation,
      });
    } else if (!usingPlugin) {
      updatedConversation.messages[length - 1].content = text;

      homeDispatch({
        field: 'selectedConversation',
        value: updatedConversation,
      });
    }
  }

  responseMessage.content = await usePlugin(
    text,
    installedPlugins,
    updatedConversation,
    stopConversationRef,
    apiKey,
    homeDispatch,
  );

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
