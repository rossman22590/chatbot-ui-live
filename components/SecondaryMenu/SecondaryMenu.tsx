import {
  IconAdjustments,
  IconApps,
  IconBrain,
  IconBulb,
  IconExternalLink,
  IconInfoCircle,
  IconMessages,
} from '@tabler/icons-react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { localSaveShowSecondaryMenu } from '@/utils/app/storage/local/uiState';

import HomeContext from '@/pages/api/home/home.context';

import { SecondaryMenuOpener } from '../Common/Sidebar/components/OpenCloseButton';
import ActivityBar from './components/ActivityBar/ActivityBar';
import Menu from './components/Menu/Menu';
import { ModelSettings } from './components/Menu/components/Screens/ModelSettings/ModelSettings';

import SecondaryMenuContext from './SecondaryMenu.context';
import { SecondaryMenuInitialState, initialState } from './SecondaryMenu.state';

export const SecondaryMenu = () => {
  const { t } = useTranslation('chat');

  const {
    state: { showSecondaryMenu, user },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const secondaryMenuContextValue = useCreateReducer<SecondaryMenuInitialState>(
    {
      initialState,
    },
  );

  const handleShowSecondaryMenu = () => {
    homeDispatch({ field: 'showSecondaryMenu', value: !showSecondaryMenu });
    localSaveShowSecondaryMenu(user, showSecondaryMenu);
  };

  const icons = [<IconAdjustments size={28} key={0} />];

  const screens = [<ModelSettings key={0} />];

  return (
    <SecondaryMenuContext.Provider value={secondaryMenuContextValue}>
      <Menu screens={screens} />
      <ActivityBar icons={icons} />
    </SecondaryMenuContext.Provider>
  );
};

const InfoCircle = ({ children }: any) => {
  return <IconInfoCircle height={18} width={18} className="ml-1" />;
};
