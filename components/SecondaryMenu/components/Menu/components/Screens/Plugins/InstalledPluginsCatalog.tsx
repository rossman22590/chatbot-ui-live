import { IconMistOff } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { InstalledPlugin } from '@/types/plugin';

import HomeContext from '@/pages/api/home/home.context';

import { InstalledPluginList } from './components/InstalledPluginList';
import Search from '@/components/Common/Search';

import InstalledPluginsCatalogContext from './InstalledPluginsCatalog.context';
import {
  InstalledPluginsCatalogInitialState,
  initialState,
} from './InstalledPluginsCatalog.state';

export const InstalledPluginsCatalog = () => {
  const [plugins, setPlugins] = useState<InstalledPlugin[]>([]);

  const { t } = useTranslation('plugins');

  const installedPluginsCatalogContextValue =
    useCreateReducer<InstalledPluginsCatalogInitialState>({
      initialState,
    });

  const {
    state: { searchQuery, filteredPlugins },
    dispatch: pluginCatalogDispatch,
  } = installedPluginsCatalogContextValue;

  const {
    state: { installedPlugins },
  } = useContext(HomeContext);

  useEffect(() => {
    if (searchQuery === '') {
      pluginCatalogDispatch({
        field: 'filteredPlugins',
        value: plugins,
      });
    } else {
      const filteredPlugins = plugins.filter((quickView) => {
        const searchable =
          quickView.manifest.name_for_human.toLocaleLowerCase() +
          ' ' +
          quickView.manifest.description_for_human.toLocaleLowerCase() +
          ' ' +
          quickView.manifest.author?.toLocaleLowerCase() +
          ' ' +
          quickView.manifest.tags?.toLocaleLowerCase();
        return searchable.toLowerCase().includes(searchQuery.toLowerCase());
      });

      pluginCatalogDispatch({
        field: 'filteredPlugins',
        value: filteredPlugins,
      });
    }
  }, [searchQuery, plugins, pluginCatalogDispatch]);

  useEffect(() => {
    setPlugins(installedPlugins);
  }, [installedPlugins]);

  const doSearch = (query: string) =>
    pluginCatalogDispatch({ field: 'searchQuery', value: query });

  return (
    <InstalledPluginsCatalogContext.Provider
      value={{
        ...installedPluginsCatalogContextValue,
      }}
    >
      <div className="flex items-center gap-2 w-full p-0 h-[46px]">
        <Search
          placeholder={t('Search...') || ''}
          searchTerm={searchQuery}
          onSearch={doSearch}
        />
      </div>

      <div className="flex-grow overflow-auto">
        {filteredPlugins?.length > 0 ? (
          <div className="pt-2">
            <InstalledPluginList plugins={filteredPlugins} />
          </div>
        ) : (
          <div className="mt-8 select-none text-center text-black dark:text-white opacity-50">
            <IconMistOff className="mx-auto mb-3" />
            <span className="text-[14px] leading-normal">
              {t('No plugins found.')}
            </span>
          </div>
        )}
      </div>
    </InstalledPluginsCatalogContext.Provider>
  );
};
