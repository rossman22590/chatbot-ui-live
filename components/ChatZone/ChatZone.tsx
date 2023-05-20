import { useContext, useRef } from 'react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import HomeContext from '@/pages/api/home/home.context';

import ChatZoneContext from './ChatZone.context';
import { ChatZoneInitialState, initialState } from './ChatZone.state';
import { Chat } from './Screens/Chat/Chat';
import { PluginHomePage } from './Screens/PluginHomePage/PluginHomePage';

export const ChatZone = () => {
  const chatBarContextValue = useCreateReducer<ChatZoneInitialState>({
    initialState,
  });

  const {
    state: { selectedPlugin },
  } = useContext(HomeContext);

  const stopConversationRef = useRef<boolean>(false);

  return (
    <ChatZoneContext.Provider value={chatBarContextValue}>
      <div className="flex flex-1">
        {selectedPlugin && <PluginHomePage plugin={selectedPlugin} />}
        {!selectedPlugin && <Chat stopConversationRef={stopConversationRef} />}
      </div>
    </ChatZoneContext.Provider>
  );
};
