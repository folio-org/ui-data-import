import {
  Model,
  hasMany,
} from 'miragejs';

export default Model.extend({ fileDefinitions: hasMany('file') });
