import { InstalledPlugin } from '@/types/plugin';

// Get the system prompt for the Plugin System Manager Model
export const getPSMMPrompt = (
  plugin: InstalledPlugin,
  rawPrompt: string,
  userLocation: string | null,
) => {
  const summary = {
    paths: plugin.api.paths,
    schemas: plugin.api.components.schemas,
  };

  rawPrompt = rawPrompt.replaceAll(
    '{{summary}}',
    JSON.stringify(summary, null, 2),
  );
  rawPrompt = rawPrompt.replaceAll('{{location}}', userLocation || '');
  rawPrompt = rawPrompt.replaceAll('{{time}}', new Date().toLocaleTimeString());

  return rawPrompt;
};
