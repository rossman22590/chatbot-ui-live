import { useContext, useRef } from 'react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import HomeContext from '@/pages/api/home/home.context';

import { SecondaryMenu } from '../SecondaryMenu/SecondaryMenu';
import ChatZoneContext from './ChatZone.context';
import { ChatZoneInitialState, initialState } from './ChatZone.state';
import { Chat } from './Screens/Chat/Chat';
import { PluginHomePage } from './Screens/PluginHomePage/PluginHomePage';
import { Settings } from './Screens/Settings/Settings';

export const ChatZone = () => {
  const chatBarContextValue = useCreateReducer<ChatZoneInitialState>({
    initialState,
  });

  const {
    state: { selectedPlugin, display, showPrimaryMenu, showSecondaryMenu },
  } = useContext(HomeContext);

  const stopConversationRef = useRef<boolean>(false);

  return (
    <ChatZoneContext.Provider value={chatBarContextValue}>
      <div
        className={`relative sm:flex flex-1 ${
          showPrimaryMenu || showSecondaryMenu ? 'hidden' : 'flex'
        }`}
      >
        {selectedPlugin && display == 'plugins' && (
          <PluginHomePage plugin={selectedPlugin} />
        )}
        {display == 'settings' && <Settings />}
        {display == 'chat' && (
          <Chat stopConversationRef={stopConversationRef} />
        )}
      </div>
    </ChatZoneContext.Provider>
  );
};
