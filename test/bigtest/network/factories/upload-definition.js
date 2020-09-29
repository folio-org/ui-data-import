import { Factory } from 'miragejs';
import faker from 'faker';
import { FILE_STATUSES } from '../../../../src/utils/constants';

const files = [
  {
    name: 'importBIB017.marc',
    status: FILE_STATUSES.NEW,
    uiKey: 'importBIB017.marc1492801934000',
  },
  {
    name: 'importBoston.marc',
    status: FILE_STATUSES.UPLOADING,
    uiKey: 'importBoston.marc1492801934000',
  },
  {
    name: 'enciclopedia.marc',
    status: FILE_STATUSES.UPLOADED,
    uiKey: 'enciclopedia.marc1492801934000',
  },
  {
    name: 'enc.marc',
    status: FILE_STATUSES.ERROR,
    uiKey: 'enc.marc1492801934000',
  },
];

export default Factory.extend({
  id() {
    return faker.random.uuid();
  },
  status: 'LOADED',

  afterCreate(uploadDefinition, server) {
    if (!uploadDefinition.fileDefinitions.length) {
      const fileDefinitions = files.map(file => {
        return server.create('file', file);
      });

      uploadDefinition.update({ fileDefinitions });
    }
  },
});
