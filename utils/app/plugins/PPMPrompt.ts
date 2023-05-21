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

  let prompt = `
You are an ai model in charge of converting results returned by a plugin's api to human readable content. 

Another ai model is in charge of sending the api request and you are in charge of parsing the results.


The following is the plugin that was used for this request:

${JSON.stringify(summary, null, 2)}


And these are some example results for the plugin. Follow the a similar format when creating a human-readable response when possible.

${JSON.stringify(examples, null, 2)}

Current time is: ${new Date().toISOString()}

${userLocation ? `The user is located in ${userLocation}` : ''}
`;

  return prompt;
};
