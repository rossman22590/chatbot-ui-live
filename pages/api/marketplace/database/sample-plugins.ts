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
      url: '/plugins/google/.well-known/openapi.yaml',
      has_user_authentication: false,
    },
    author: 'Jorge Menjivar',
    logo_url: '/plugins/google/.well-known/logo.png',
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
      url: '/plugins/python/.well-known/openapi.yaml',
      has_user_authentication: false,
    },
    author: 'Jorge Menjivar',
    logo_url: '/plugins/python/.well-known/logo.png',
    contact_email: 'jorgemenjivar1997@gmail.com',
    tags: 'python, interpreter',
  },
  {
    id: 'com.jmenjivar.uber',
    homepage: '/plugins/uber/README.md',
    schema_version: 'v1',
    name_for_model: 'uber plugin',
    name_for_human: 'Uber',
    description_for_model:
      'Plugin for managing rides with Uber. Use it whenever a user asks you to get them an uber. You can also use it to get the price of a ride.',
    description_for_human: 'Manage your rides with Uber.',
    auth: {
      type: 'user_http',
      authorization_type: 'bearer',
    },
    api: {
      type: 'openapi',
      url: '/plugins/uber/.well-known/openapi.yaml',
      has_user_authentication: false,
    },
    author: 'Uber',
    logo_url: '/plugins/uber/.well-known/logo.png',
    contact_email: 'jorgemenjivar1997@gmail.com',
    tags: 'uber, rides',
  },
  {
    id: 'com.jmenjivar.spotify',
    homepage: '/plugins/spotify/README.md',
    schema_version: 'v1',
    name_for_model: 'spotify plugin',
    name_for_human: 'Spotify',
    description_for_model:
      'Plugin for managing music with Spotify. Use it whenever a user asks you to play a song. You can also use it to get the lyrics of a song.',
    description_for_human: 'Control your music and view lyrics with Spotify.',
    auth: {
      type: 'user_http',
      authorization_type: 'bearer',
    },
    api: {
      type: 'openapi',
      url: '/plugins/spotify/.well-known/openapi.yaml',
      has_user_authentication: false,
    },
    author: 'Spotify',
    logo_url: '/plugins/spotify/.well-known/logo.png',
    contact_email: 'jorgemenjivar1997@gmail.com',
    tags: 'music, songs',
  },
];
