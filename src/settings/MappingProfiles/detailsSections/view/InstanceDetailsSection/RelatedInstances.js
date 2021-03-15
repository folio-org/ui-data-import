import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Accordion } from '@folio/stripes/components';

import { TRANSLATION_ID_PREFIX } from '../../constants';

export const RelatedInstances = () => {
  return (
    <Accordion
      id="view-related-instances"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.relatedInstances.section`} />}
    >
      <></>
    </Accordion>
  );
};
