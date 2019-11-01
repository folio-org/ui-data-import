/**
 * FlexibleForm ControlsRenderer sample config.
 *
 * Assumptions and simplifications made for this POC:
 *
 */
export const formConfigSamples = [{
  id: 'form-match-profiles',
  name: 'matchProfilesForm',
  caption: 'ui-data-import.summary',
  template: 'simple',
  dataAttributes: {},
  children: [{
    controlType: 'Headline',
    label: 'ui-data-import.match-details',
    size: 'xx-large',
    tag: 'h2',
    dataAttributes: { 'data-test-header-title': true },
  }, {
    controlType: 'AccordionSet',
    dataAttributes: {},
    children: [{
      controlType: 'Field',
      id: 'panel-existing',
      name: 'existingType',
      label: 'ui-data-import.record-type.existing',
      component: 'RecordTypesSelect',
      required: true,
      validate: null,
      dataAttributes: {},
    }, {
      controlType: 'Accordion',
      label: 'ui-data-import.match.metadata',
      separator: null,
      dataAttributes: {},
      children: [{
        controlType: 'Field',
        id: 'text-name',
        name: 'name',
        label: 'ui-data-import.name',
        component: 'TextField',
        required: true,
        validate: null,
        dataAttributes: {},
      }, {
        controlType: 'Field',
        id: 'text-description',
        name: 'description',
        label: 'ui-data-import.description',
        component: 'TextArea',
        required: false,
        validate: null,
        dataAttributes: {},
      }, { // Match Criteria Set section
        controlType: 'Accordion',
        collapsed: false,
        separator: null,
        label: 'ui-data-import.match.criteria',
        dataAttributes: {},
        children: [{
          controlType: 'Section',
          optional: false,
          classNames: ['match-criteria'],
          repeatable: true,
          name: 'matchDetails',
          fields: 'matchDetails',
          emptyMessage: 'EMPTY FIELDS HERE',
          dataAttributes: {},
          children: [{ // Match Criterions List (array)
            controlType: 'Accordion',
            label: 'ui-data-import.match.criterion',
            collapsed: false,
            separator: null,
            children: [{
              controlType: 'Section',
              optional: false,
              classNames: ['match-criterion'],
              dataAttributes: {},
              children: [{ // Incoming MARC Record
                controlType: 'Section',
                label: 'ui-data-import.match.incoming.MARC',
                optional: false,
                classNames: ['incoming'],
                dataAttributes: {},
                children: [{
                  controlType: 'Section',
                  label: 'ui-data-import.match.incoming.MARC.field',
                  optional: false,
                  classNames: ['field', ['input-container']],
                  dataAttributes: {},
                  children: [{
                    controlType: 'Field',
                    id: 'criterion1-incoming.field.main',
                    name: 'marcRecordFieldMain',
                    label: 'ui-data-import.match.incoming.MARC.field-main',
                    component: 'TextField',
                    validate: null, // Not defined yet, TBD
                    dataAttributes: {},
                  }, {
                    controlType: 'Field',
                    id: 'criterion1-incoming.field.ln1',
                    name: 'marcRecordFieldLn1',
                    label: 'ui-data-import.match.incoming.MARC.field-ln1',
                    component: 'TextField',
                    validate: null, // Not defined yet, TBD
                    dataAttributes: {},
                  }, {
                    controlType: 'Field',
                    id: 'criterion1-incoming.field.ln2',
                    name: 'marcRecordFieldLn2',
                    label: 'ui-data-import.match.incoming.MARC.field-ln2',
                    component: 'TextField',
                    validate: null, // Not defined yet, TBD
                    dataAttributes: {},
                  }, {
                    controlType: 'Field',
                    id: 'criterion1-incoming.field.subfield',
                    name: 'marcRecordFieldSubfield',
                    label: 'ui-data-import.match.incoming.MARC.field-subfield',
                    component: 'TextField',
                    validate: null, // Not defined yet, TBD
                    dataAttributes: {},
                  }],
                }, {
                  controlType: 'Section',
                  label: 'ui-data-import.match.incoming.qualifier',
                  optional: true,
                  enabled: false,
                  classNames: ['qualifier', 'input-container'],
                  dataAttributes: {},
                  children: [{
                    controlType: 'Field',
                    id: 'criterion1-incoming.qualifier.term',
                    name: 'criterionIncomingQualifierTerm',
                    component: 'Select',
                    placeholder: '',
                    dataOptions: [{
                      value: 'BEGINS_WITH',
                      label: 'ui-data-import.match.qualifier.begins-with',
                    }, {
                      value: 'ENDS_WITH',
                      label: 'ui-data-import.match.qualifier.ends-with',
                    }, {
                      value: 'CONTAINS',
                      label: 'ui-data-import.match.qualifier.contains',
                    }],
                    validate: null, // Not defined yet, TBD
                    dataAttributes: {},
                  }, {
                    controlType: 'Field',
                    id: 'criterion1-incoming.qualifier.value',
                    name: 'criterionIncomingQualifierValue',
                    component: 'TextField',
                    placeholder: '',
                    validate: null, // Not defined yet, TBD
                    dataAttributes: {},
                  }],
                }, {
                  controlType: 'Section',
                  label: 'ui-data-import.match.incoming.part',
                  optional: true,
                  enabled: false,
                  classNames: ['part', 'input-container'],
                  dataAttributes: {},
                  children: [{
                    controlType: 'Field',
                    id: 'criterion1-incoming.qualifier.term',
                    name: 'criterionIncomingValuePart',
                    label: '',
                    component: 'Select',
                    placeholder: '',
                    dataOptions: [{
                      value: 'NUMERICS_ONLY',
                      label: 'ui-data-import.match.comparison-part.numerics-only',
                    }, {
                      value: 'ALPHANUMERICS_ONLY',
                      label: 'ui-data-import.match.comparison-part.alpha-numerics-only',
                    }],
                    validate: null, // Not defined yet, TBD
                    dataAttributes: {},
                  }],
                }],
              }, { // Match Criterion
                controlType: 'Section',
                label: 'ui-data-import.match.criterion',
                optional: false,
                classNames: ['criterion', 'input-container'],
                dataAttributes: {},
                children: [{
                  controlType: 'Field',
                  id: 'criterion1-criterion-type',
                  name: 'criterionType',
                  label: '',
                  component: 'Select',
                  placeholder: '',
                  dataOptions: [{
                    value: 'EXACTLY_MATCHES',
                    label: 'ui-data-import.match.criterion-type.exactly-matches',
                  }, {
                    value: 'EXISTING_VALUE_CONTAINS_INCOMING_VALUE',
                    label: 'ui-data-import.match.criterion-type.existing-contains-incoming',
                  }, {
                    value: 'INCOMING_VALUE_CONTAINS_EXISTING_VALUE',
                    label: 'ui-data-import.match.criterion-type.incoming-contains-existing',
                  }, {
                    value: 'EXISTING_VALUE_BEGINS_WITH_INCOMING_VALUE',
                    label: 'ui-data-import.match.criterion-type.existing-begins-with-incoming',
                  }, {
                    value: 'INCOMING_VALUE_BEGINS_WITH_EXISTING_VALUE',
                    label: 'ui-data-import.match.criterion-type.incoming-begins-with-existing',
                  }, {
                    value: 'EXISTING_VALUE_ENDS_WITH_INCOMING_VALUE',
                    label: 'ui-data-import.match.criterion-type.existing-ends-with-incoming',
                  }, {
                    value: 'INCOMING_VALUE_ENDS_WITH_EXISTING_VALUE',
                    label: 'ui-data-import.match.criterion-type.incoming-ends-with-existing',
                  }],
                  validate: null, // Not defined yet, TBD
                  dataAttributes: {},
                }],
              }, { // Existing Instance Record #1
                controlType: 'Section',
                label: 'ui-data-import.match.existing.instance',
                optional: false,
                classNames: ['existing'],
                dataAttributes: {},
                children: [{
                  controlType: 'Section',
                  label: 'ui-data-import.match.existing.instance.field',
                  optional: false,
                  classNames: ['field', 'input-container'],
                  dataAttributes: {},
                  children: [{
                    controlType: 'Field',
                    id: 'criterion1-value-type',
                    name: 'valueType',
                    label: '',
                    component: 'Select',
                    placeholder: '',
                    dataOptions: [{
                      value: 'VALUE_FROM_RECORD',
                      label: 'ui-data-import.match.value-type.value-from-record',
                    }, {
                      value: 'STATIC_VALUE',
                      label: 'ui-data-import.match.value-type.static-value',
                    }],
                    validate: null, // Not defined yet, TBD
                    dataAttributes: {},
                  }, {
                    controlType: 'Field',
                    id: '',
                    name: '',
                    label: '',
                    component: 'Select',
                    placeholder: '',
                    dataOptions: [{
                      value: 'TEXT',
                      label: 'ui-data-import.match.static-value-type.text',
                    }, {
                      value: 'NUMBER',
                      label: 'ui-data-import.match.static-value-type.number',
                    }, {
                      value: 'DATE',
                      label: 'ui-data-import.match.static-value-type.date',
                    }],
                    validate: null, // Not defined yet, TBD
                    dataAttributes: {},
                  }],
                }, {
                  controlType: 'Section',
                  label: 'ui-data-import.match.existing.qualifier',
                  optional: true,
                  enabled: false,
                  classNames: ['qualifier', 'input-container'],
                  dataAttributes: {},
                  children: [{
                    controlType: 'Field',
                    id: '',
                    name: '',
                    label: '',
                    component: 'Select',
                    placeholder: '',
                    dataOptions: [{
                      value: 'BEGINS_WITH',
                      label: 'ui-data-import.match.qualifier.begins-with',
                    }, {
                      value: 'ENDS_WITH',
                      label: 'ui-data-import.match.qualifier.ends-with',
                    }, {
                      value: 'CONTAINS',
                      label: 'ui-data-import.match.qualifier.contains',
                    }],
                    validate: null, // Not defined yet, TBD
                    dataAttributes: {},
                  }, {
                    controlType: 'Field',
                    id: '',
                    name: '',
                    label: '',
                    component: 'TextField',
                    validate: null, // Not defined yet, TBD
                    dataAttributes: {},
                  }],
                }, {
                  controlType: 'Section',
                  label: 'ui-data-import.match.existing.part',
                  optional: true,
                  enabled: false,
                  classNames: ['part', 'input-container'],
                  dataAttributes: {},
                  children: [{
                    controlType: 'Field',
                    id: '',
                    name: '',
                    label: '',
                    component: 'Select',
                    placeholder: '',
                    dataOptions: [{
                      value: 'NUMERICS_ONLY',
                      label: 'ui-data-import.match.comparison-part.numerics-only',
                    }, {
                      value: 'ALPHANUMERICS_ONLY',
                      label: 'ui-data-import.match.comparison-part.alpha-numerics-only',
                    }],
                    validate: null, // Not defined yet, TBD
                    dataAttributes: {},
                  }],
                }],
              }],
            }],
          }],
        }],
      }],
    }],
  }, /* {
    controlType: 'ConfirmationModal',
    id: 'confirm-edit-match-profile-modal',
    heading: 'ui-data-import.settings.matchProfiles.confirmEditModal.heading',
    message: '',
    confirmLabel: '',
    dataAttributes: {},
  } */],
}];
