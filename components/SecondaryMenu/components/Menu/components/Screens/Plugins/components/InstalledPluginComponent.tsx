import { Switch } from '@headlessui/react';
import { useContext } from 'react';

import Image from 'next/image';

import { storageUpdateConversation } from '@/utils/app/storage/conversation';

import { InstalledPlugin } from '@/types/plugin';

import HomeContext from '@/pages/api/home/home.context';

interface Props {
  plugin: InstalledPlugin;
  index: number;
  isEnabled: boolean;
}

export const InstalledPluginComponent = ({ plugin, isEnabled }: Props) => {
  const {
    state: { database, user, selectedConversation, conversations },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const handleEnablePlugin = async () => {
    if (selectedConversation) {
      if (isEnabled) {
        // Removing the plugin from the selected conversation enabled plugins
        const newEnabledPlugins = selectedConversation.enabledPlugins.filter(
          (enabledPlugin) => enabledPlugin !== plugin.manifest.id,
        );

        const updatedConversation = {
          ...selectedConversation,
          enabledPlugins: newEnabledPlugins,
        };

        const { single, all } = storageUpdateConversation(
          database,
          user,
          updatedConversation,
          conversations,
        );

        homeDispatch({
          field: 'selectedConversation',
          value: single,
        });

        homeDispatch({
          field: 'conversations',
          value: all,
        });
      } else {
        const newEnabledPlugins = [
          ...selectedConversation?.enabledPlugins!,
          plugin.manifest.id,
        ];

        const updatedConversation = {
          ...selectedConversation,
          enabledPlugins: newEnabledPlugins,
        };

        const { single, all } = storageUpdateConversation(
          database,
          user,
          updatedConversation,
          conversations,
        );

        homeDispatch({
          field: 'selectedConversation',
          value: single,
        });

        homeDispatch({
          field: 'conversations',
          value: all,
        });
      }
    }
  };

  return (
    <div className="relative flex-col select-none">
      <div
        className="relative flex cursor-pointer items-center p-2 text-sm transition-colors
        overflow-hidden duration-200 rounded-md text-black dark:text-white"
      >
        <div className="mr-2">
          <Image
            alt="Plugin Logo"
            src={plugin.manifest.logo_url}
            width={35}
            height={35}
          />
        </div>
        <div className="flex flex-col w-full overflow-hidden">
          <div className="text-[15px] font-bold pb-[4px]">
            {plugin.manifest.name_for_human}
          </div>
          <div className="text-[13.5px] pb-[2px] max-w-[210px] truncate">
            {plugin.manifest.description_for_human}
          </div>
          <div className="flex flex-grow flex-shrink">
            <div className="text-[12px] max-w-[170px] truncate">
              {plugin.manifest.author}
            </div>

            <div className="flex-grow flex-shrink" />
          </div>
        </div>
        <div className="pl-2">
          <Switch
            checked={isEnabled}
            onChange={handleEnablePlugin}
            className={`${
              isEnabled
                ? `bg-gradient-to-r from-fuchsia-600 via-violet-900 to-indigo-500
                  dark:from-fuchsia-500 dark:via-violet-600 dark:to-indigo-400
                  bg-175% animate-bg-pan-fast appearance-none cursor-pointer dark:bg-gray-700`
                : 'bg-gray-400'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable notifications</span>
            <span
              className={`${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};
