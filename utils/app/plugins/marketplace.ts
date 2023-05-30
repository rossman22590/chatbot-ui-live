import { PluginManifest, PluginOpenApi } from '@/types/plugin';

import { MARKETPLACE_URL } from '../const';

import * as yaml from 'js-yaml';

export const getManifest = async (pluginId: string) => {
  const response = await fetch(`${MARKETPLACE_URL}/install`, {
    method: 'POST',
    body: JSON.stringify({
      plugin_id: pluginId,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    return;
  }

  const manifest: PluginManifest = await response.json();

  return manifest;
};

export const getManifestFromUrl = async (url: string) => {
  const response = await fetch(`${url}/.well-known/ai-plugin.json`);

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    return;
  }

  const manifest: PluginManifest = await response.json();

  return manifest;
};

export const getPluginApi = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    return;
  }

  const rawPluginApi = await response.text();

  const pluginApi: PluginOpenApi = yaml.load(rawPluginApi) as PluginOpenApi;

  return pluginApi;
};

export const getPluginPrompt = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    return;
  }

  const prompt = await response.text();

  return prompt;
};
