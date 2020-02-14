import {
  Factory,
  faker,
} from '@bigtest/mirage';

import {
  associatedMappingProfiles,
  associatedJobProfiles,
} from '../../mocks';

export default Factory.extend({
  id: () => faker.random.uuid(),
  name: i => `Name ${i}`,
  description: i => `Description ${i}`,
  tags: { tagList: [faker.random.arrayElement(['tag1', 'tag2', 'tag3'])] },
  reactTo: 'NON-MATCH',
  action: 'CREATE',
  mapping: 'Mapping',
  folioRecord: 'INSTANCE',
  deleted: false,
  parentProfiles: associatedMappingProfiles,
  childProfiles: associatedJobProfiles,
  metadata: { updatedDate: faker.date.past(0.1, faker.date.past(0.1)).toString() },
  userInfo: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.name.lastName(),
  },
});
