import { InstalledPlugin, PluginCall } from '@/types/plugin';

import { executeAll } from './execute';

export async function autoExecute(
  text: string,
  enabledPlugins: InstalledPlugin[],
  authToken?: string,
) {
  const rawCalls = text.match(/(?<=λ\/)[^]*(?=\/λ)/g);

  console.log('text:', text);
  console.log('rawCalls:', rawCalls);
  if (!rawCalls) return null;

  const enabledIds = enabledPlugins.map((plugin) => plugin.manifest.id);

  console.log('enabledIds:', enabledIds);

  const pluginCalls = [];
  for (const rawCall of rawCalls) {
    try {
      const call = JSON.parse(rawCall) as PluginCall;

      // Check if plugin is enabled
      if (!enabledIds.includes(call.id)) {
        console.log('Plugin not enabled:', call.id);
        return null;
      }
      pluginCalls.push(call);
    } catch (err) {
      console.log('Invalid JSON:', rawCall);
    }
  }

  return await executeAll(pluginCalls, enabledPlugins, authToken);
}
