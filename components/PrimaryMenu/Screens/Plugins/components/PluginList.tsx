import { useContext } from 'react';

import { InstalledPlugin, QuickViewPlugin } from '@/types/plugin';

import HomeContext from '@/pages/api/home/home.context';

import { PluginComponent } from './PluginComponent';

interface Props {
  plugins: QuickViewPlugin[];
}

export const PluginList = ({ plugins }: Props) => {
  const {
    state: { selectedPlugin, installedPlugins },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const handleSelect = (index: number) => {
    homeDispatch({ field: 'selectedPlugin', value: plugins[index] });
  };

  const isInstalled = (pluginId: string) => {
    console.log('installedPlugins', installedPlugins);
    const matchedList = installedPlugins.find(
      (plugin) => plugin.manifest.id === pluginId,
    );
    if (!matchedList) return false;
    return true;
  };

  return (
    <div className="relative h-fit flex w-full flex-col ">
      {plugins.slice().map((plugin, index) => (
        <PluginComponent
          handleSelect={handleSelect}
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
