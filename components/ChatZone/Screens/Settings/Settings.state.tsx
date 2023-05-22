import { LearningFile } from '@/types/learning';

export interface LearningScreenInitialState {
  searchQuery: string;
  filteredFiles: LearningFile[];
  selectedSetting: LearningFile | null;
}

export const initialState: LearningScreenInitialState = {
  searchQuery: '',
  filteredFiles: [],
  selectedSetting: null,
};
