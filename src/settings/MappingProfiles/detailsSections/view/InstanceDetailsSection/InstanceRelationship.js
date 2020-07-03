import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  NoValue,
  KeyValue,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  getContentData,
  getFieldValue,
  transformSubfieldsData,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

import css from '../../../MappingProfiles.css';

export const InstanceRelationship = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const parentInstances = getFieldValue(mappingDetails, 'parentInstances', 'subfields');
  const childInstances = getFieldValue(mappingDetails, 'childInstances', 'subfields');

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
          <KeyValue label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.field.parentInstances.legend`} />}>
            <MultiColumnList
              contentData={getContentData(parentInstancesData)}
              visibleColumns={parentInstancesVisibleColumns}
              columnMapping={parentInstancesMapping}
              formatter={parentInstancesFormatter}
            />
          </KeyValue>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-child-instances
          xs={12}
          className={css.colWithTable}
        >
          <KeyValue label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.field.childInstances.legend`} />}>
            <MultiColumnList
              contentData={getContentData(childInstancesData)}
              visibleColumns={childInstancesVisibleColumns}
              columnMapping={childInstancesMapping}
              formatter={childInstancesFormatter}
            />
          </KeyValue>
        </Col>
      </Row>
    </Accordion>
  );
};

InstanceRelationship.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
