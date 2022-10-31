import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  TextField,
  IconButton,
} from '@folio/stripes/components';
import {
  stripesConnect,
  stripesShape,
  Pluggable,
} from '@folio/stripes/core';
import { getFullName } from '@folio/stripes/util';
import { PER_REQUEST_LIMIT } from '../../utils';

const columnMapping = {
  name: <FormattedMessage id="ui-orders.user.name" />,
  patronGroup: <FormattedMessage id="ui-orders.user.patronGroup" />,
  username: <FormattedMessage id="ui-orders.user.username" />,
  barcode: <FormattedMessage id="ui-orders.user.barcode" />,
};
const visibleColumns = ['name', 'patronGroup', 'username', 'barcode'];

function FieldAssignedTo({
  id,
  name,
  label,
  setReferenceTables,
  stripes,
  disabled,
  mutator,
}) {
  const [user, setUser] = useState({});

  useEffect(() => {
    if (id) {
      if (user.id !== id) {
        mutator.user.GET()
          .then(setUser);
      }
    } else {
      setUser({});
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearUser = useCallback(() => {
    setUser({});
    setReferenceTables(name, '');
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  const addUser = useCallback(newUser => {
    setUser(newUser);
    setReferenceTables(name, `"${newUser.id}"`);
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearButton = useMemo(() => {
    if (user.id) {
      return (
        <IconButton
          onClick={clearUser}
          icon="times-circle-solid"
          size="small"
        />
      );
    }

    return null;
  }, [user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Field
        component={TextField}
        disabled={disabled}
        endControl={clearButton}
        format={() => getFullName(user)}
        fullWidth
        hasClearIcon={false}
        label={label}
        name={name}
      />
      <div>
        <Pluggable
          aria-haspopup="true"
          type="find-user"
          dataKey="user"
          searchLabel="+"
          searchButtonStyle="default"
          selectUser={addUser}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          disableRecordCreation
          stripes={stripes}
        >
          <span>[<FormattedMessage id="stripes-acq-components.no-ui-plugin-find-user" />]</span>
        </Pluggable>
      </div>
    </div>
  );
}

FieldAssignedTo.propTypes = {
  name: PropTypes.string.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  stripes: stripesShape.isRequired,
  mutator: PropTypes.object.isRequired,
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  disabled: PropTypes.bool,
};

FieldAssignedTo.defaultProps = {
  id: '',
  label: null,
  disabled: false,
};

FieldAssignedTo.manifest = Object.freeze({
  users: {
    perRequest: PER_REQUEST_LIMIT,
    throwErrors: false,
    type: 'okapi',
    path: 'users',
    params: {
      query: 'cql.allRecords=1 sortby personal.firstName personal.lastName',
    },
    records: 'users',
    accumulate: true,
    fetch: false,
  },
  user: {
    type: 'okapi',
    path: 'users/!{id}',
    throwErrors: false,
    accumulate: true,
    fetch: false,
  },
});

export default stripesConnect(FieldAssignedTo);
