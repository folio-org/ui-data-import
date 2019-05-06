import { createOkapiHeaders } from './createOkapiHeaders';

export const fetchUploadDefinition = ({ okapi, id }) => {
  const { url: host } = okapi;

  return fetch(`${host}/data-import/uploadDefinitions/${id}`, { headers: createOkapiHeaders(okapi) });
};

export const fetchJobProfile = ({ okapi, id }) => {
  const { url: host } = okapi;

  return fetch(`${host}/data-import-profiles/jobProfiles/${id}`, { headers: createOkapiHeaders(okapi) });
};

export const loadMarcRecords = async ({
  okapi,
  uploadDefinitionId,
  jobProfileId,
}) => {
  const responses = await Promise.all([
    fetchUploadDefinition({
      id: uploadDefinitionId,
      okapi,
    }),
    fetchJobProfile({
      id: jobProfileId,
      okapi,
    }),
  ]);

  responses.some(response => {
    if (!response.ok) {
      throw response;
    }

    return false;
  });

  const [uploadDefinition, jobProfile] = await Promise.all(responses.map(response => response.json()));

  const { url: host } = okapi;

  const response = await fetch(
    `${host}/data-import/uploadDefinitions/${uploadDefinitionId}/processFiles`, {
      method: 'POST',
      headers: {
        ...createOkapiHeaders(okapi),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uploadDefinition,
        jobProfileInfo: jobProfile,
      }),
    }
  );

  if (!response.ok) {
    throw response;
  }

  return response;
};
