import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { KeyValuePair } from '@/types/data';
import { Conversation } from '@chatbot-ui/core/types/chat';
import { FolderInterface } from '@chatbot-ui/core/types/folder';

import { HomeInitialState } from './home.state';

export interface HomeContextProps {
  state: HomeInitialState;
  dispatch: Dispatch<ActionType<HomeInitialState>>;
  handleNewConversation: () => void;
  handleCreateFolder: (name: string, type: FolderInterface['type']) => void;
  handleDeleteFolder: (folderId: string) => void;
  handleUpdateFolder: (folderId: string, name: string) => void;
  handleSelectConversation: (conversation: Conversation) => void;
  handleUpdateConversation: (
    conversation: Conversation,
    data: KeyValuePair,
  ) => void;
  handleFetchNamespaces: () => void;
}

const HomeContext = createContext<HomeContextProps>(undefined!);

export default HomeContext;
