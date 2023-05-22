import { LearningFile } from '@/types/learning';

export interface LearningScreenInitialState {
  searchQuery: string;
  filteredFiles: LearningFile[];
  selectedFile: LearningFile | null;
}

export const initialState: LearningScreenInitialState = {
  searchQuery: '',
  filteredFiles: [],
  selectedFile: null,
};
