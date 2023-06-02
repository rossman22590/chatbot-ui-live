import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { Message } from '@chatbot-ui/core/types/chat';

import { ChatInitialState } from './Chat.state';

export interface ChatContextProps {
  state: ChatInitialState;
  dispatch: Dispatch<ActionType<ChatInitialState>>;
  handleRetryPlugin: (message: Message) => void;
}

const PrimaryMenuContext = createContext<ChatContextProps>(undefined!);

export default PrimaryMenuContext;
