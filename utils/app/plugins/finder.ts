import { InstalledPlugin } from '@/types/plugin';

export function findPluginInChat(
  text: string,
  enabledPlugins: InstalledPlugin[],
) {
  const pluginIds = text.match(/(?<="id": ")[^"]*(?=")/g);
  if (!pluginIds) return null;

  // Find plugin by ID
  const plugin = enabledPlugins.find((plugin) => {
    if (plugin.manifest.id === pluginIds[0]) return true;
  });

  return plugin;
}
