export interface PluginInput {
  [model: string]: {
    url: string;
  };
}

export interface PluginOutput {
  [model: string]: {
    url: string;
  };
}

export interface PluginManifest {
  id: string;
  homepage: string;
  schema_version: string;
  name_for_model: string;
  name_for_human: string;
  description_for_model: string;
  description_for_human: string;
  auth: PluginAuthentication;
  api: PluginApiInfo;
  logo_url: string;
  author: string;
  contact_email: string;
  tags: string;
  input_prompt_url: string;
  output_prompt_url: string | null;
  input: PluginInput;
  output: PluginOutput;
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
  tags: string;
}

export interface ServerSidePlugin {
  id: string;
  jwt_secret?: string;
  paths: Map<string, string>;
}

export interface PSMMCall {
  id: string;
  query: string;
}
export interface PluginCall {
  plugin: InstalledPlugin;
  operationId: string;
  args: any;
  goal: string;
}

export interface PSMMMessage {
  id: string;
  text: string;
}

export interface PluginAuthentication {
  type: 'oauth' | 'none' | 'automatic';
  authorization_type?: string;
  client_url?: string;
  authorization_url?: string;
  scope?: string;
  authorization_content_type?: string;
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

export interface PluginOpenApi {
  openapi: string;
  info: PluginInfo;
  paths: PluginPath;
  components: any;
  settings: PluginSetting;
}

export interface InstalledPluginInput {
  model: string;
  prompt: string;
}

export interface InstalledPluginOutput {
  model: string;
  prompt: string;
}

export interface InstalledPlugin {
  manifest: PluginManifest;
  api: PluginOpenApi;
  input_models: InstalledPluginInput[];
  output_models: InstalledPluginOutput[];
}
