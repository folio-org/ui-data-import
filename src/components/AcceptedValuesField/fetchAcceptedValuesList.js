import { get } from 'lodash';

import {
  createOkapiHeaders,
  createUrl,
} from '@folio/stripes-data-transfer-components';

export const fetchAcceptedValuesList = async (okapi, wrapperSourceLink, wrapperSourcePath) => {
  try {
    const response = await fetch(
      createUrl(`${okapi.url}${wrapperSourceLink}`, null, false),
      { headers: { ...createOkapiHeaders(okapi) } },
    );

    if (!response.ok) {
      throw response;
    }

    const body = await response.json();

    return get(body, wrapperSourcePath, []);
  } catch (e) {
    console.error('Error: ', e); // eslint-disable-line no-console

    return [];
  }
};
