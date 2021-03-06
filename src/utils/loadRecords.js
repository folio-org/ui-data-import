import {
  createOkapiHeaders,
  createUrl,
} from '@folio/stripes-data-transfer-components';

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
  defaultMapping,
}) => {
  const { url: host } = okapi;

  const uploadDefinition = await fetchUploadDefinition({
    id: uploadDefinitionId,
    okapi,
  });

  const uploadDefinitionsURL = createUrl(`${host}/data-import/uploadDefinitions/${uploadDefinitionId}/processFiles`,
    { defaultMapping }, false);

  const response = await fetch(uploadDefinitionsURL, {
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
