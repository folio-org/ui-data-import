import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { IntlConsumer } from '@folio/stripes/core';
import {
  ButtonGroup,
  Button,
  Label,
  Select,
} from '@folio/stripes/components';
import formField from '@folio/stripes-components/lib/FormField';

import css from './ReactToSelect.css';

const REACT_TO = {
  MATCH: 'MATCH',
  NON_MATCH: 'NON-MATCH',
};

const ReactToSelectComponent = props => {
  const {
    value,
    onChange,
    label,
    required,
    error,
    warning,
  } = props;

  return (
    <Fragment>
      {label && <Label required={required}>{label}</Label>}
      <ButtonGroup
        fullWidth
        className={classNames(
          css.select,
          { [css.hasFeedback]: error || warning },
        )}
      >
        <Button
          buttonStyle={value === REACT_TO.NON_MATCH ? 'primary' : 'default'}
          onClick={() => onChange(REACT_TO.NON_MATCH)}
          marginBottom0
        >
          <FormattedMessage id="ui-data-import.nonMatches" />
        </Button>
        <Button
          buttonStyle={value === REACT_TO.MATCH ? 'primary' : 'default'}
          onClick={() => onChange(REACT_TO.MATCH)}
          marginBottom0
        >
          <FormattedMessage id="ui-data-import.matches" />
        </Button>
      </ButtonGroup>
      <div role="alert">
        {error && <div className={css.error}>{error}</div>}
        {warning && <div className={css.warning}>{warning}</div>}
      </div>
      <div className={css.hidden}>
        <IntlConsumer>
          {({ formatMessage }) => (
            <Select
              {...props}
              placeholder="-"
              dataOptions={[
                {
                  label: formatMessage({ id: 'ui-data-import.nonMatches' }),
                  value: REACT_TO.NON_MATCH,
                },
                {
                  label: formatMessage({ id: 'ui-data-import.matches' }),
                  value: REACT_TO.MATCH,
                },
              ]}
            />
          )}
        </IntlConsumer>
      </div>
    </Fragment>
  );
};

ReactToSelectComponent.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node,
  required: PropTypes.bool,
  error: PropTypes.node,
  warning: PropTypes.node,
};

export const ReactToSelect = formField(
  ReactToSelectComponent,
  ({ meta }) => ({
    error: (meta.touched && meta.error ? meta.error : ''),
    warning: (meta.touched && meta.warning ? meta.warning : ''),
  })
);
