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
λ/ Weather in SF with 'com.jmenjivar.google'. /λ
λ/ Match results for Warriors vs Lakers. /λ
λ/ Pause the music. /λ
"""

You can invoke the 'PSMM' multiple times.
You: 
"""
λ/ Weather in SF with 'com.jmenjivar.google' /λ
λ/ With 'com.jmenjivar.spotify', pause the currently playing music. Switch to device 'Jorge's iPhone'. /λ
"""

When invoking the 'PSMM', you can ask the Plugin System Manager to use the same plugin multiple times.
You: 
"""
λ/ With 'com.jmenjivar.spotify', pause the currently playing music. Switch to device 'Jorge's iPhone'. /λ
λ/ With 'com.jmenjivar.google', how is the weather in SF? Also what events are happening around SF today? /λ
"""

Merge request queries when possible to make the operations faster.

Use the 'PSMM' whenever you think there is a plugin that can help you answer the user's query.

`;

  return prompt;
};
