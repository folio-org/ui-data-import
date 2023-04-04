import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';
import {
  QueryClientProvider,
  QueryClient,
} from 'react-query';

import '../jest/__mock__';

import { StripesContext, createReactQueryClient } from '@folio/stripes/core';

import translations from '../../translations/ui-data-import/en';
import { prefixKeys } from './prefixKeys';

const stripesDefaultProps = {
  okapi: { url: '' },
  logger: { log: noop },
  connect: Component => props => (
    <Component {... props} />
  ),
};
const reactQueryClient = new QueryClient(createReactQueryClient());

const defaultRichTextElements = ['b', 'i', 'em', 'strong', 'span', 'div', 'p', 'ul', 'ol', 'li', 'code'].reduce((res, Tag) => {
  res[Tag] = chunks => <Tag>{chunks}</Tag>;

  return res;
}, {});

export function Harness({
  translations: translationsConfig,
  stripesCustomProps = {},
  children,
}) {
  const allTranslations = prefixKeys(translations);
  const stripes = { ...stripesDefaultProps, ...stripesCustomProps };

  translationsConfig.forEach(tx => {
    Object.assign(allTranslations, prefixKeys(tx.translations, tx.prefix));
  });

  return (
    <StripesContext.Provider value={stripes}>
      <QueryClientProvider client={reactQueryClient}>
        <IntlProvider
          locale="en"
          key="en"
          timeZone="UTC"
          messages={allTranslations}
          defaultRichTextElements={defaultRichTextElements}
          onWarn={noop}
        >
          {children}
        </IntlProvider>
      </QueryClientProvider>
    </StripesContext.Provider>
  );
}

Harness.propTypes = {
  children: PropTypes.node,
  translations: PropTypes.arrayOf(
    PropTypes.shape({
      prefix: PropTypes.string,
      translations: PropTypes.object,
    })
  ),
  stripesCustomProps: PropTypes.object,
};
