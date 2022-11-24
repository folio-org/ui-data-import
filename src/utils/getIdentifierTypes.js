import { createOkapiHeaders } from '@folio/stripes-data-transfer-components';
import { WRAPPER_SOURCE_LINKS } from '../settings/MappingProfiles/detailsSections/constants';

export const getIdentifierTypes = async (okapi) => {
  const { url } = okapi;

  try {
    const path = `${url}${WRAPPER_SOURCE_LINKS.IDENTIFIER_TYPES}`;
    const response = await fetch(path,
      {
        headers: {
          ...createOkapiHeaders(okapi),
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
