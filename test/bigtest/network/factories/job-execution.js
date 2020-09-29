import { Factory } from 'miragejs';
import faker from 'faker';

import { JOB_STATUSES } from '../../../../src/utils/constants';

export default Factory.extend({
  id: () => faker.random.uuid(),
  hrId: () => {
    return faker.random.number({
      min: 100000000,
      max: 999999999,
    }).toString();
  },
  uiStatus: () => faker.random.arrayElement(Object.values(JOB_STATUSES)),
  jobProfileName: () => faker.random.arrayElement([
    'Marc bib jobs',
    'Library indexing',
    'Authority updates',
    'Standard BIB Import',
    'BIB Import from Boston',
  ]),
  fileName: i => `import_${i}.mrc`,
  runBy: () => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  }),
  progress: () => {
    const total = faker.random.number();

    return {
      current: faker.random.number({ max: total }),
      total,
    };
  },
  startedDate: () => faker.date.past(0.1, faker.date.past(0.1)).toString(),
  completedDate: () => faker.date.past(0.1).toString(),
});
