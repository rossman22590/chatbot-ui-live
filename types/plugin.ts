import { KeyValuePair } from './data';

import path from 'path';

export interface PluginManifest {
  id: string;
  homepage: string;
  schema_version: string;
  name_for_model: string;
  name_for_human: string;
  description_for_model: string;
  description_for_human: string;
  auth: PluginAuthentication | null;
  api: PluginApiInfo;
  logo_url: string;
  author: string;
  contact_email: string;
  tags: string;
}

export interface PluginApiInfo {
  type: string;
  url: string;
  has_user_authentication: boolean;
}

export interface QuickViewPlugin {
  id: string;
  name: string;
  logo_url: string;
  author: string;
  description: string;
  homepage: string;
  version: string;
}

export interface ServerSidePlugin {
  id: string;
  jwt_secret?: string;
  paths: Map<string, string>;
}

export interface PluginCall {
  id: string;
  operationId: string;
  args: Map<string, string>;
}

export interface PluginAuthentication {
  type: string;
  authorization_type: string;
}

export interface PluginInfo {
  title: string;
  description: string;
  author: string;
  version: string;
  servers: [
    {
      url: string;
    },
  ];
}

export interface PluginOperation {
  summary: string;
  description: string;
  operationId: string;
  requestBody: {
    content: {
      'application/json': {
        schema: any;
      };
    };
  };
  responses: {
    [statusCode: string]: {
      description: string;
      content: any;
    };
  };
  security: [
    {
      [securityType: string]: string[];
    },
  ];
}

export interface PluginPath {
  [path: string]: {
    [method: string]: PluginOperation;
  };
}

export interface PluginSetting {
  [key: string]: {
    name: string;
    description: string;
    type: string;
  };
}

export interface PluginExample {
  [path: string]: {
    input: string;
    output: string;
  };
}

export interface PluginOpenApi {
  openapi: string;
  info: PluginInfo;
  paths: PluginPath;
  components: any;
  settings: PluginSetting;
  examples: PluginExample;
}

export interface InstalledPlugin {
  manifest: PluginManifest;
  api: PluginOpenApi;
}

export interface Plugin {
  id: PluginID;
  name: PluginName;
  requiredKeys: KeyValuePair[];
}

export interface PluginKey {
  pluginId: PluginID;
  requiredKeys: KeyValuePair[];
}

export enum PluginID {
  GOOGLE_SEARCH = 'google-search',
}

export enum PluginName {
  GOOGLE_SEARCH = 'Google Search',
}

export const Plugins: Record<PluginID, Plugin> = {
  [PluginID.GOOGLE_SEARCH]: {
    id: PluginID.GOOGLE_SEARCH,
    name: PluginName.GOOGLE_SEARCH,
    requiredKeys: [
      {
        key: 'GOOGLE_API_KEY',
        value: '',
      },
      {
        key: 'GOOGLE_CSE_ID',
        value: '',
      },
    ],
  },
};

export const PluginList = Object.values(Plugins);
