import type { NextApiRequest, NextApiResponse } from 'next';

import { QuickViewPlugin } from '@/types/plugin';

import { manifests } from './database/sample-plugins';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const urlQuery = req.query;

  const query = urlQuery.q as string;

  const filteredManifests = manifests.filter((plugin) => {
    const searchable =
      plugin.name_for_human.toLocaleLowerCase() +
      ' ' +
      plugin.description_for_human.toLocaleLowerCase() +
      ' ' +
      plugin.author.toLocaleLowerCase() +
      ' ' +
      plugin.tags.toLocaleLowerCase();
    return searchable.toLowerCase().includes(query.toLowerCase());
  });

  const filteredPlugins = filteredManifests.map((manifest) => {
    const plugin: QuickViewPlugin = {
      id: manifest.id,
      name: manifest.name_for_human,
      logo_url: manifest.logo_url,
      author: manifest.author,
      description: manifest.description_for_human,
      homepage: manifest.homepage,
      version: manifest.schema_version,
    };
    return plugin;
  });

  res.status(200).json(filteredPlugins);
}
