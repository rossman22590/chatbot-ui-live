import { InstalledPlugin, PSMMMessage, PluginCall } from '@/types/plugin';
import { Conversation } from '@chatbot-ui/core/types/chat';

import { invokePPM } from './PPM';
import { execute } from './execute';
import { findPluginById } from './finder';

export async function autoExecute(
  text: string,
  installedPlugins: InstalledPlugin[],
  conversation: Conversation,
  stopConversationRef: any,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
  authToken?: string,
) {
  const rawCalls = text.match(/(?<=λ\/)[^\/λ]*(?=\/λ)/g);

  if (!rawCalls) return '';

  const enabledIds = installedPlugins.map((plugin) => plugin.manifest.id);

  const pluginCalls = [];

  let message = '';
  const messagesLength = conversation.messages.length;
  for (const rawCall of rawCalls) {
    try {
      const call = JSON.parse(rawCall) as PluginCall;

      const plugin = findPluginById(call.id, installedPlugins);

      if (!plugin) {
        console.log('Plugin not found:', call.id);
        message += `Could not find plugin: ${call.id}`;
      } else {
        const execution = await execute(call, plugin, authToken);

        message += `<img src="${plugin?.manifest.logo_url}" width="35" height="35"/>`;
        message += `${plugin?.manifest.name_for_human}: `;

        conversation.messages[messagesLength - 1].content = message;
        // Invoking the Plugin Parser Model to get the human readable response
        message = await invokePPM(
          call.operationId,
          execution?.result,
          conversation,
          execution?.plugin!,
          stopConversationRef,
          apiKey,
          homeDispatch,
        );

        message += '\n\n';

        // Check if plugin is enabled
        if (!enabledIds.includes(call.id)) {
          console.log('Plugin not enabled:', call.id);
          return null;
        }
        pluginCalls.push(call);
      }
    } catch (err) {
      console.log('Invalid JSON:', rawCall);
    }
  }

  message = message.trim();

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
