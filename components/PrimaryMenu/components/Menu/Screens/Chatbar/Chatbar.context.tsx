import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { SupportedExportFormats } from '@/types/export';
import { Conversation } from '@chatbot-ui/core/types/chat';

import { ChatbarInitialState } from './Chatbar.state';

import { Database } from '@chatbot-ui/core';

export interface ChatbarContextProps {
  state: ChatbarInitialState;
  dispatch: Dispatch<ActionType<ChatbarInitialState>>;
  handleDeleteConversation: (conversation: Conversation) => void;
  handleClearConversations: () => void;
  handleExportData: (database: Database) => void;
  handleImportConversations: (data: SupportedExportFormats) => void;
  handleApiKeyChange: (apiKey: string) => void;
}

const ChatbarContext = createContext<ChatbarContextProps>(undefined!);

export default ChatbarContext;
