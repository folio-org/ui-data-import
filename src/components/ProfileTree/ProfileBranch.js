import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Layout,
  Icon,
} from '@folio/stripes/components';

import { ProfileLabel } from '.';

import css from './ProfileTree.css';

export const ProfileBranch = memo(({
  className,
  contentData,
  dataAttributes,
}) => (
  <Layout className={className}>
    <Icon icon="end-mark" />
  </Layout>
));

ProfileBranch.propTypes = {
  contentData: PropTypes.object.isRequired,
  className: PropTypes.string,
  dataAttributes: PropTypes.object,
};
