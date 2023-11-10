import { createOkapiHeaders } from '@folio/stripes-data-transfer-components';
import { getWrapperSourceLink } from './getWrapperSourceLink';

export const getIdentifierTypes = async (stripes) => {
  const {
    config,
    okapi: { url },
  } = stripes;

  try {
    const path = `${url}${getWrapperSourceLink('IDENTIFIER_TYPES', config.maxUnpagedResourceCount)}`;
    const response = await fetch(path,
      {
        headers: {
          ...createOkapiHeaders(stripes.okapi),
          'Content-Type': 'application/json',
        },
      });

    if (!response.ok) {
      throw new Error('Cannot get identifier types');
    }

    return await response.json();
  } catch (error) {
    console.error(error); // eslint-disable-line no-console

    return error;
  }
};
