import type { NextApiRequest, NextApiResponse } from 'next';

import { manifests } from './database/sample-plugins';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = JSON.parse(req.body);

  const pluginId = body.plugin_id;

  const manifest = manifests.find((plugin) => plugin.id === pluginId);

  if (!manifest) {
    res.status(404).json({ message: 'Plugin not found' });
    return;
  }
  res.status(200).json(manifest);
}
