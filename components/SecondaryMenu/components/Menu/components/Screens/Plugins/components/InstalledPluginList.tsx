import { useContext } from 'react';

import { InstalledPlugin } from '@/types/plugin';

import HomeContext from '@/pages/api/home/home.context';

import { InstalledPluginComponent } from './InstalledPluginComponent';

interface Props {
  plugins: InstalledPlugin[];
}

export const InstalledPluginList = ({ plugins }: Props) => {
  const {
    state: { selectedConversation },
  } = useContext(HomeContext);

  const isEnabled = (pluginId: string) => {
    if (selectedConversation) {
      const matchedList = selectedConversation?.enabledPlugins.find(
        (enabledPlugin) => enabledPlugin === pluginId,
      );
      if (!matchedList) return false;
      return true;
    }
    return false;
  };

  return (
    <div className="relative h-fit flex w-full flex-col gap-1">
      {plugins.slice().map((plugin, index) => (
        <InstalledPluginComponent
          isEnabled={isEnabled(plugin.manifest.id)}
          index={index}
          key={index}
          plugin={plugin}
        />
      ))}
    </div>
  );
};
