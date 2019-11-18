import React, {
  memo,
  useState,
  Fragment,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  get,
  noop,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import {
  Button,
  RepeatableField,
} from '@folio/stripes/components';

import { compose } from '../..//utils';
import {
  PROFILE_TYPES,
  SORT_TYPES,
} from '../../utils/constants';

import sharedCss from '../../shared.css';
import css from './ProfileAssociator.css';

export const AssociatorEditable = memo(({
  entityKey,
  namespaceKey,
  contentData,
  hasLoaded,
  dataAttributes,
  isMultiSelect,
  isMultiLink,
  onRowClick,
}) => {
  return (
    <Fragment>
      <RepeatableField />
    </Fragment>
  );
});

AssociatorEditable.propTypes = {
  entityKey: PropTypes.string.isRequired,
  namespaceKey: PropTypes.string.isRequired,
  dataAttributes: PropTypes.shape(PropTypes.object),
  contentData: PropTypes.arrayOf(PropTypes.object),
  hasLoaded: PropTypes.bool,
  isMultiSelect: PropTypes.bool,
  isMultiLink: PropTypes.bool,
  onRowClick: PropTypes.func,
};

AssociatorEditable.defaultProps = {
  contentData: [],
  dataAttributes: null,
  hasLoaded: false,
  isMultiSelect: true,
  isMultiLink: true,
  onRowClick: noop,
};
