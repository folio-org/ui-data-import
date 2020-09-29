import { Factory } from 'miragejs';
import faker from 'faker';

import { PROFILE_TYPES } from '../../../../src/utils/constants';

const PROFILE_ID = faker.random.uuid();

export default Factory.extend({
  id: () => faker.random.uuid(),
  profileId: () => PROFILE_ID,
  contentType: () => faker.random.arrayElement(Object.values(PROFILE_TYPES)),
  content: () => ({
    id: PROFILE_ID,
    name: i => `Name ${i}`,
    tags: { tagList: [faker.random.arrayElement(['tag1', 'tag2', 'tag3'])] },
    parentProfiles: [],
    childProfiles: [],
    metadata: { updatedDate: faker.date.past(0.1, faker.date.past(0.1)).toString() },
    userInfo: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      userName: faker.name.lastName(),
    },
  }),
  childSnapshotWrappers: () => [],
});
