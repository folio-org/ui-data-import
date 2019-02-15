import {
  Factory,
  faker,
} from '@bigtest/mirage';

export default Factory.extend({
  id: () => faker.random.uuid(),
  status: 'LOADED',
  fileDefinitions: [
    {
      id: faker.random.uuid(),
      name: 'enciclopedia.marc',
      status: 'UPLOADED',
      uiKey: 'enciclopedia.marc1492801934000',
    },
    {
      id: faker.random.uuid(),
      name: 'enc.marc',
      status: 'FAILED',
      uiKey: 'enc.marc1492801934000',
    },
  ],
});
