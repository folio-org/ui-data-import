import React from 'react';
import { FormattedMessage } from 'react-intl';

import { AppIcon } from '@folio/stripes-core';

export const generateSettingsLabel = (labelId, iconKey) => (
  <AppIcon
    size="small"
    app="data-import"
    iconKey={iconKey}
  >
    <FormattedMessage id={`ui-data-import.settings.${labelId}`} />
  </AppIcon>
);
