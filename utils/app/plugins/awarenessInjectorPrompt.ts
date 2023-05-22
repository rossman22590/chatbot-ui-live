import { InstalledPlugin } from '@/types/plugin';

// This prompt is injected into the chat when the user has installed plugins
export const injectKnowledgeOfPluginSystem = (
  currentPrompt: string,
  enabledPlugins: InstalledPlugin[],
) => {
  const summarizedPlugins = [];
  for (const plugin of enabledPlugins) {
    const summary = {
      id: plugin.manifest.id,
      name: plugin.manifest.name_for_model,
    };

    summarizedPlugins.push(summary);
  }

  let prompt = currentPrompt;
  prompt += `\n\n

Furthermore, you have been granted access to use plugins installed by the user and you now have access to real time data.

To use a plugin we need to invoke another model called Plugin System Manager Model 'PSMM', which has complete knowledge of how to use 
the plugins and directly talks to them on your behalf.

To invoke the 'PSMM' simply start the query with the characters 'λ/' and finish with the characters '/λ'.

You can talk to this model in whatever language you want,
but you should not use regular language or explanations before or after invoking it as it will be discarded.


These are the plugins that the user has installed:
${JSON.stringify(summarizedPlugins, null, 2)}


The following are examples of how to invoke the 'PSMM':

You: 
"""
λ/ Weather in SF using 'com.jmenjivar.google'. /λ
"""

You can also invoke the 'PSMM' multiple times.
You: 
"""
λ/ Weather in SF using 'com.jmenjivar.google' /λ
λ/ Use 'com.jmenjivar.spotify' to pause the currently playing music. /λ
λ/ Switch to device 'Jorge's iPhone' with 'com.jmenjivar.spotify' /λ
"""

When invoking the 'PSMM', you can ask the Plugin System Manager to use the same plugin multiple times.
You: 
"""
λ/ Weather in SF using 'com.jmenjivar.google'. /λ
λ/ What events are happening around SF today? /λ
"""

Break down the query into multiple queries when possible. To make the operations faster.

Use the 'PSMM' whenever you think there is a plugin that can help you answer the user's query.

`;

  return prompt;
};
