import React, {
  Fragment,
  memo,
} from 'react';
import PropTypes from 'prop-types';

import { noop } from 'lodash';

import { stringToWords } from '../../utils';

import { AssociatorStatic } from './AssociatorStatic';
import { AssociatorEditable } from './AssociatorEditable';

export const ProfileAssociator = memo(({
  entityKey,
  namespaceKey,
  parentId,
  parentType,
  masterType,
  detailType,
  profileName,
  isMultiSelect,
  isMultiLink,
  contentData,
  hasLoaded,
  record,
  useSearch,
  relationsToAdd,
  relationsToDelete,
  onLink,
  onUnlink,
  dataAttributes,
}) => {
  const contentType = stringToWords(entityKey).map(word => word.toLocaleUpperCase()).join('_').slice(0, -1);

  const getProfiles = () => {
    const data = contentData.filter(item => item.contentType === contentType);

    if (!data || !data.length) {
      return [];
    }

    return data.map(({ content }) => content);
  };

  return (
    <Fragment>
      {record ? (
        <AssociatorStatic
          entityKey={entityKey}
          namespaceKey={namespaceKey}
          record={record}
          contentData={getProfiles()}
          hasLoaded={hasLoaded}
          dataAttributes={dataAttributes}
          isMultiSelect={isMultiSelect}
          useSearch={useSearch}
        />
      ) : (
        <AssociatorEditable
          entityKey={entityKey}
          namespaceKey={namespaceKey}
          isMultiSelect={isMultiSelect}
          isMultiLink={isMultiLink}
          contentData={getProfiles()}
          hasLoaded={hasLoaded}
          parentId={parentId}
          parentType={parentType}
          masterType={masterType}
          detailType={detailType}
          profileName={profileName}
          relationsToAdd={relationsToAdd}
          relationsToDelete={relationsToDelete}
          onLink={onLink}
          onUnlink={onUnlink}
          dataAttributes={dataAttributes}
        />
      )}
    </Fragment>
  );
});

ProfileAssociator.propTypes = {
  entityKey: PropTypes.string.isRequired,
  namespaceKey: PropTypes.string.isRequired,
  parentType: PropTypes.string.isRequired,
  masterType: PropTypes.string.isRequired,
  detailType: PropTypes.string.isRequired,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  profileName: PropTypes.string,
  parentId: PropTypes.string || PropTypes.number,
  hasLoaded: PropTypes.bool,
  record: PropTypes.object,
  dataAttributes: PropTypes.shape(PropTypes.object),
  isMultiSelect: PropTypes.bool,
  isMultiLink: PropTypes.bool,
  useSearch: PropTypes.bool,
  relationsToAdd: PropTypes.arrayOf(PropTypes.object),
  relationsToDelete: PropTypes.arrayOf(PropTypes.object),
  onLink: PropTypes.func,
  onUnlink: PropTypes.func,
};

ProfileAssociator.defaultProps = {
  parentId: null,
  hasLoaded: false,
  record: null,
  dataAttributes: null,
  isMultiSelect: true,
  isMultiLink: true,
  useSearch: true,
  relationsToAdd: [],
  relationsToDelete: [],
  onLink: noop,
  onUnlink: noop,
};
