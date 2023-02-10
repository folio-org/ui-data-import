export const getModuleVersion = (modules, moduleName) => {
  const version = modules.find(module => module.name === moduleName);

  return version ? version.id : undefined;
};

export const fetchJsonSchema = async (path, module, okapi) => {
  try {
    const response = await fetch(`${okapi.url}/_/jsonSchemas?path=${path}`, {
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Module-Id': module,
        ...(okapi.token && { 'X-Okapi-Token': okapi.token }),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Cannot fetch resources from "${path}"`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error); // eslint-disable-line no-console

    return {};
  }
};

export const handleAllRequests = async (requests, requestTo, callback) => {
  try {
    await Promise.all(requests)
      .then(response => response.map(item => item.properties))
      .then(properties => callback(properties, requestTo));
  } catch (error) {
    callback({}, requestTo);
  }
};
