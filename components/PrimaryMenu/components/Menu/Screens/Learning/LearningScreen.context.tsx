import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { Namespace } from '@/types/learning';

import { LearningScreenInitialState } from './LearningScreen.state';

export interface LearningScreenContextProps {
  state: LearningScreenInitialState;
  dispatch: Dispatch<ActionType<LearningScreenInitialState>>;
  handleAddFile: (file: Blob) => Promise<void>;
  handleAddURLs: (url: string[], recurse: boolean) => Promise<void>;
  handleRemoveFile: (fileId: string) => Promise<void>;
  handleAddNamespace: (
    namespace: Namespace,
    file?: File,
    urls?: string[],
  ) => Promise<void>;
  handleDeleteNamespace: (
    namespace: Namespace,
  ) => Promise<void>;
}

const PrimaryMenuContext = createContext<LearningScreenContextProps>(
  undefined!,
);

export default PrimaryMenuContext;
