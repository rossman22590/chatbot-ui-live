import { MutableRefObject } from 'react';

import { InstalledPlugin, PluginCall } from '@/types/plugin';
import { Conversation } from '@chatbot-ui/core/types/chat';

import { invokePSMM } from './PSMM';
import { autoExecute, autoParseMessages } from './autoExecutor';

export async function usePlugin(
  text: string,
  installedPlugins: InstalledPlugin[],
  conversation: Conversation,
  stopConversationRef: MutableRefObject<boolean>,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) {
  const prompts = text.match(/(?<=λ\/)[^\/λ]*(?=\/λ)/g);

  if (!prompts) return text;

  const psmmInvocations = [];
  for (const prompt of prompts) {
    try {
      psmmInvocations.push(prompt);
    } catch (err) {
      console.log('Invalid JSON:', prompt);
    }
  }

  const invocation = psmmInvocations[0];

  if (psmmInvocations.length > 1) {
    console.log('Only one invocation is allowed');
    console.log('Using first invocation');
  }

  const psmmResponse = await invokePSMM(
    invocation,
    installedPlugins,
    conversation,
    stopConversationRef,
    apiKey,
    homeDispatch,
  );

  const ppmResponseMessages = await autoExecute(
    psmmResponse,
    installedPlugins,
    conversation,
    stopConversationRef,
    apiKey,
    homeDispatch,
  );
  const psmmMessages = await autoParseMessages(psmmResponse, installedPlugins);

  const message = `${ppmResponseMessages}\n\n${psmmMessages}`;

  return message;
}
