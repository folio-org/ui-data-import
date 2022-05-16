import { createOkapiHeaders } from '@folio/stripes-data-transfer-components';

/**
 * Deletes job executions
 *
 * @param {array} jobExecutionsIds - array of job executions ids
 * @param {{ url: string }} okapi
 * @returns {Promise<any>} Returns response of deleting job executions request
 */
export const deleteJobExecutions = async (jobExecutionsIds, okapi) => {
  const { url } = okapi;
  const ids = Array.isArray(jobExecutionsIds) ? jobExecutionsIds : [...jobExecutionsIds];

  try {
    const path = `${url}/change-manager/jobExecutions`;
    const response = await fetch(path,
      {
        method: 'DELETE',
        headers: {
          ...createOkapiHeaders(okapi),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids })
      });

    if (!response.ok) {
      throw new Error('Cannot delete jobExecutions');
    }

    return await response.json();
  } catch (error) {
    console.error(error); // eslint-disable-line no-console

    return error;
  }
};
