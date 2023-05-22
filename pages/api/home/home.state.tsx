import { getUser } from '@/utils/app/auth/helpers';
import { getDatabase } from '@/utils/app/extensions/database';

import { ErrorMessage } from '@/types/error';
import { OpenAIModel, OpenAIModelID } from '@/types/openai';
import { InstalledPlugin, QuickViewPlugin } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';
import { FolderInterface } from '@chatbot-ui/core/types/folder';
import { Prompt } from '@chatbot-ui/core/types/prompt';
import { SystemPrompt } from '@chatbot-ui/core/types/system-prompt';

import { Database } from '@chatbot-ui/core';

export interface HomeInitialState {
  apiKey: string;
  database: Database;
  loading: boolean;
  lightMode: 'light' | 'dark';
  messageIsStreaming: boolean;
  modelError: ErrorMessage | null;
  models: OpenAIModel[];
  folders: FolderInterface[];
  conversations: Conversation[];
  selectedConversation: Conversation | undefined;
  currentMessage: Message | undefined;
  prompts: Prompt[];
  temperature: number;
  showPrimaryMenu: boolean;
  showPromptbar: boolean;
  currentFolder: FolderInterface | undefined;
  messageError: boolean;
  searchTerm: string;
  defaultModelId: OpenAIModelID | undefined;
  serverSideApiKeyIsSet: boolean;
  systemPrompts: SystemPrompt[];
  defaultSystemPromptId: string;
  user: User;
  selectedPlugin: QuickViewPlugin | null;
  installedPlugins: InstalledPlugin[];
}

export const initialState: HomeInitialState = {
  apiKey: '',
  database: await getDatabase(),
  loading: false,
  lightMode: 'dark',
  messageIsStreaming: false,
  modelError: null,
  models: [],
  folders: [],
  conversations: [],
  selectedConversation: undefined,
  currentMessage: undefined,
  prompts: [],
  temperature: 1,
  showPromptbar: true,
  showPrimaryMenu: true,
  currentFolder: undefined,
  messageError: false,
  searchTerm: '',
  defaultModelId: undefined,
  serverSideApiKeyIsSet: false,
  systemPrompts: [],
  defaultSystemPromptId: '0',
  user: await getUser(),
  selectedPlugin: null,
  installedPlugins: [],
};
