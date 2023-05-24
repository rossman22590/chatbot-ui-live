import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { QuickViewPlugin } from '@/types/plugin';

import { PluginCatalogInitialState } from './PluginCatalog.state';

export interface PluginCatalogContextProps {
  state: PluginCatalogInitialState;
  dispatch: Dispatch<ActionType<PluginCatalogInitialState>>;
  handleInstallPlugin: (pluginId: string) => void;
  handleUninstallPlugin: (pluginId: string) => void;
  handleSelect: (plugin: QuickViewPlugin) => void;
}

const PrimaryMenuContext = createContext<PluginCatalogContextProps>(undefined!);

export default PrimaryMenuContext;
