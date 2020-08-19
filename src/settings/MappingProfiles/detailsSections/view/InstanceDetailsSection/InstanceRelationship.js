import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  NoValue,
} from '@folio/stripes/components';

import { ViewRepeatableField } from '../ViewRepeatableField';

import {
  getFieldValue,
  transformSubfieldsData,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

import css from '../../../MappingProfiles.css';

export const InstanceRelationship = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const parentInstances = getFieldValue(mappingDetails, 'parentInstances', 'subfields');
  const parentInstancesRepeatableAction = getFieldValue(mappingDetails,
    'parentInstances', 'repeatableFieldAction');
  const childInstances = getFieldValue(mappingDetails, 'childInstances', 'subfields');
  const childInstancesRepeatableAction = getFieldValue(mappingDetails,
    'childInstances', 'repeatableFieldAction');

  const parentInstancesVisibleColumns = ['superInstanceId', 'instanceRelationshipTypeId'];
  const parentInstancesMapping = {
    superInstanceId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.parentInstances.field.superInstanceId`} />
    ),
    instanceRelationshipTypeId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.parentInstances.field.instanceRelationshipTypeId`} />
    ),
  };
  const parentInstancesFormatter = {
    superInstanceId: x => x?.superInstanceId || noValueElement,
    instanceRelationshipTypeId: x => x?.instanceRelationshipTypeId || noValueElement,
  };
  const parentInstancesFieldsMap = [
    {
      field: 'superInstanceId',
      key: 'value',
    }, {
      field: 'instanceRelationshipTypeId',
      key: 'value',
    },
  ];
  const parentInstancesData = transformSubfieldsData(parentInstances, parentInstancesFieldsMap);

  const childInstancesVisibleColumns = ['subInstanceId', 'instanceRelationshipTypeId'];
  const childInstancesMapping = {
    subInstanceId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.childInstances.field.subInstanceId`} />
    ),
    instanceRelationshipTypeId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.childInstances.field.instanceRelationshipTypeId`} />
    ),
  };
  const childInstancesFormatter = {
    subInstanceId: x => x?.subInstanceId || noValueElement,
    instanceRelationshipTypeId: x => x?.instanceRelationshipTypeId || noValueElement,
  };
  const childInstancesFieldsMap = [
    {
      field: 'subInstanceId',
      key: 'value',
    }, {
      field: 'instanceRelationshipTypeId',
      key: 'value',
    },
  ];
  const childInstancesData = transformSubfieldsData(childInstances, childInstancesFieldsMap);

  return (
    <Accordion
      id="instance-relationship"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.relationship.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-parent-instances
          xs={12}
          className={css.colWithTable}
        >
          <ViewRepeatableField
            repeatableAction={parentInstancesRepeatableAction}
            fieldData={parentInstancesData}
            visibleColumns={parentInstancesVisibleColumns}
            columnMapping={parentInstancesMapping}
            formatter={parentInstancesFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.instance.field.parentInstances.legend`}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-child-instances
          xs={12}
        >
          <ViewRepeatableField
            repeatableAction={childInstancesRepeatableAction}
            fieldData={childInstancesData}
            visibleColumns={childInstancesVisibleColumns}
            columnMapping={childInstancesMapping}
            formatter={childInstancesFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.instance.field.childInstances.legend`}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InstanceRelationship.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
