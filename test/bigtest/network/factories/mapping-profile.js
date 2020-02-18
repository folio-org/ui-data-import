import {
  Factory,
  faker,
} from '@bigtest/mirage';

import { associatedActionProfiles } from '../../mocks';
import { INCOMING_RECORD_TYPES } from '../../../../src/components/ListTemplate/incomingRecordTypes';
import { FOLIO_RECORD_TYPES } from '../../../../src/components/ListTemplate/folioRecordTypes';

export default Factory.extend({
  id: () => faker.random.uuid(),
  name: i => `Name ${i}`,
  description: i => `Description ${i}`,
  tags: { tagList: [faker.random.arrayElement(['tag1', 'tag2', 'tag3'])] },
  incomingRecordType: () => faker.random.arrayElement(Object.keys(INCOMING_RECORD_TYPES)),
  existingRecordType: () => faker.random.arrayElement(Object.keys(FOLIO_RECORD_TYPES)),
  deleted: false,
  parentProfiles: associatedActionProfiles,
  childProfiles: [],
  metadata: { updatedDate: faker.date.past(0.1, faker.date.past(0.1)).toString() },
  userInfo: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.name.lastName(),
  },
});
