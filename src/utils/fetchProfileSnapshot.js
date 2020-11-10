import { createOkapiHeaders } from '@folio/stripes-data-transfer-components';

/**
 * Gets a profile snapshot.
 *
 * @param {string} profileId
 * @param {string} profileType
 * @param {string} jobProfileId
 * @param {object} okapi
 * @returns {Promise<{}>} Returns profile snapshot.
 */
export const fetchProfileSnapshot = async (profileId, profileType, jobProfileId, okapi) => {
  const { url } = okapi;

  try {
    const path = `${url}/data-import-profiles/profileSnapshots/${profileId}?profileType=${profileType}&jobProfileId=${jobProfileId}`;
    const response = await fetch(path,
      { headers: { ...createOkapiHeaders(okapi) } });

    if (!response.ok) {
      throw new Error('Cannot fetch profile snapshot');
    }

    return await response.json();
  } catch (error) {
    console.error(error); // eslint-disable-line no-console

    return {};
  }
};
