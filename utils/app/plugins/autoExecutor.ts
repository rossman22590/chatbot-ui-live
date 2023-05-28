import { InstalledPlugin, PSMMMessage, PluginCall } from '@/types/plugin';
import { Conversation } from '@chatbot-ui/core/types/chat';

import { invokePPM } from './PPM';
import { callApi } from './execute';
import { findPluginById } from './finder';

export async function executeApiCall(
  call: PluginCall,
  conversation: Conversation,
  stopConversationRef: any,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
  authToken?: string,
) {
  const response = await callApi(call, call.plugin, authToken);

  // Invoking the Plugin Parser Model to get the human readable response
  const message = await invokePPM(
    call,
    response,
    conversation,
    call.plugin,
    stopConversationRef,
    apiKey,
    homeDispatch,
  );

  return message;
}

export async function autoParseMessages(
  text: string,
  installedPlugins: InstalledPlugin[],
) {
  const rawMessageObjects = text.match(/(?<=λ-)[^]*(?=-λ)/g);

  if (!rawMessageObjects) return '';

  let message = '';
  for (const rawMessage of rawMessageObjects) {
    try {
      const { id, text } = JSON.parse(rawMessage) as PSMMMessage;

      const plugin = findPluginById(id, installedPlugins);
      message += `![${plugin?.manifest.id}](${plugin?.manifest.logo_url})\n`;
      message += `${plugin?.manifest.name_for_human}: ${text}\n\n`;
    } catch (err) {
      console.log('Invalid JSON:', rawMessage);
    }
  }

  message = message.trim();

  return message;
}
