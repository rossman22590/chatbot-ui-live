import { QuickViewPlugin } from '@/types/plugin';

export interface PluginCatalogInitialState {
  searchQuery: string;
  filteredPlugins: QuickViewPlugin[];
}

export const initialState: PluginCatalogInitialState = {
  searchQuery: '',
  filteredPlugins: [],
};
