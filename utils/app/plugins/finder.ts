import { InstalledPlugin } from '@/types/plugin';

export function findPluginInChat(
  text: string,
  installedPlugins: InstalledPlugin[],
) {
  const pluginIds = text.match(/(?<="id": ")[^"]*(?=")/g);
  if (!pluginIds) return null;

  // Find plugin by ID
  const plugin = installedPlugins.find((plugin) => {
    if (plugin.manifest.id === pluginIds[0]) return true;
  });

  return plugin;
}

export function findPluginById(
  id: string,
  installedPlugins: InstalledPlugin[],
) {
  // Find plugin by ID
  const plugin = installedPlugins.find((plugin) => {
    if (plugin.manifest.id === id) return true;
  });

  return plugin;
}
