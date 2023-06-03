import { InstalledPlugin, PSMMMessage, PluginCall } from '@/types/plugin';
import { Conversation } from '@chatbot-ui/core/types/chat';

import { invokePPM } from './PPM';
import { callApi } from './execute';
import { findPluginById } from './finder';
import { addPluginSignInBox } from './pluginSignIn';

export async function executeApiCall(
  call: PluginCall,
  conversation: Conversation,
  stopConversationRef: any,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
  authToken?: string,
) {
  const { error, data } = await callApi(call, call.plugin, authToken);

  if (data) {
    // Invoking the Plugin Parser Model to get the human readable response
    return await invokePPM(
      call,
      data,
      conversation,
      call.plugin,
      stopConversationRef,
      apiKey,
      homeDispatch,
    );
  } else if (error === 'no-auth') {
    return await addPluginSignInBox(call, conversation, homeDispatch);
  }
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
      console.error('Invalid JSON:', rawMessage);
    }
  }

  message = message.trim();

  return message;
}
