import { getTimestampWithTimezoneOffset } from '@chatbot-ui/core/utils/time';

import { PluginCall } from '@/types/plugin';
import { Conversation } from '@chatbot-ui/core/types/chat';

import { v4 as uuidv4 } from 'uuid';

export const addDirectResponse = async (
  response: string,
  call: PluginCall,
  conversation: Conversation,
  homeDispatch: React.Dispatch<any>,
) => {
  console.log('response', response);
  const assistantMessageId = uuidv4();
  conversation.messages.push({
    id: assistantMessageId,
    role: 'assistant',
    content: response,
    plugin: call.plugin.manifest.id,
    timestamp: getTimestampWithTimezoneOffset(),
  });
  const length = conversation.messages.length;

  homeDispatch({
    field: 'selectedConversation',
    value: conversation,
  });

  return conversation.messages[length - 1];
};
