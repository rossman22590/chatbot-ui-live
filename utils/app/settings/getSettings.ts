import { InstalledPlugin } from '@/types/plugin';
import { SystemSettings } from '@/types/settings';

export function getSettings(installedPlugins: InstalledPlugin[]) {
  const settings = SystemSettings;
  // for (const plugin of installedPlugins) {
  //   if (plugin.settings) {
  //     settings.push(plugin.settings);
  //   }
  // }
  return settings;
}
