import {
  Factory,
  faker,
} from '@bigtest/mirage';

import { FILE_STATUSES } from '../../../../src/utils/constants';

const uploadDefinitionId = faker.random.uuid();

export default Factory.extend({
  id: uploadDefinitionId,
  status: 'LOADED',
  fileDefinitions: [
    {
      id: faker.random.uuid(),
      name: 'importBIB017.marc',
      status: FILE_STATUSES.NEW,
      uiKey: 'importBIB017.marc1492801934000',
      uploadDefinitionId,
    },
    {
      id: faker.random.uuid(),
      name: 'importBoston.marc',
      status: FILE_STATUSES.UPLOADING,
      uiKey: 'importBoston.marc1492801934000',
      uploadDefinitionId,
    },
    {
      id: faker.random.uuid(),
      name: 'enciclopedia.marc',
      status: FILE_STATUSES.UPLOADED,
      uiKey: 'enciclopedia.marc1492801934000',
      uploadDefinitionId,
    },
    {
      id: faker.random.uuid(),
      name: 'enc.marc',
      status: FILE_STATUSES.ERROR,
      uiKey: 'enc.marc1492801934000',
      uploadDefinitionId,
    },
  ],
});
