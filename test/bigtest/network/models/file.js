// models

import {
  Model,
  belongsTo,
} from 'miragejs';

export default Model.extend({ uploadDefinition: belongsTo() });
