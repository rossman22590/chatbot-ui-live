import {
  IconApps,
  IconBrain,
  IconBulb,
  IconMessages,
} from '@tabler/icons-react';
import { useContext } from 'react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { localSaveShowPrimaryMenu } from '@/utils/app/storage/local/uiState';

import HomeContext from '@/pages/api/home/home.context';

import {
  CloseSidebarButton,
  OpenSidebarButton,
} from '../Common/Sidebar/components/OpenCloseButton';
import ActivityBar from './components/ActivityBar/ActivityBar';
import Menu from './components/Menu/Menu';

import PrimaryMenuContext from './PrimaryMenu.context';
import { PrimaryMenuInitialState, initialState } from './PrimaryMenu.state';
import { Chatbar } from './Screens/Chatbar/Chatbar';
import { PluginCatalog } from './Screens/Plugins/PluginCatalog';
import Promptbar from './Screens/Promptbar/Promptbar';

export const PrimaryMenu = () => {
  const chatBarContextValue = useCreateReducer<PrimaryMenuInitialState>({
    initialState,
  });

  const {
    state: { showPrimaryMenu, user },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const handleShowPrimaryMenu = () => {
    homeDispatch({ field: 'showPrimaryMenu', value: !showPrimaryMenu });
    localSaveShowPrimaryMenu(user, showPrimaryMenu);
  };

  const icons = [
    <IconMessages size={30} key={0} />,
    <IconBulb size={30} key={1} />,
    <IconApps size={30} key={2} />,
    <IconBrain size={30} key={3} />,
  ];

  const screens = [
    <Chatbar key={0} />,
    <Promptbar key={1} />,
    <PluginCatalog key={2} />,
  ];

  return showPrimaryMenu ? (
    <PrimaryMenuContext.Provider value={chatBarContextValue}>
      <ActivityBar icons={icons}></ActivityBar>
      <Menu screens={screens}></Menu>
      <CloseSidebarButton onClick={handleShowPrimaryMenu} side={'left'} />
    </PrimaryMenuContext.Provider>
  ) : (
    <OpenSidebarButton onClick={handleShowPrimaryMenu} side={'left'} />
  );
};
