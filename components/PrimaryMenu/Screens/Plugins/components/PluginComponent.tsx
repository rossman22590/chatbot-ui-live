import { IconCheck, IconX } from '@tabler/icons-react';
import { MouseEventHandler, useContext, useState } from 'react';

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
  handleSelect: (index: number) => void;
}

export const PluginComponent = ({
  plugin,
  index,
  isSelected,
  isInstalled,
  handleSelect,
}: Props) => {
  const { handleInstallPlugin, handleUninstallPlugin } =
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
         duration-200 
         ${!isSelected ? 'hover:bg-[#4c4d5d]/30' : ''}
         ${isSelected ? 'bg-[#4c4d5d]/80' : ''}`}
        onClick={() => handleSelect(index)}
      >
        <div className="relative min-w-[35px] w-[35px]">
          <img src={plugin.logo_url} width={35} height={35} />
        </div>
        <div className="pl-2 flex-col w-full">
          <div className="text-[15px] font-bold pb-[4px]">{plugin.name}</div>
          <div className="text-[13.5px] pb-[2px] max-w-[210px] truncate">
            {plugin.description}
          </div>
          <div className="flex w-full">
            <div className="text-[12px] max-w-[170px] truncate">
              {plugin.author}
            </div>

            <div className="flex-grow" />

            <div className="flex shrink-0">
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
