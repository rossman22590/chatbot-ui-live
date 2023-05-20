import { InstalledPlugin, PluginCall, PluginOperation } from '@/types/plugin';

export async function executeAll(
  pluginCalls: PluginCall[],
  enabledPlugins: InstalledPlugin[],
  authToken?: string,
) {
  const results = [];
  for (const call of pluginCalls) {
    const result = await execute(call, enabledPlugins, authToken);
    results.push({ operationId: call.operationId, result: result });
  }
  return results;
}

async function execute(
  call: PluginCall,
  enabledPlugins: InstalledPlugin[],
  authToken?: string,
) {
  const plugin = enabledPlugins.find(
    (plugin) => plugin.manifest.id === call.id,
  );
  if (!plugin) {
    console.log('Plugin not enabled:', call.id);
    return null;
  }

  let authHeader = '';

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
    return null;
  }

  if (operation.security) {
    if (!authToken) {
      console.log('No auth token provided');
      return null;
    } else {
      authHeader = `Bearer ${authToken}`;
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

  const resultJson = await response.json();
  return resultJson;
}
