import toast from 'react-hot-toast';

import { InstalledPlugin } from '@/types/plugin';
import { AiModel } from '@chatbot-ui/core/types/ai-models';
import { Conversation } from '@chatbot-ui/core/types/chat';
import { SystemPrompt } from '@chatbot-ui/core/types/system-prompt';

import { sendChatRequest } from '../../chat';
import { injectKnowledgeOfPluginSystem } from '../../plugins/awarenessInjectorPrompt';

export async function messageSender(
  builtInSystemPrompts: SystemPrompt[],
  updatedConversation: Conversation,
  installedPlugins: InstalledPlugin[],
  selectedConversation: Conversation,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) {
  let customPrompt = selectedConversation.systemPrompt;

  if (!customPrompt) {
    customPrompt = builtInSystemPrompts.filter(
      (prompt) =>
        prompt.name === `${selectedConversation.model.vendor} Built-In`,
    )[0];
  }

  // Make the chatbot aware of the installed plugins
  if (installedPlugins.length > 0) {
    const promptText = injectKnowledgeOfPluginSystem(
      selectedConversation.model,
      customPrompt.content,
      installedPlugins,
    );

    customPrompt = {
      ...customPrompt,
      content: promptText,
    };
  }

  const pluginInjectedConversation = {
    ...updatedConversation,
    systemPrompt: customPrompt,
  };

  const { response, controller } = await sendChatRequest(
    pluginInjectedConversation,
    apiKey,
  );

  if (!response.ok) {
    homeDispatch({ field: 'loading', value: false });
    homeDispatch({ field: 'messageIsStreaming', value: false });
    toast.error(response.statusText);
    return { data: null, controller: null };
  }
  const data = response.body;
  if (!data) {
    homeDispatch({ field: 'loading', value: false });
    homeDispatch({ field: 'messageIsStreaming', value: false });
    return { data: null, controller: null };
  }

  homeDispatch({ field: 'loading', value: false });
  return { data, controller };
}
