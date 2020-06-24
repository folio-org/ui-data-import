import PropTypes from 'prop-types';

import {
  MAPPING_DETAILS_ACTIONS,
  MAPPING_DETAILS_SUBACTIONS,
  MAPPING_DETAILS_POSITION,
} from './constants';

export const mappingMARCDataShape = PropTypes.shape({
  text: PropTypes.string,
  find: PropTypes.string,
  replaceWith: PropTypes.string,
  marcField: PropTypes.shape({
    field: PropTypes.string,
    indicator1: PropTypes.string,
    indicator2: PropTypes.string,
    subfields: PropTypes.arrayOf(PropTypes.shape({ subfield: PropTypes.string })),
  }),
});

export const mappingMARCSubfieldShape = PropTypes.shape({
  subfield: PropTypes.string,
  data: mappingMARCDataShape,
  subaction: PropTypes.oneOf([...Object.values(MAPPING_DETAILS_SUBACTIONS)]),
  position: PropTypes.oneOf([...Object.values(MAPPING_DETAILS_POSITION)]),
});

export const mappingMARCFieldShape = PropTypes.shape({
  order: PropTypes.number.isRequired,
  field: PropTypes.shape({
    subfields: PropTypes.arrayOf(mappingMARCSubfieldShape.isRequired).isRequired,
    field: PropTypes.string,
    indicator1: PropTypes.string,
    indicator2: PropTypes.string,
  }).isRequired,
  action: PropTypes.oneOf([...Object.values(MAPPING_DETAILS_ACTIONS)]),
});
