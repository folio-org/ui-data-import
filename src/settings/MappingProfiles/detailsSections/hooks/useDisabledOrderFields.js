import { useFieldMappingFieldValue } from './useFieldMappingFieldValue';

import {
  ORDER_FORMATS,
  PO_STATUS,
} from '../constants';
import {
  ORDER_FORMAT_FIELD,
  PO_STATUS_FIELD,
} from '../../../../utils';

/**
 *
 * @returns {{dismissElectronicDetails: boolean, dismissCreateInventory: boolean, dismissPhysicalDetails: boolean}}
 * an object with indicators of disabled fields
 */
export const useDisabledOrderFields = () => {
  const [poStatus, orderFormat] = useFieldMappingFieldValue([PO_STATUS_FIELD, ORDER_FORMAT_FIELD]);

  const dismissCreateInventory = poStatus === PO_STATUS.OPEN;
  const dismissPhysicalDetails = orderFormat === ORDER_FORMATS.ELECTRONIC_RESOURCE;
  const dismissElectronicDetails = (orderFormat === ORDER_FORMATS.PHYSICAL_RESOURCE) || (orderFormat === ORDER_FORMATS.OTHER);

  return {
    dismissCreateInventory,
    dismissPhysicalDetails,
    dismissElectronicDetails,
  };
};
