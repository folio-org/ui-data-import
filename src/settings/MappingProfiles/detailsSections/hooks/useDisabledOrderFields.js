import { useMemo } from 'react';

import { useFieldMappingFieldValue } from './useFieldMappingFieldValue';

import {
  ORDER_FORMATS,
  PO_STATUS
} from '../constants';
import {
  ORDER_FORMAT_FILED,
  PO_STATUS_FIELD
} from '../../../../utils';

/**
 *
 * @returns {{dismissElectronicDetails: boolean, dismissCreateInventory: boolean, dismissPhysicalDetails: boolean}}
 * an object with indicators of disabled fields
 */
export const useDisabledOrderFields = () => {
  const [poStatus, orderFormat] = useFieldMappingFieldValue([PO_STATUS_FIELD, ORDER_FORMAT_FILED]);

  const dismissCreateInventory = useMemo(() => poStatus === PO_STATUS.OPEN, [poStatus]);
  const dismissPhysicalDetails = useMemo(() => orderFormat === ORDER_FORMATS.ELECTRONIC_RESOURCE, [orderFormat]);
  const dismissElectronicDetails = useMemo(() => {
    return (orderFormat === ORDER_FORMATS.PHYSICAL_RESOURCE) || (orderFormat === ORDER_FORMATS.OTHER);
  }, [orderFormat]);

  return {
    dismissCreateInventory,
    dismissPhysicalDetails,
    dismissElectronicDetails,
  };
};
