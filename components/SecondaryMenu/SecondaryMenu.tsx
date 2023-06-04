import { IconAdjustments, IconBrain, IconPlug } from '@tabler/icons-react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { LearningScreen } from '../PrimaryMenu/components/Menu/components/Screens/Learning/LearningScreen';
import ActivityBar from './components/ActivityBar/ActivityBar';
import Menu from './components/Menu/Menu';
import { ModelSettings } from './components/Menu/components/Screens/ModelSettings/ModelSettings';
import { InstalledPluginsCatalog } from './components/Menu/components/Screens/Plugins/InstalledPluginsCatalog';

import SecondaryMenuContext from './SecondaryMenu.context';
import { SecondaryMenuInitialState, initialState } from './SecondaryMenu.state';

export const SecondaryMenu = () => {
  const secondaryMenuContextValue = useCreateReducer<SecondaryMenuInitialState>(
    {
      initialState,
    },
  );

  const icons = [
    <IconAdjustments size={28} key={0} />,
    <IconPlug size={28} key={0} />,
  ];

  const screens = [
    <ModelSettings key={0} />,
    <InstalledPluginsCatalog key={1} />,
  ];

  return (
    <SecondaryMenuContext.Provider value={secondaryMenuContextValue}>
      <Menu screens={screens} />
      <ActivityBar icons={icons} />
    </SecondaryMenuContext.Provider>
  );
};
