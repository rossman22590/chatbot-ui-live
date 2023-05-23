import { IconX } from '@tabler/icons-react';
import { useContext } from 'react';

import { useTranslation } from 'next-i18next';

import { QuickViewPlugin } from '@/types/plugin';

import HomeContext from '@/pages/api/home/home.context';

import { PluginHomePageContent } from './PluginHomePageContent';

interface Props {
  plugin: QuickViewPlugin;
}

export const PluginHomePage = ({ plugin }: Props) => {
  const { t } = useTranslation('plugin-home-page');

  const { dispatch: homeDispatch } = useContext(HomeContext);

  const handleClose = () => {
    homeDispatch({ field: 'selectedPlugin', value: null });
  };

  return (
    <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
      <div className="max-h-full overflow-x-hidden">
        <PluginHomePageContent plugin={plugin} />
      </div>
      <div>
        <button
          className="absolute top-2 right-2 w-6 h-6 m-2 cursor-pointer text-gray-700
         hover:text-gray-800 dark:text-gray-100 dark:hover:text-gray-100"
          onClick={handleClose}
        >
          <IconX />
        </button>
      </div>
    </div>
  );
};
PluginHomePage.displayName = 'PluginHomePage';
