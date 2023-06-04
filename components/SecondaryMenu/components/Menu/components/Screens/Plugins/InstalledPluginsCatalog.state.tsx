import { InstalledPlugin } from '@/types/plugin';

export interface InstalledPluginsCatalogInitialState {
  searchQuery: string;
  filteredPlugins: InstalledPlugin[];
}

export const initialState: InstalledPluginsCatalogInitialState = {
  searchQuery: '',
  filteredPlugins: [],
};
