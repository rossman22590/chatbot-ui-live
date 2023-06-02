import { InstalledPlugin } from '@/types/plugin';

export interface ChatInitialState {
  enabledPlugins: InstalledPlugin[];
}

export const initialState: ChatInitialState = {
  enabledPlugins: [],
};
