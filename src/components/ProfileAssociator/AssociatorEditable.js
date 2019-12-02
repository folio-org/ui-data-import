import React, {
  memo,
  useState,
  Fragment,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { noop } from 'lodash';

import { Pluggable } from '@folio/stripes-core';
import { ConfirmationModal } from '@folio/stripes/components';

import { useCheckboxList } from '../../utils';
import { AssociatedList } from './AssociatedList';

import css from './ProfileAssociator.css';

export const AssociatorEditable = memo(({
  entityKey,
  nsSort,
  nsQuery,
  initialQuery,
  query,
  contentData,
  hasLoaded,
  dataAttributes,
  isMultiSelect,
  isMultiLink,
}) => {
  const checkboxList = useCheckboxList(contentData);
  const columnWidths = {
    name: 250,
    updated: 100,
    tags: 150,
    unlink: 65,
  };
  const pluginDisabled = !hasLoaded || (!isMultiSelect && contentData && contentData.length);
  const [data, setData] = useState(contentData);
  const [current, setCurrent] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const onLinesAdd = lines => {
    setData([...data, ...lines]);
  };

  const remove = row => {
    const index = data.findIndex(item => item.id === row.id);

    data.splice(index, 1);
    setData(data);
  };

  return (
    <Fragment {...dataAttributes}>
      <AssociatedList
        entityKey={entityKey}
        checkboxList={checkboxList}
        columnWidths={columnWidths}
        nsSort={nsSort}
        nsQuery={nsQuery}
        initialQuery={initialQuery}
        query={query}
        contentData={data}
        onSort={noop}
        onRemove={cur => {
          setCurrent(cur);
          setConfirmationOpen(true);
        }}
        className={css['list-editable']}
        isStatic={false}
        isMultiSelect
      />
      <br />
      <Pluggable
        aria-haspopup="true"
        type="find-import-profile"
        id="clickable-find-import-profile"
        searchLabel={<FormattedMessage id="ui-data-import.settings.profile.select" />}
        searchButtonStyle="default"
        addLines={onLinesAdd}
        entityKey={entityKey}
        dataKey={entityKey}
        disabled={pluginDisabled}
        isSingleSelect={!isMultiSelect}
        isMultiLink={isMultiLink}
        marginTop0
        data-test-plugin-find-record-button
      >
        <span data-test-no-plugin-available>
          <FormattedMessage id="ui-data-import.find-import-profile-plugin-unavailable" />
        </span>
      </Pluggable>
      <ConfirmationModal
        id="confirm-edit-action-profile-modal"
        open={confirmationOpen}
        heading={<FormattedMessage id="ui-data-import.modal.profile.unlink.heading" />}
        message={(
          <FormattedMessage
            id="ui-data-import.modal.profile.unlink.message"
            values={{ name: current ? current.name : '' }}
          />
        )}
        confirmLabel={<FormattedMessage id="ui-data-import.confirm" />}
        onConfirm={() => {
          setConfirmationOpen(false);
          remove(current);
        }}
        onCancel={() => setConfirmationOpen(false)}
      />
    </Fragment>
  );
});

AssociatorEditable.propTypes = {
  entityKey: PropTypes.string.isRequired,
  nsSort: PropTypes.string.isRequired,
  nsQuery: PropTypes.string.isRequired,
  initialQuery: PropTypes.string.isRequired,
  query: PropTypes.object.isRequired,
  contentData: PropTypes.arrayOf(PropTypes.object),
  hasLoaded: PropTypes.bool,
  isMultiSelect: PropTypes.bool,
  isMultiLink: PropTypes.bool,
  dataAttributes: PropTypes.shape(PropTypes.object),
};

AssociatorEditable.defaultProps = {
  contentData: [],
  hasLoaded: false,
  isMultiSelect: true,
  isMultiLink: true,
  dataAttributes: null,
};
