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
    controlType: 'AccordionSet',
    dataAttributes: {},
    children: [{
      controlType: 'Field',
      staticControlType: 'RecordTypesSelect',
      id: 'panel-existing',
      name: 'existingType',
      label: 'ui-data-import.record-type.existing',
      component: 'RecordTypesSelect',
      required: true,
      validate: null,
      dataAttributes: {},
    }, { // Match Criteria Set section
      controlType: 'Accordion',
      id: 'match-criteria',
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
                name: 'incomingMatchExpression',
                label: 'ui-data-import.match.incoming.MARC.field',
                optional: false,
                classNames: ['field', 'input-container'],
                dataAttributes: {},
                children: [{
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  id: 'criterion1-incoming.field.main',
                  name: 'marcRecordFieldMain',
                  label: 'ui-data-import.match.incoming.MARC.field-main',
                  component: 'TextField',
                  validate: null, // Not defined yet, TBD
                  dataAttributes: { 'data-test-field-main': '' },
                }, {
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  id: 'criterion1-incoming.field.in1',
                  name: 'marcRecordFieldIn1',
                  label: 'ui-data-import.match.incoming.MARC.field-in1',
                  component: 'TextField',
                  validate: null, // Not defined yet, TBD
                  dataAttributes: { 'data-test-field-in1': '' },
                }, {
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  id: 'criterion1-incoming.field.in2',
                  name: 'marcRecordFieldIn2',
                  label: 'ui-data-import.match.incoming.MARC.field-in2',
                  component: 'TextField',
                  validate: null, // Not defined yet, TBD
                  dataAttributes: { 'data-test-field-in2': '' },
                }, {
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  id: 'criterion1-incoming.field.subfield',
                  name: 'marcRecordFieldSubfield',
                  label: 'ui-data-import.match.incoming.MARC.field-subfield',
                  component: 'TextField',
                  validate: null, // Not defined yet, TBD
                  dataAttributes: { 'data-test-field-subfield': '' },
                }],
              }, {
                controlType: 'Section',
                label: 'ui-data-import.match.incoming.qualifier',
                parentName: 'incomingMatchExpression.qualifier',
                name: 'incomingQualifier',
                optional: true,
                enabled: false,
                classNames: ['qualifier', 'input-container'],
                dataAttributes: {},
                children: [{
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  childName: 'comparisonPart',
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
                  staticControlType: 'KeyValue',
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
                  staticControlType: 'KeyValue',
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
                  dataAttributes: { 'data-test-compare-part': '' },
                }],
              }],
            }, { // Match Criterion
              controlType: 'Section',
              label: 'ui-data-import.match.criterion',
              name: 'matchCriterion',
              optional: false,
              classNames: ['criterion', 'input-container'],
              dataAttributes: {},
              children: [{
                controlType: 'Field',
                staticControlType: 'KeyValue',
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
                dataAttributes: { 'data-test-match-criterion': '' },
              }],
            }, { // Existing Instance Record #1
              controlType: 'Section',
              label: 'ui-data-import.match.existing.record',
              name: 'existingRecordSection',
              optional: false,
              classNames: ['existing'],
              dataAttributes: {},
              children: [{
                controlType: 'Section',
                label: 'ui-data-import.match.existing.record.field',
                name: 'existingRecordField',
                optional: false,
                classNames: ['field', 'input-container'],
                dataAttributes: {},
                children: [{
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
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
                  staticControlType: 'KeyValue',
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
                name: 'existingQualifier',
                optional: true,
                enabled: false,
                classNames: ['qualifier', 'input-container'],
                dataAttributes: {},
                children: [{
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  id: '',
                  name: 'criterionExistingQualifierTerm',
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
                  staticControlType: 'KeyValue',
                  id: '',
                  name: 'criterionExistingQualifierValue',
                  label: '',
                  component: 'TextField',
                  validate: null, // Not defined yet, TBD
                  dataAttributes: {},
                }],
              }, {
                controlType: 'Section',
                label: 'ui-data-import.match.existing.part',
                name: 'existingPartOfTheValue',
                optional: true,
                enabled: false,
                classNames: ['part', 'input-container'],
                dataAttributes: {},
                children: [{
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  id: '',
                  name: 'criterionExistingValuePart',
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
  }, /* {
    controlType: 'ConfirmationModal',
    id: 'confirm-edit-match-profile-modal',
    heading: 'ui-data-import.settings.matchProfiles.confirmEditModal.heading',
    message: '',
    confirmLabel: '',
    dataAttributes: {},
  } */],
}];
