import { InstalledPlugin } from '@/types/plugin';

export const getPluginSystemPrompt = (
  currentPrompt: string,
  enabledPlugins: InstalledPlugin[],
  userLocation: string | null,
) => {
  const summarizedPlugins = [];
  for (const plugin of enabledPlugins) {
    const summary = {
      id: plugin.manifest.id,
      name: plugin.manifest.name_for_model,
      description: plugin.manifest.description_for_model,
      paths: plugin.api.paths,
      schemas: plugin.api.components.schemas,
    };

    summarizedPlugins.push(summary);
  }

  let prompt = currentPrompt;
  prompt += `\n\n
You have been granted access to use plugins installed by the user and you now have access to real time data.

To use a plugin simply define a PluginCall within the special characters 'λ/' and '/λ'

Plugin call is defined as:
interface PluginCall {
  id: string;
  operationId: string;
  args: Map<string, string>;
}

The calls to the plugins are done automatically, by you the ai model.
You should execute plugin calls without asking the user for permission.

You can execute multiple plugin calls at the same time, but you should not execute more than 5 plugin calls at the same time.
Ask for user consent if you need to execute more than 5 plugin calls at the same time.

You can execute plugin calls in any order you want.

Do not use regular language or explanations before or after executing a call as it will be discarded.

Use the schema withing the operation to know what arguments to pass to the plugin.

Here is the correct way to execute a plugin call:

User: 
--- start of message ---
How's the weather in SF?
--- end of message ---

AI Model: 
--- start of message ---
λ/ { "id": "com.jmenjivar.google", "operationId": "search", "args": { "query": "what's the weather in sf" } } /λ
--- end of message ---


These are the plugins that the user has enabled for you to use:

${JSON.stringify(summarizedPlugins, null, 2)}

Current time is: ${new Date().toISOString()}

${
  userLocation
    ? `The user is located in ${userLocation}`
    : 'User location is unknown. Ask the user for their location if needed.'
}
`;

  return prompt;
};
