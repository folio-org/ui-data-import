import {
  Factory,
  faker,
} from '@bigtest/mirage';

import { associatedJobProfiles } from '../../mocks';

export default Factory.extend({
  id: () => faker.random.uuid(),
  name: i => `Name ${i}`,
  description: i => `Description ${i}`,
  existingRecordType: i => `RecordType ${i}`,
  parentProfiles: associatedJobProfiles,
  childProfiles: [],
  tags: { tagList: [faker.random.arrayElement(['tag1', 'tag2', 'tag3'])] },
  metadata: { updatedDate: faker.date.past(0.1, faker.date.past(0.1)).toString() },
  userInfo: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.name.lastName(),
  },
});
