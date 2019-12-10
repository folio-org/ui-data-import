import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Layout,
  Icon,
} from '@folio/stripes/components';

import {
  ProfileBranch,
  ProfileLinker,
} from '.';

import css from './ProfileTree.css';

export const ProfileTree = memo(({
  contentData,
  linkingRules,
  record,
  className,
  dataAttributes,
}) => {
  const onLink = profiles => {

  };

  return (
    <div className={className}>
      <ProfileLinker
        linkingRules={linkingRules}
        onLinkCallback={onLink}
      />
    </div>
  );
});

ProfileTree.propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  linkingRules: PropTypes.object,
  record: PropTypes.object,
  className: PropTypes.string,
  dataAttributes: PropTypes.object,
};
