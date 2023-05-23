import { LearningFile, Namespace } from '@/types/learning';

export interface LearningScreenInitialState {
  searchQuery: string;
  namespaces: Namespace[];
  filteredFiles: LearningFile[];
  selectedFile: LearningFile | null;
}

export const initialState: LearningScreenInitialState = {
  searchQuery: '',
  namespaces: [],
  filteredFiles: [],
  selectedFile: null,
};
