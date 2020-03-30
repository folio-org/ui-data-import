import { createOkapiHeaders } from './createOkapiHeaders';

/**
 * Gets a profile snapshot.
 *
 * @param {string} profileId
 * @param {string} profileType
 * @param {object} okapi
 * @returns {Promise<{}>} Returns profile snapshot.
 */
export const fetchProfileSnapshot = async (profileId, profileType, okapi) => {
  const { url } = okapi;

  try {
    const response = await fetch(`${url}/data-import-profiles/profileSnapshots/${profileId}?profileType=${profileType}`,
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
