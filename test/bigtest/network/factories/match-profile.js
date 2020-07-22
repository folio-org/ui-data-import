import { Factory } from 'miragejs';
import faker from 'faker';

import { associatedJobProfiles } from '../../mocks';
import { fieldsConfig } from '../../../../src/utils/fields-config';
import {
  INCOMING_RECORD_TYPES,
  FOLIO_RECORD_TYPES,
} from '../../../../src/components/ListTemplate';
import {
  COMPARISON_PARTS_OPTIONS,
  CRITERION_TYPES_OPTIONS,
  VALUE_TYPES,
} from '../../../../src/utils';

export default Factory.extend({
  id: () => faker.random.uuid(),
  name: i => `Name ${i}`,
  description: i => `Description ${i}`,
  tags: { tagList: [faker.random.arrayElement(['tag1', 'tag2', 'tag3'])] },
  entityType: 'INVENTORY_ITEM',
  incomingRecordType: () => faker.random.arrayElement(Object.keys(INCOMING_RECORD_TYPES)),
  existingRecordType: () => faker.random.arrayElement(Object.keys(FOLIO_RECORD_TYPES)),
  matchDetails: [
    {
      incomingRecordType: () => faker.random.arrayElement(Object.keys(INCOMING_RECORD_TYPES)),
      existingRecordType: () => faker.random.arrayElement(Object.keys(FOLIO_RECORD_TYPES)),
      matchCriterion: () => faker.random.arrayElement(CRITERION_TYPES_OPTIONS.map(type => type.value)),
      existingMatchExpression: {
        dataValueType: () => faker.random.arrayElement(VALUE_TYPES.map(type => type.value)),
        fields: [{
          label: 'field',
          value: () => faker.random.arrayElement(fieldsConfig.map(field => field.value)),
        }],
        qualifier: { comparisonPart: () => faker.random.arrayElement(COMPARISON_PARTS_OPTIONS.map(type => type.value)) },
      },
      incomingMatchExpression: {
        dataValueType: () => faker.random.arrayElement(VALUE_TYPES.map(type => type.value)),
        fields: [{
          label: 'field',
          value: '001',
        }, {
          label: 'indicator1',
          value: '',
        }, {
          label: 'indicator2',
          value: '',
        }, {
          label: 'recordSubfield',
          value: 'a',
        }],
        qualifier: { comparisonPart: () => faker.random.arrayElement(COMPARISON_PARTS_OPTIONS.map(type => type.value)) },
      },
    },
  ],
  deleted: 'false',
  parentProfiles: associatedJobProfiles,
  childProfiles: [],
  metadata: { updatedDate: faker.date.past(0.1, faker.date.past(0.1)).toString() },
  userInfo: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.name.lastName(),
  },
});
