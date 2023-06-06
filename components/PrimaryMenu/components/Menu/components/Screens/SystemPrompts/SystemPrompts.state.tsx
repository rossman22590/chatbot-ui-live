import { SystemPrompt } from '@chatbot-ui/core/types/system-prompt';

export interface SystemPromptsInitialState {
  searchTerm: string;
  filteredSystemPrompts: SystemPrompt[];
}

export const initialState: SystemPromptsInitialState = {
  searchTerm: '',
  filteredSystemPrompts: [],
};
