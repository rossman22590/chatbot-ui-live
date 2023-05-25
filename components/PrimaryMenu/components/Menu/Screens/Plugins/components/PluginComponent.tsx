import { IconCheck, IconX } from '@tabler/icons-react';
import { MouseEventHandler, useContext, useState } from 'react';

import Image from 'next/image';

import { QuickViewPlugin } from '@/types/plugin';

import {
  MiniGreenButton,
  MiniRedButton,
} from '@/components/Common/Buttons/MiniButtons';
import SidebarActionButton from '@/components/Common/Buttons/SidebarActionButton';

import PluginCatalogContext from '../PluginCatalog.context';

interface Props {
  plugin: QuickViewPlugin;
  index: number;
  isSelected: boolean;
  isInstalled: boolean;
}

export const PluginComponent = ({
  plugin,
  index,
  isSelected,
  isInstalled,
}: Props) => {
  const { handleInstallPlugin, handleUninstallPlugin, handleSelect } =
    useContext(PluginCatalogContext);

  const [isUninstalling, setIsUninstalling] = useState(false);

  const handleConfirm: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    handleUninstallPlugin(plugin.id);
    setIsUninstalling(false);
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsUninstalling(false);
  };

  const handleOpenDeleteModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsUninstalling(true);
  };

  return (
    <div className="relative flex-col select-none">
      <div
        className={`relative flex cursor-pointer items-center p-2 text-sm transition-colors overflow-hidden
         duration-200 rounded-md text-black dark:text-white
         ${
           !isSelected
             ? 'hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark'
             : 'bg-theme-select-light dark:bg-theme-select-dark'
         }`}
        onClick={() => handleSelect(plugin)}
      >
        <div className="min-w-[35px] min-h-[35px] mr-2">
          <Image
            alt="Plugin Logo"
            src={plugin.logo_url}
            width={35}
            height={35}
          />
        </div>
        <div className="flex flex-col w-full overflow-hidden">
          <div className="text-[15px] font-bold pb-[4px]">{plugin.name}</div>
          <div className="text-[13.5px] pb-[2px] max-w-[210px] truncate">
            {plugin.description}
          </div>
          <div className="flex flex-grow flex-shrink">
            <div className="text-[12px] max-w-[170px] truncate">
              {plugin.author}
            </div>

            <div className="flex-grow flex-shrink" />

            <div className="w-fit">
              {isUninstalling && (
                <div className="absolute right-1 z-10 flex text-gray-300">
                  <SidebarActionButton handleClick={handleConfirm}>
                    <IconCheck size={18} />
                  </SidebarActionButton>
                  <SidebarActionButton handleClick={handleCancel}>
                    <IconX size={18} />
                  </SidebarActionButton>
                </div>
              )}

              {isInstalled && !isUninstalling && (
                <MiniRedButton handleClick={handleOpenDeleteModal}>
                  Uninstall
                </MiniRedButton>
              )}

              {!isInstalled && (
                <MiniGreenButton
                  handleClick={() => handleInstallPlugin(plugin.id)}
                >
                  Install
                </MiniGreenButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
