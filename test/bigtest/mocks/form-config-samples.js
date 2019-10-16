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
  dataAttributes: [],
  children: [{
    controlType: 'Headline',
    label: 'ui-data-import.match-details',
    size: 'xx-large',
    tag: 'h2',
    dataAttributes: ['data-test-header-title'],
  }, {
    controlType: 'AccordionSet',
    label: 'ui-data-import.summary',
    dataAttributes: [],
    children: [{
      controlType: 'Accordion',
      label: 'ui-data-import.match-metadata',
      separator: null,
      dataAttributes: [],
      children: [{
        controlType: 'Field',
        id: 'text-name',
        name: 'name',
        label: 'ui-data-import.match-name',
        component: 'TextField',
        required: true,
        validateion: null,
      }, {
        controlType: 'Field',
        id: 'text-description',
        name: 'description',
        label: 'ui-data-import.match-description',
        component: 'TextArea',
        required: false,
        validation: null,
      }],
    }, {
      controlType: 'Accordion',
      label: 'ui-data-import.match-criteria',
      collapsed: false,
      separator: null,
      dataAttributes: [],
      children: [{
        controlType: 'RecordTypesSelector',
        id: 'panel-existing',
        name: 'existingType',
        label: 'ui-data-import.record-type.existing',
        dataAttributes: [],
      }, { // Match Criteria Set section
        controlType: 'Section',
        label: 'ui-data-import.match.criteria',
        repeatable: true,
        dataAttributes: [],
        children: [{ // Match Criterions List (array)
          controlType: 'Accordion',
          label: 'ui-data-import.match.criterion',
          collapsed: false,
          separator: null,
          children: [{ // Incoming MARC Record
            controlType: 'Section',
            label: 'ui-data-import.match.incoming.MARC',
            optional: false,
            dataAttributes: [],
            children: [{
              controlType: 'Section',
              label: 'ui-data-import.match.incoming.MARC.field',
              optional: false,
              dataAttributes: [],
              children: [{
                controlType: 'Field',
                id: 'criterion1-incoming.field.main',
                name: 'marcRecordFieldMain',
                label: 'ui-data-import.match.incoming.MARC.field.main',
                component: 'TextField',
                validation: null, // Not defined yet, TBD
              }, {
                controlType: 'Field',
                id: 'criterion1-incoming.field.ln1',
                name: 'marcRecordFieldLn1',
                label: 'ui-data-import.match.incoming.MARC.field.ln1',
                component: 'TextField',
                validation: null, // Not defined yet, TBD
              }, {
                controlType: 'Field',
                id: 'criterion1-incoming.field.ln2',
                name: 'marcRecordFieldLn2',
                label: 'ui-data-import.match.incoming.MARC.field.ln2',
                component: 'TextField',
                validation: null, // Not defined yet, TBD
              }, {
                controlType: 'Field',
                id: 'criterion1-incoming.field.subfield',
                name: 'marcRecordFieldSubfield',
                label: 'ui-data-import.match.incoming.MARC.field.subfield',
                component: 'TextField',
                validation: null, // Not defined yet, TBD
              }],
            }, {
              controlType: 'Section',
              label: 'ui-data-import.match.incoming.qualifier.caption',
              optional: true,
              dataAttributes: [],
              children: [{
                controlType: 'Select',
                id: 'criterion1-incoming.qualifier.term',
                name: 'criterionIncomingQualifierTerm',
                label: 'ui-data-import.match.incoming.qualifier.term',
                validation: null, // Not defined yet, TBD
                children: [],
              }, {
                controlType: 'Field',
                id: 'criterion1-incoming.qualifier.value',
                name: 'criterionIncomingQualifierValue',
                label: 'ui-data-import.match.incoming.qualifier.value',
                component: 'TextField',
                validation: null, // Not defined yet, TBD
              }],
            }, {
              controlType: 'Section',
              label: '',
              optional: true,
              dataAttributes: [],
              children: [{
                controlType: 'Select',
                id: '',
                name: '',
                label: '',
                validation: null, // Not defined yet, TBD
                children: [],
              }],
            }],
          }, { // Match Criterion
            controlType: 'Section',
            label: 'ui-data-import.match.criterion',
            optional: false,
            dataAttributes: [],
            children: [{
              controlType: 'Select',
              id: '',
              name: '',
              label: '',
              validation: null,
              children: [],
            }],
          }, { // Existing Instance Record #1
            controlType: 'Section',
            label: 'ui-data-import.match.existing.instance',
            optional: false,
            dataAttributes: [],
            children: [{
              controlType: 'Section',
              label: '',
              optional: false,
              dataAttributes: [],
              children: [{
                controlType: 'Select',
                id: '',
                name: '',
                label: '',
                validation: null, // Not defined yet, TBD
                children: [],
              }, {
                controlType: 'Select',
                id: '',
                name: '',
                label: '',
                validation: null, // Not defined yet, TBD
                children: [],
              }],
            }, {
              controlType: 'Section',
              label: '',
              optional: true,
              dataAttributes: [],
              children: [{
                controlType: 'Select',
                id: '',
                name: '',
                label: '',
                validation: null, // Not defined yet, TBD
                children: [],
              }, {
                controlType: 'Field',
                id: '',
                name: '',
                label: '',
                component: 'TextField',
                validation: null, // Not defined yet, TBD
              }],
            }, {
              controlType: 'Section',
              label: '',
              optional: true,
              dataAttributes: [],
              children: [{
                controlType: 'Select',
                id: '',
                name: '',
                label: '',
                component: 'TextField',
                validation: null, // Not defined yet, TBD
              }],
            }],
          }],
        }, {
          controlType: 'Accordion',
          label: 'ui-data-import.match.criterion',
          collapsed: false,
          dataAttributes: [],
          children: [{ // Incoming MARC Record
            controlType: 'Section',
            label: 'ui-data-import.match.incoming.MARC',
            optional: false,
            dataAttributes: [],
            children: [{
              controlType: 'Section',
              label: 'ui-data-import.match.incoming.MARC.field',
              optional: false,
              dataAttributes: [],
              children: [{
                controlType: 'Field',
                id: 'criterion2-incoming.field.main',
                name: 'marcRecordFieldMain',
                label: 'ui-data-import.match.incoming.MARC.field.main',
                component: 'TextField',
                validation: null, // Not defined yet, TBD
              }, {
                controlType: 'Field',
                id: 'criterion2-incoming.field.ln1',
                name: 'marcRecordFieldLn1',
                label: 'ui-data-import.match.incoming.MARC.field.ln1',
                component: 'TextField',
                validation: null, // Not defined yet, TBD
              }, {
                controlType: 'Field',
                id: 'criterion2-incoming.field.ln2',
                name: 'marcRecordFieldLn2',
                label: 'ui-data-import.match.incoming.MARC.field.ln2',
                component: 'TextField',
                validation: null, // Not defined yet, TBD
              }, {
                controlType: 'Field',
                id: 'criterion2-incoming.field.subfield',
                name: 'marcRecordFieldSubfield',
                label: 'ui-data-import.match.incoming.MARC.field.subfield',
                component: 'TextField',
                validation: null, // Not defined yet, TBD
              }],
            }, {
              controlType: 'Section',
              label: '',
              optional: true,
              dataAttributes: [],
              children: [{
                controlType: 'Select',
                id: '',
                name: '',
                label: '',
                validation: null, // Not defined yet, TBD
                children: [],
              }, {
                controlType: 'Field',
                id: '',
                name: '',
                label: '',
                component: 'TextField',
                validation: null, // Not defined yet, TBD
              }],
            }, {
              controlType: 'Section',
              label: '',
              optional: true,
              dataAttributes: [],
              children: [{
                controlType: 'Select',
                id: '',
                name: '',
                label: '',
                validation: null, // Not defined yet, TBD
                children: [],
              }],
            }],
          }, { // Match Criterion
            controlType: 'Section',
            label: 'ui-data-import.match.criterion',
            optional: false,
            dataAttributes: [],
            children: [{
              controlType: 'Select',
              id: '',
              name: '',
              label: '',
              validationEnabled: null, // Not defined yet, TBD
              children: [],
            }],
          }, { // Existing Instance Record #1
            controlType: 'Section',
            label: 'ui-data-import.match.existing.instance',
            dataAttributes: [],
            optional: false,
            children: [{
              controlType: 'Section',
              label: '',
              optional: false,
              dataAttributes: [],
              children: [{
                controlType: 'Select',
                id: '',
                name: '',
                label: '',
                validation: null, // Not defined yet, TBD
                children: [],
              }, {
                controlType: 'Select',
                id: '',
                name: '',
                label: '',
                validation: null, // Not defined yet, TBD
                children: [],
              }],
            }, {
              controlType: 'Section',
              label: '',
              optional: true,
              dataAttributes: [],
              children: [{
                controlType: 'Select',
                id: '',
                name: '',
                label: '',
                validation: null, // Not defined yet, TBD
                children: [],
              }, {
                controlType: 'Field',
                id: '',
                name: '',
                label: '',
                ion: null, // Not defined yet, TBD
                children: [],
              }],
            }, {
              controlType: 'Section',
              label: '',
              optional: true,
              dataAttributes: [],
              children: [{
                controlType: 'Select',
                id: '',
                name: '',
                label: '',
                validation: null, // Not defined yet, TBD
                children: [],
              }],
            }],
          }],
        }],
      }],
    }],
  }, {
    controlType: 'ConfirmationModal',
    id: '',
    heading: '',
    message: '',
    confirmLabel: '',
    dataAttributes: [],
  }],
}];
