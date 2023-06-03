import {
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
import { ModelSelect } from './components/ModelSelect';
import { SystemPromptSelect } from './components/SystemPromptSelect';
import { TemperatureSlider } from './components/Temperature';

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

  return (
    <SecondaryMenuContext.Provider value={secondaryMenuContextValue}>
      <div className="hidden sm:block h-0 w-0 relative top-5 right-10">
        <SecondaryMenuOpener
          onClick={handleShowSecondaryMenu}
          open={showSecondaryMenu}
        />
      </div>
      <div
        className={`relative sm:w-[280px] h-full z-30 ${
          !showSecondaryMenu ? 'hidden' : 'right-[0] w-full'
        } flex flex-col bg-theme-primary-menu-light dark:bg-theme-primary-menu-dark p-2 
        text-[14px] transition-all sm:relative sm:top-0 border-theme-border-light dark:border-theme-border-dark border-l`}
      >
        <div className="pt-2 px-1 space-y-1">
          <label className="flex items-center text-left pl-1 text-black dark:text-white">
            {t('Model')}
            <InfoCircle />
          </label>
          <ModelSelect />

          <label className="pt-3 flex items-center text-left pl-1 text-black dark:text-white">
            {t('System Prompt')}
            <InfoCircle />
          </label>
          <SystemPromptSelect />

          <label className="pt-3 flex items-center text-left pl-1 pr-1 text-black dark:text-white">
            {t('Temperature')}
            <InfoCircle />
          </label>

          <TemperatureSlider />
        </div>
      </div>
    </SecondaryMenuContext.Provider>
  );
};

const InfoCircle = ({ children }: any) => {
  return <IconInfoCircle height={18} width={18} className="ml-1" />;
};
