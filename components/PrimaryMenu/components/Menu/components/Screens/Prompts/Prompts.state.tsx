import { Prompt } from '@chatbot-ui/core/types/prompt';

export interface PromptsInitialState {
  searchTerm: string;
  filteredPrompts: Prompt[];
}

export const initialState: PromptsInitialState = {
  searchTerm: '',
  filteredPrompts: [],
};
