import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: () => faker.random.uuid(),
  importBlocked: () => faker.random.boolean(),
  dataTypes: () => [faker.random.arrayElement(['EDIFACT', 'MARC'])],
  extension: i => `.marc${i}`,
  metadata: { updatedDate: faker.date.past(0.1, faker.date.past(0.1)).toString() },
  userInfo: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.name.lastName(),
  },
});
