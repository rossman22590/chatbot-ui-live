import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { LearningScreenInitialState } from './Settings.state';

export interface LearningScreenContextProps {
  state: LearningScreenInitialState;
  dispatch: Dispatch<ActionType<LearningScreenInitialState>>;
  handleAddFile: (file: Blob) => void;
  handleAddLink: (url: string, recurse: false) => void;
  handleRemoveFile: (fileId: string) => void;
}

const PrimaryMenuContext = createContext<LearningScreenContextProps>(
  undefined!,
);

export default PrimaryMenuContext;
