import { createOkapiHeaders } from './createOkapiHeaders';

export const fetchUploadDefinition = async ({
  okapi,
  id,
}) => {
  const { url: host } = okapi;

  const response = await fetch(
    `${host}/data-import/uploadDefinitions/${id}`,
    { headers: createOkapiHeaders(okapi) },
  );

  if (!response.ok) {
    throw response;
  }

  return response.json();
};

export const fetchJobProfile = ({
  okapi,
  id,
}) => {
  const { url: host } = okapi;

  return fetch(`${host}/data-import-profiles/jobProfiles/${id}`, { headers: createOkapiHeaders(okapi) });
};

export const loadRecords = async ({
  okapi,
  uploadDefinitionId,
  jobProfileInfo,
}) => {
  const { url: host } = okapi;

  const uploadDefinition = await fetchUploadDefinition({
    id: uploadDefinitionId,
    okapi,
  });

  const response = await fetch(`${host}/data-import/uploadDefinitions/${uploadDefinitionId}/processFiles`, {
    method: 'POST',
    headers: {
      ...createOkapiHeaders(okapi),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uploadDefinition,
      jobProfileInfo,
    }),
  });

  if (!response.ok) {
    throw response;
  }

  return response;
};

export const loadMarcRecords = async ({
  okapi,
  uploadDefinitionId,
}) => {
  // `jobProfileInfo` is hardcoded to point to the default job profile (MODSOURMAN-113)
  // later jobProfile will be picked through UI
  const jobProfileInfo = {
    id: '22fafcc3-f582-493d-88b0-3c538480cd83',
    name: 'Create MARC Bibs',
    dataType: 'MARC',
  };

  const { url: host } = okapi;

  const uploadDefinition = await fetchUploadDefinition({
    id: uploadDefinitionId,
    okapi,
  });

  const response = await fetch(`${host}/data-import/uploadDefinitions/${uploadDefinitionId}/processFiles`, {
    method: 'POST',
    headers: {
      ...createOkapiHeaders(okapi),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uploadDefinition,
      jobProfileInfo,
    }),
  });

  if (!response.ok) {
    throw response;
  }

  return response;
};
