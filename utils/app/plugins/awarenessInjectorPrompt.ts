import { InstalledPlugin } from '@/types/plugin';
import { AiModel } from '@chatbot-ui/core/types/ai-models';

// This prompt is injected into the chat when the user has installed plugins
export const injectKnowledgeOfPluginSystem = (
  model: AiModel,
  currentPrompt: string,
  enabledPlugins: InstalledPlugin[],
) => {
  const summarizedPlugins = [];
  for (const plugin of enabledPlugins) {
    const summary = {
      id: plugin.manifest.id,
      name: plugin.manifest.name_for_model,
      description: plugin.manifest.description_for_model,
    };

    summarizedPlugins.push(summary);
  }

  let prompt = currentPrompt;
  prompt += `\n\n
${model.vendor === 'Anthropic' ? 'Human:' : ''}
You have also been granted access to plugins installed by me, the user,
which also gives you access to real time data.

To use a plugin we need to invoke another model called the 'Plugin System Manager Model' (PSMM),
which has complete knowledge of how to use the plugins and directly talks to them on your behalf.

To invoke the 'PSMM' simply make a PSMM call surrounded by the characters 'λ/' and '/λ'.

The 'PSMM' takes a JSON object with two properties: 'id' and 'query'.
The 'id' is the id of the plugin you want to use
The 'query' is the query you want to ask or the goal you are trying to achieve on my behalf.

You can talk to this model in whatever language you want,
but you should not use regular language or explanations before or after invoking it as it will be discarded and wasted time.


These are the plugins that the user has installed:
${JSON.stringify(summarizedPlugins, null, 2)}


The following are examples of how to invoke the 'PSMM':

You: 
"""
λ/ {
  "id": "com.jmenjivar.google",
  "query": "Weather in SF."
} /λ
λ/ {
  "id": "com.jmenjivar.google",
  "query": "Match results for Warriors vs Lakers."
} /λ
λ/ {
  "id": "com.jmenjivar.spotify",
  "query": "Pause the music."  
} /λ
λ/ {
  "id": "com.jmenjivar.spotify",
  "query": "Pause the music."  
} /λ
λ/ {
  "id": "com.example.pluginId",
  "query": "Do something with the plugin."  
} /λ
λ/ {
  "id": "com.example.pluginId",
  "query": "Generate an image of a cat. Use a the model stable-diffusion."  
} /λ
λ/ {
  "id": "com.example.pluginId",
  "query": "Generate an image of a cat. Use a the model stable-diffusion. Do 20 steps."  
} /λ
"""

Both the 'id' and 'query' are required. They are both strings.

You can only call the 'PSMM' once per prompt.
Never call the 'PSMM' more than once per prompt.

Use the 'PSMM' whenever you think there is a plugin that can help you answer my
question or helps me achieve my goal.

Although it may seem that in this conversation you never made any calls to the 'PSMM',
you actually did. I just hid them from you to make the conversation more natural.
Continue using the 'PSMM' as normal and I will continue to hide the calls from you.

${model.vendor === 'Anthropic' ? 'Assistant: Great. I understand!' : ''}
`;

  console.log('prompt', prompt);

  return prompt;
};
