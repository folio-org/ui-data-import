import React from 'react';

import { AppIcon } from '@folio/stripes/core';

export const RECORD_TYPES = {
  ORDER: {
    captionId: 'ui-data-import.recordTypes.order',
    icon: ({ label } = {}) => (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="orders"
      >
        {label}
      </AppIcon>
    ),
  },
  INVOICE: {
    captionId: 'ui-data-import.recordTypes.invoice',
    icon: ({ label } = {}) => (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="invoices"
      >
        {label}
      </AppIcon>
    ),
  },
  ITEM: {
    captionId: 'ui-data-import.recordTypes.item',
    icon: ({ label } = {}) => (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="items"
      >
        {label}
      </AppIcon>
    ),
  },
  INSTANCE: {
    captionId: 'ui-data-import.recordTypes.instance',
    icon: ({ label } = {}) => (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="instances"
      >
        {label}
      </AppIcon>
    ),
  },
  HOLDINGS: {
    captionId: 'ui-data-import.recordTypes.holdings',
    icon: ({ label } = {}) => (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="holdings"
      >
        {label}
      </AppIcon>
    ),
  },
  MARC_BIBLIOGRAPHIC: {
    captionId: 'ui-data-import.recordTypes.marc-bib',
    icon: ({ label } = {}) => (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="marcBibs"
      >
        {label}
      </AppIcon>
    ),
  },
  MARC_AUTHORITY: {
    captionId: 'ui-data-import.recordTypes.marc-auth',
    icon: ({ label } = {}) => (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="marcAuthorities"
      >
        {label}
      </AppIcon>
    ),
  },
  MARC_HOLDINGS: {
    captionId: 'ui-data-import.recordTypes.marc-hold',
    icon: ({ label } = {}) => (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="marcHoldings"
      >
        {label}
      </AppIcon>
    ),
  },
};
