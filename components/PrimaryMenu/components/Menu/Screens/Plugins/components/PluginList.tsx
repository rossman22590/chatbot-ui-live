import { useContext } from 'react';

import { QuickViewPlugin } from '@/types/plugin';

import HomeContext from '@/pages/api/home/home.context';

import { PluginComponent } from './PluginComponent';

interface Props {
  plugins: QuickViewPlugin[];
}

export const PluginList = ({ plugins }: Props) => {
  const {
    state: { selectedPlugin, installedPlugins },
  } = useContext(HomeContext);

  const isInstalled = (pluginId: string) => {
    const matchedList = installedPlugins.find(
      (plugin) => plugin.manifest.id === pluginId,
    );
    if (!matchedList) return false;
    return true;
  };

  return (
    <div className="relative h-fit flex w-full flex-col gap-1">
      {plugins.slice().map((plugin, index) => (
        <PluginComponent
          isSelected={selectedPlugin?.id === plugin.id}
          isInstalled={isInstalled(plugin.id)}
          index={index}
          key={index}
          plugin={plugin}
        />
      ))}
    </div>
  );
};
