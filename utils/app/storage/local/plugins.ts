import { InstalledPlugin } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';

export const localGetInstalledPlugins = (user: User) => {
  const itemName = `plugins-${user.email}`;
  const rawInstalledPlugins = localStorage.getItem(itemName);
  if (!rawInstalledPlugins) {
    return [];
  }

  const installedPlugins = JSON.parse(rawInstalledPlugins) as InstalledPlugin[];

  return installedPlugins;
};

export const localAddInstalledPlugin = (
  user: User,
  installedPlugin: InstalledPlugin,
) => {
  const itemName = `plugins-${user.email}`;
  const rawInstalledPlugins = localStorage.getItem(itemName);

  let installedPlugins: InstalledPlugin[] = [];
  if (rawInstalledPlugins) {
    installedPlugins = JSON.parse(rawInstalledPlugins) as InstalledPlugin[];
  }

  const newInstalledPlugins = [...installedPlugins, installedPlugin];

  localStorage.setItem(itemName, JSON.stringify(newInstalledPlugins));

  return newInstalledPlugins;
};

export const localDeleteInstalledPlugin = (user: User, pluginId: string) => {
  const itemName = `plugins-${user.email}`;
  const rawInstalledPlugins = localStorage.getItem(itemName);
  if (!rawInstalledPlugins) {
    return;
  }

  const installedPlugins = JSON.parse(rawInstalledPlugins) as InstalledPlugin[];

  const newInstalledPlugins = installedPlugins.filter(
    (installedPlugin: InstalledPlugin) =>
      installedPlugin.manifest.id !== pluginId,
  ) as InstalledPlugin[];

  localStorage.setItem(itemName, JSON.stringify(newInstalledPlugins));

  return newInstalledPlugins;
};
