import { InstalledPlugin, PluginCall, PluginOperation } from '@/types/plugin';

export async function callApi(
  call: PluginCall,
  plugin: InstalledPlugin,
  authToken?: string,
) {
  let authHeader = '';

  console.log('callApi', call, plugin);

  const pluginPaths = plugin.api.paths;

  let callPath: string | null = null;
  let callMethod: string | null = null;
  let operation: PluginOperation | null = null;
  for (const path in pluginPaths) {
    for (const method in plugin.api.paths[path]) {
      const tmpOperation = plugin.api.paths[path][method];
      if (tmpOperation.operationId === call.operationId) {
        callPath = path;
        callMethod = method;
        operation = tmpOperation;
        break;
      }
    }
  }

  if (!callPath || !callMethod || !operation) {
    console.log('Operation not found:', call.operationId);
    return { error: 'operation-not-found' };
  }

  if (plugin.manifest.auth.type === 'oauth') {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${plugin.manifest.id}-token=`))
      ?.split('=')[1];
    if (!token) {
      return { error: 'no-auth' };
    } else {
      authHeader = `Bearer ${token}`;
    }
  }

  const server = plugin.api.info.servers[0].url;
  const url = `${server}${callPath}`;

  const response = await fetch(url, {
    method: callMethod,
    body: JSON.stringify(call.args),
    headers: {
      Authorization: authHeader,
    },
  });

  try {
    const body = await response.json();
    return { data: body };
  } catch (err) {
    console.log('Error parsing response', err);
    console.log('Response', response);
    console.log('Response body', response.body);
    return { error: 'error-parsing-response' };
  }
}
