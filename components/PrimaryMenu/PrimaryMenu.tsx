import { IconApps, IconBulb, IconMessages } from '@tabler/icons-react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import ActivityBar from './components/ActivityBar/ActivityBar';
import Menu from './components/Menu/Menu';
import { Chatbar } from './components/Menu/Screens/Chatbar/Chatbar';
import { PluginCatalog } from './components/Menu/Screens/Plugins/PluginCatalog';
import Promptbar from './components/Menu/Screens/Promptbar/Promptbar';

import PrimaryMenuContext from './PrimaryMenu.context';
import { PrimaryMenuInitialState, initialState } from './PrimaryMenu.state';

export const PrimaryMenu = () => {
  const chatBarContextValue = useCreateReducer<PrimaryMenuInitialState>({
    initialState,
  });

  const icons = [
    <IconMessages size={28} key={0} />,
    <IconBulb size={28} key={1} />,
    <IconApps size={28} key={2} />,
  ];

  const screens = [
    <Chatbar key={0} />,
    <Promptbar key={1} />,
    <PluginCatalog key={2} />,
  ];

  return (
    <PrimaryMenuContext.Provider value={chatBarContextValue}>
      <ActivityBar icons={icons}></ActivityBar>
      <Menu screens={screens}></Menu>
    </PrimaryMenuContext.Provider>
  );
};
