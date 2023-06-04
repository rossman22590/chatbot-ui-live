import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { InstalledPluginsCatalogInitialState } from './InstalledPluginsCatalog.state';

export interface InstalledPluginsCatalogContextProps {
  state: InstalledPluginsCatalogInitialState;
  dispatch: Dispatch<ActionType<InstalledPluginsCatalogInitialState>>;
}

const PrimaryMenuContext = createContext<InstalledPluginsCatalogContextProps>(
  undefined!,
);

export default PrimaryMenuContext;
