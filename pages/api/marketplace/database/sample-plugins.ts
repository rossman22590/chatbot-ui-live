import { PluginManifest } from '@/types/plugin';

export const manifests: PluginManifest[] = [
  {
    id: 'com.jmenjivar.google',
    homepage: '/plugins/google/README.md',
    schema_version: 'v1',
    name_for_model: 'google search plugin',
    name_for_human: 'Google Search',
    description_for_model:
      'Plugin for searching the internet using google to find answers to questions and retrieve relevant information. Use it whenever a user asks something that might be found on the internet.',
    description_for_human: 'Search through your documents.',
    auth: {
      type: 'user_http',
      authorization_type: 'bearer',
    },
    api: {
      type: 'openapi',
      url: '/plugins/google/openapi.yaml',
      has_user_authentication: false,
    },
    author: 'Jorge Menjivar',
    logo_url: '/plugins/google/logo.png',
    contact_email: 'jorgemenjivar1997@gmail.com',
    tags: 'search, google',
  },
  {
    id: 'com.jmenjivar.python',
    homepage: '/plugins/python/README.md',
    schema_version: 'v1',
    name_for_model: 'python interpreter plugin',
    name_for_human: 'Python Interpreter',
    description_for_model:
      'Plugin for executing python code. Use it whenever a user asks you to execute python code.',
    description_for_human: 'Run python code from the chat.',
    auth: {
      type: 'user_http',
      authorization_type: 'bearer',
    },
    api: {
      type: 'openapi',
      url: '/plugins/python/openapi.yaml',
      has_user_authentication: false,
    },
    author: 'Jorge Menjivar',
    logo_url: '/plugins/python/logo.png',
    contact_email: 'jorgemenjivar1997@gmail.com',
    tags: 'python, interpreter',
  },
];
