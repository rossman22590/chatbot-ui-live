import { InstalledPlugin } from '@/types/plugin';

// Get the system prompt for the Plugin Parsing Model
export const getPPMPrompt = (
  plugin: InstalledPlugin,
  rawPrompt: string,
  userLocation: string | null,
) => {
  const summary = {
    id: plugin.manifest.id,
    name: plugin.manifest.name_for_model,
    description: plugin.manifest.description_for_model,
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
