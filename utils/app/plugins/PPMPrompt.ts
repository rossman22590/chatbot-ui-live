import { InstalledPlugin } from '@/types/plugin';

// Get the system prompt for the Plugin Parsing Model
export const getPPMPrompt = (
  plugin: InstalledPlugin,
  userLocation: string | null,
) => {
  const summary = {
    id: plugin.manifest.id,
    name: plugin.manifest.name_for_model,
    description: plugin.manifest.description_for_model,
    paths: plugin.api.paths,
    schemas: plugin.api.components.schemas,
  };

  const examples = {
    id: plugin.manifest.id,
    examples: plugin.api.examples,
  };

  let prompt = plugin.prompt;

  prompt = prompt.replaceAll('{{summary}}', JSON.stringify(summary, null, 2));
  prompt = prompt.replaceAll('{{examples}}', JSON.stringify(examples, null, 2));
  prompt = prompt.replaceAll('{{location}}', userLocation || '');
  prompt = prompt.replaceAll('{{time}}', new Date().toLocaleTimeString());

  return prompt;
};
