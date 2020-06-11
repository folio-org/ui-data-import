import PropTypes from 'prop-types';

import {
  BOOLEAN_ACTIONS,
  REPEATABLE_ACTIONS,
} from '.';

export const mappingProfileSubfieldShape = {
  order: PropTypes.number.isRequired,
  path: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    value: PropTypes.string,
    enabled: PropTypes.bool,
    booleanFieldAction: PropTypes.oneOf(Object.values(BOOLEAN_ACTIONS)),
    repeatableFieldAction: PropTypes.oneOf(Object.values(REPEATABLE_ACTIONS)),
    acceptedValues: PropTypes.object,
  })),
};

export const okapiShape = {
  tenant: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};
