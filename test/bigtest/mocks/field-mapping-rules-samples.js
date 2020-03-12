/**
 * MappingProfile details / mapping rules per each instance.
 * NOTE: mappingDetails section contains only one object with name and fields props.
 *
 * @type {{instances: [{name: string, fields: [{path: string, subfields: [], name: string, value: string, enabled: boolean, acceptedValues: []}, {path: string, subfields: [], name: string, value: string, enabled: boolean, acceptedValues: [{id: string, value: string}, {id: string, value: string}]}, {path: string, subfields: [{path: string, name: string, value: string, acceptedValues: []}, {path: string, name: string, value: string, acceptedValues: [{id: string, value: string}, {id: string, value: string}]}], name: string, value: string, enabled: boolean, acceptedValues: []}]}]}}
 */
export const fieldMappingRulesOption1 = {
  instances: [{
    name: 'instanceName1',
    mapActions: {
      fieldTypeBool: ['ALL_TRUE', 'ALL_FALSE', 'AS_IS', 'IGNORE'],
      fieldTypeRepeateble: ['EXTEND_EXISTING', 'DELETE_EXISTING', 'EXCHANGE_EXISTING', 'DELETE_INCOMING'],
    },
    fields: [{
      name: 'fieldName1',
      enabled: true,
      path: 'instanceName1.fieldName1',
      value: '$010',
      mapAction: '',
      acceptedValues: [],
      subfields: [],
    }, {
      name: 'fieldName2',
      enabled: false,
      path: 'instanceName1.fieldName2',
      value: '$020|a else $020|b',
      acceptedValues: [{
        id: 'uuid',
        value: 'value1',
      }, {
        id: 'uuid',
        value: 'value2',
      }],
      subfields: [],
    }, {
      name: 'fieldName3',
      enabled: true,
      path: 'instanceName1.fieldName3',
      value: '',
      acceptedValues: [],
      subfields: [
        [{
          name: 'subfieldName1',
          path: 'instanceName1.fieldName3[].subfieldName1',
          value: '$010|b',
          acceptedValues: [],
        }, {
          name: 'subfieldName2',
          path: 'instanceName1.fieldName3[].subfieldName1',
          value: '$010|c',
          acceptedValues: [{
            id: 'uuid',
            value: 'value1',
          }, {
            id: 'uuid',
            value: 'value2',
          }],
        }],
      ],
    }],
  }],
};
