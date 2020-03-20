import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { Headline } from '@folio/stripes/components';

import { RecordSelect } from './RecordSelect';

import css from '../RecordTypesSelect.css';

export const InitialRecordSelect = ({
  id,
  onItemSelect,
  isEditable,
  isLocalLTR,
}) => {
  return (
    <section
      data-test-initial-record
      className={classNames(css.container, css.chooseRecordContainer)}
    >
      <Headline
        className={css.message}
        size="large"
        margin="small"
        tag="h3"
      >
        <FormattedMessage
          id="ui-data-import.recordTypesSelect.compareExisting"
          values={{ type: <FormattedMessage id="ui-data-import.marc" /> }}
        />
      </Headline>
      <RecordSelect
        id={id}
        onSelect={onItemSelect}
        isEditable={isEditable}
        isLocalLTR={isLocalLTR}
      />
    </section>
  );
};

InitialRecordSelect.propTypes = {
  onItemSelect: PropTypes.func.isRequired,
  id: PropTypes.string,
  isEditable: PropTypes.bool,
  isLocalLTR: PropTypes.bool,
};

InitialRecordSelect.defaultProps = {
  isEditable: true,
  isLocalLTR: true,
};
