import { IconMistOff } from '@tabler/icons-react';
import { useCallback, useContext, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { MARKETPLACE_URL } from '@/utils/app/const';
import {
  getManifest,
  getManifestFromUrl,
  getPluginApi,
  getPluginPrompt,
} from '@/utils/app/plugins/marketplace';
import {
  localAddInstalledPlugin,
  localDeleteInstalledPlugin,
} from '@/utils/app/storage/local/plugins';

import { InstalledPlugin, QuickViewPlugin } from '@/types/plugin';

import HomeContext from '@/pages/api/home/home.context';

import { ExtraOptionsButton } from './components/ExtraOptionsButton';
import { PluginList } from './components/PluginList';
import Search from '@/components/Common/Search';

import PluginCatalogContext from './PluginCatalog.context';
import { PluginCatalogInitialState, initialState } from './PluginCatalog.state';

export const PluginCatalog = () => {
  const [quickViews, setQuickViews] = useState<QuickViewPlugin[]>([]);

  const { t } = useTranslation('sidebar');

  const pluginCatalogContextValue = useCreateReducer<PluginCatalogInitialState>(
    {
      initialState,
    },
  );

  const {
    state: { searchQuery, filteredPlugins },
    dispatch: pluginCatalogDispatch,
  } = pluginCatalogContextValue;

  const {
    state: { user, installedPlugins, selectedPlugin },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const handleSelect = (plugin: QuickViewPlugin) => {
    if (selectedPlugin !== plugin) {
      homeDispatch({ field: 'selectedPlugin', value: plugin });
      homeDispatch({ field: 'display', value: 'plugins' });
    } else {
      homeDispatch({ field: 'selectedPlugin', value: null });
      homeDispatch({ field: 'display', value: 'chat' });
    }
  };

  // PLUGIN OPERATIONS  --------------------------------------------
  const handleInstallFromUrls = async (urls: string[]) => {
    for (const url of urls) {
      const manifest = await getManifestFromUrl(url);

      if (!manifest) {
        console.error('Plugin manifest not found');
        return;
      }

      const pluginAPI = await getPluginApi(manifest.api.url);

      if (!pluginAPI) {
        console.error('Plugin API not found');
        return;
      }

      const prompt = await getPluginPrompt(manifest.prompt_url);

      if (!prompt) {
        console.error('Plugin prompt not found');
        return;
      }

      const installedPlugin: InstalledPlugin = {
        manifest: manifest,
        api: pluginAPI,
        prompt: prompt,
      };

      const updatedPlugins = localAddInstalledPlugin(user, installedPlugin);

      console.log('Updated Plugins', updatedPlugins);

      homeDispatch({ field: 'installedPlugins', value: updatedPlugins });

      console.log('Plugin installed');
      console.log('Installed Plugins', installedPlugins);
    }
  };

  const handleInstall = async (pluginId: string) => {
    const manifest = await getManifest(pluginId);

    if (!manifest) {
      console.error('Plugin manifest not found');
      return;
    }

    const pluginAPI = await getPluginApi(manifest.api.url);

    if (!pluginAPI) {
      console.error('Plugin API not found');
      return;
    }

    const prompt = await getPluginPrompt(manifest.prompt_url);

    if (!prompt) {
      console.error('Plugin prompt not found');
      return;
    }

    const installedPlugin: InstalledPlugin = {
      manifest: manifest,
      api: pluginAPI,
      prompt: prompt,
    };

    const updatedPlugins = localAddInstalledPlugin(user, installedPlugin);
    homeDispatch({ field: 'installedPlugins', value: updatedPlugins });
  };

  const handleUninstall = async (pluginId: string) => {
    const updatedPlugins = localDeleteInstalledPlugin(user, pluginId);
    homeDispatch({ field: 'installedPlugins', value: updatedPlugins });
  };

  const getQuickViewPlugins = (installedPlugins: InstalledPlugin[]) => {
    const quickViews: QuickViewPlugin[] = [];
    for (const plugin of installedPlugins) {
      const quickView: QuickViewPlugin = {
        id: plugin.manifest.id,
        name: plugin.manifest.name_for_human,
        author: plugin.manifest.author,
        description: plugin.manifest.description_for_human,
        logo_url: plugin.manifest.logo_url,
        homepage: plugin.manifest.homepage,
        version: plugin.manifest.schema_version,
        tags: plugin.manifest.tags,
      };

      quickViews.push(quickView);
    }

    return quickViews;
  };

  useEffect(() => {
    if (searchQuery === '') {
      pluginCatalogDispatch({
        field: 'filteredPlugins',
        value: quickViews,
      });
    } else {
      const filteredPlugins = quickViews.filter((quickView) => {
        const searchable =
          quickView.name.toLocaleLowerCase() +
          ' ' +
          quickView.description.toLocaleLowerCase() +
          ' ' +
          quickView.author.toLocaleLowerCase() +
          ' ' +
          quickView.tags.toLocaleLowerCase();
        return searchable.toLowerCase().includes(searchQuery.toLowerCase());
      });

      pluginCatalogDispatch({
        field: 'filteredPlugins',
        value: filteredPlugins,
      });
    }
  }, [searchQuery, quickViews, pluginCatalogDispatch]);

  useEffect(() => {
    setQuickViews(getQuickViewPlugins(installedPlugins));
  }, [installedPlugins]);

  const doSearch = (query: string) =>
    pluginCatalogDispatch({ field: 'searchQuery', value: query });

  return (
    <PluginCatalogContext.Provider
      value={{
        ...pluginCatalogContextValue,
        handleInstall,
        handleInstallFromUrls,
        handleUninstall,
        handleSelect,
      }}
    >
      <div className="flex items-center gap-2 w-full p-0 h-[46px]">
        <Search
          placeholder={t('Search...') || ''}
          searchTerm={searchQuery}
          onSearch={doSearch}
        />
        <ExtraOptionsButton />
      </div>

      <div className="flex-grow overflow-auto">
        {filteredPlugins?.length > 0 ? (
          <div className="pt-2">
            <PluginList plugins={filteredPlugins} />
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
    </PluginCatalogContext.Provider>
  );
};
