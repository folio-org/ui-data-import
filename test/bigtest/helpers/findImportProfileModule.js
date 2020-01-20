import React from 'react';
import { Button } from '@folio/stripes-components';
import { faker } from '@bigtest/mirage';

const {
  uuid,
  words,
} = faker.random;

const generateAction = () => ({
  id: uuid(),
  name: words(),
  description: words(),
  action: 'CREATE',
  folioRecord: 'INSTANCE',
});

const generateMatch = () => ({
  id: uuid(),
  name: words(),
  description: words(),
  entityType: 'MARC_BIB_RECORD',
  incomingRecordType: 'MARC_BIBLIOGRAPHIC',
  existingRecordType: 'MARC_BIBLIOGRAPHIC',
  matchDetails: [{
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    existingRecordType: 'MARC_BIBLIOGRAPHIC',
    incomingMatchExpression: {
      dataValueType: 'VALUE_FROM_RECORD',
      fields: [],
    },
    matchCriterion: 'EXACTLY_MATCHES',
    existingMatchExpression: {
      dataValueType: 'VALUE_FROM_RECORD',
      fields: [],
    },
  }],
});

const getRecord = entityKey => (entityKey === 'matchProfiles' ? [generateMatch()] : [generateAction()]);

export default ({
  type: 'plugin',
  name: '@folio/ui-plugin-find-import-profile',
  displayName: 'Find import profile',
  pluginType: 'find-import-profile',
  module: props => {
    return (
      <Button
        data-test-find-import-profile-button
        id={`${props.entityKey}-plugin-button-${uuid()}`}
        onClick={() => props.onLink(getRecord(props.entityKey), props.entityKey)}
      />
    );
  },
});
