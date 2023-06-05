import { AiModel, PossibleAiModels } from '@chatbot-ui/core/types/ai-models';

export const config = {
  runtime: 'edge',
};

export async function getAvailableAnthropicModels(key?: string) {
  const models: AiModel[] = [
    PossibleAiModels['claude-v1'],
    PossibleAiModels['claude-v1-100k'],
    PossibleAiModels['claude-instant-v1'],
    PossibleAiModels['claude-instant-v1-100k'],
  ];

  return { data: models };
}
