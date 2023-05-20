import type { NextApiRequest, NextApiResponse } from 'next';

import { QuickViewPlugin } from '@/types/plugin';

import { manifests } from './database/sample-plugins';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const filteredPlugins = manifests.map((manifest) => {
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
