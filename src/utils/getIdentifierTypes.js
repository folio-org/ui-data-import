import { createOkapiHeaders } from '@folio/stripes-data-transfer-components';

export const getIdentifierTypes = async (okapi) => {
  const { url } = okapi;

  try {
    const path = `${url}/identifier-types?limit=1000&query=cql.allRecords=1 sortby name`;
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
