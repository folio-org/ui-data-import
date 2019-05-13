import {
  Factory,
  faker,
} from '@bigtest/mirage';

export default Factory.extend({
  id: () => faker.random.uuid(),
  name: i => `Name ${i}`,
  description: i => `Description ${i}`,
  existingRecordType: i => `RecordType ${i}`,
  field: i => `Field ${i}`,
  incomingStaticValueType: i => `IncomingStaticValueType ${i}`,
  fieldMarc: i => `FieldMARC ${i}`,
  fieldNonMarc: i => `FieldNonMARC ${i}`,
  existingStaticValueType: i => `ExistingStaticValueType ${i}`,
  tags: {
    tagList: [faker.random.arrayElement(['tag1', 'tag2', 'tag3'])],
  },
  metadata: {
    updatedDate: faker.date.past(0.1, faker.date.past(0.1)).toString(),
  },
  userInfo: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.name.lastName(),
  },
});
