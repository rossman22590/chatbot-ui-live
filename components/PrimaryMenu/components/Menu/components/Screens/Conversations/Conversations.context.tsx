import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { SupportedExportFormats } from '@/types/export';
import { Conversation } from '@chatbot-ui/core/types/chat';

import { ConversationsInitialState } from './Conversations.state';

import { Database } from '@chatbot-ui/core';

export interface ConversationsContextProps {
  state: ConversationsInitialState;
  dispatch: Dispatch<ActionType<ConversationsInitialState>>;
  handleDeleteConversation: (conversation: Conversation) => void;
  handleClearConversations: () => void;
  handleExportData: (database: Database) => void;
  handleImportConversations: (data: SupportedExportFormats) => void;
  handleApiKeyChange: (apiKey: string) => void;
}

const ConversationsContext = createContext<ConversationsContextProps>(
  undefined!,
);

export default ConversationsContext;
