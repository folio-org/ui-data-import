/**
 * FlexibleForm ControlsRenderer sample config.
 *
 * Assumptions and simplifications made for this POC:
 *
 * @type {*[]}
 */
export const formConfigSamples = [{
  id: 'form-match-profiles',
  name: 'matchProfilesForm',
  caption: 'ui-data-import.summary',
  template: 'simple',
  staticNamespace: '',
  editableNamespace: 'profile',
  dataAttributes: {},
  // Common Sections Block:
  commonSections: [{ // Incoming MARC Field section
    controlType: 'Section',
    staticControlType: 'Section',
    id: '**ns**-record-field',
    sectionKey: 'fieldMarc',
    name: '**ns**MatchExpression',
    label: 'ui-data-import.match.**ns**.record.field',
    optional: false,
    classNames: ['field', 'input-container'],
    dataAttributes: {},
    childControls: [{
      controlType: 'Field',
      staticControlType: 'KeyValue',
      component: 'TextField',
      id: 'criterion-**ns**.field.main',
      name: 'matchDetails[##ri##].**ns**MatchExpression.fields[0].value',
      label: 'ui-data-import.match.**ns**.MARC.field-main',
      validate: ['validateValueType', 'validateValueLength3'],
      dataAttributes: { 'data-test-field-main': '' },
    }, {
      controlType: 'Field',
      staticControlType: 'KeyValue',
      component: 'TextField',
      id: 'criterion-**ns**.field.in1',
      name: 'matchDetails[##ri##].**ns**MatchExpression.fields[1].value',
      label: 'ui-data-import.match.**ns**.MARC.field-in1',
      validate: ['validateValueType', 'validateValueLength1'],
      dataAttributes: { 'data-test-field-in1': '' },
    }, {
      controlType: 'Field',
      staticControlType: 'KeyValue',
      component: 'TextField',
      id: 'criterion-**ns**.field.in2',
      name: 'matchDetails[##ri##].**ns**MatchExpression.fields[2].value',
      label: 'ui-data-import.match.**ns**.MARC.field-in2',
      validate: ['validateValueType', 'validateValueLength1'],
      dataAttributes: { 'data-test-field-in2': '' },
    }, {
      controlType: 'Field',
      staticControlType: 'KeyValue',
      component: 'TextField',
      id: 'criterion-**ns**.field.subfield',
      name: 'matchDetails[##ri##].**ns**MatchExpression.fields[3].value',
      label: 'ui-data-import.match.**ns**.MARC.field-subfield',
      validate: ['validateValueType', 'validateValueLength1'],
      dataAttributes: { 'data-test-field-subfield': '' },
    }],
  }, {
    controlType: 'Section',
    sectionKey: 'fieldInstance',
    staticControlType: 'Section',
    label: 'ui-data-import.match.**ns**.record.field',
    id: '**ns**-record-field',
    optional: false,
    classNames: ['field', 'input-container'],
    dataAttributes: {},
    childControls: [{
      controlType: 'Field',
      staticControlType: 'KeyValue',
      id: 'criterion-value-type',
      name: 'matchDetails[##ri##].**ns**MatchExpression.fields[0].value',
      label: '',
      component: 'Selection',
      placeholder: '',
      dataOptions: [],
      validate: null,
      dataAttributes: {},
    }],
  }, {
    controlType: 'Section',
    sectionKey: 'staticValueType',
    staticControlType: 'Section',
    label: 'ui-data-import.match.**ns**.MARC.static-value-type',
    id: '**ns**-static-value',
    optional: false,
    classNames: ['field', 'input-container'],
    dataAttributes: {},
    childControls: [{
      controlType: 'Field',
      staticControlType: 'KeyValue',
      id: 'criterion-static-value-type',
      name: 'matchDetails[##ri##].**ns**MatchExpression.staticValueDetails.staticValueType',
      label: '',
      component: 'Select',
      dataOptions: [{
        value: 'TEXT',
        label: 'ui-data-import.match.**ns**.MARC.static-value-type-text',
      }, {
        value: 'NUMBER',
        label: 'ui-data-import.match.**ns**.MARC.static-value-type-number',
      }, {
        value: 'DATE',
        label: 'ui-data-import.match.**ns**.MARC.static-value-type-date',
      }, {
        value: 'DATE_RANGE',
        label: 'ui-data-import.match.**ns**.MARC.static-value-type-date-range',
      }],
      placeholder: '',
      validate: null,
      dataAttributes: {},
    }],
  }, {
    controlType: 'Section',
    sectionKey: 'staticValueText',
    staticControlType: 'Section',
    label: 'ui-data-import.match.**ns**.MARC.static-value-text',
    id: '**ns**-static-value',
    optional: false,
    classNames: ['field', 'no-label', 'input-container'],
    dataAttributes: {},
    childControls: [{
      controlType: 'Field',
      staticControlType: 'KeyValue',
      id: 'criterion-static-value-type',
      name: 'matchDetails[##ri##].**ns**MatchExpression.staticValueDetails.text',
      label: '',
      component: 'TextField',
      placeholder: '',
      validate: null,
      dataAttributes: {},
    }],
  }, {
    controlType: 'Section',
    sectionKey: 'qualifier',
    staticControlType: 'Section',
    label: 'ui-data-import.match.**ns**.qualifier',
    name: '**ns**Qualifier',
    optional: true,
    enabled: false,
    classNames: ['qualifier', 'input-container'],
    dataAttributes: {},
    childControls: [{
      controlType: 'Field',
      staticControlType: 'KeyValue',
      id: 'criterion-**ns**.qualifier.term',
      name: 'matchDetails[##ri##].**ns**MatchExpression.qualifier.qualifierType',
      component: 'Select',
      placeholder: 'Select qualifier type',
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
      validate: null,
      dataAttributes: {},
    }, {
      controlType: 'Field',
      staticControlType: 'KeyValue',
      id: 'criterion-**ns**.qualifier.value',
      name: 'matchDetails[##ri##].**ns**MatchExpression.qualifier.qualifierValue',
      component: 'TextField',
      placeholder: '',
      validate: null,
      dataAttributes: {},
    }],
  }, {
    controlType: 'Section',
    sectionKey: 'qualifierPart',
    staticControlType: 'Section',
    label: 'ui-data-import.match.**ns**.part',
    optional: true,
    enabled: false,
    classNames: ['part', 'input-container'],
    dataAttributes: {},
    childControls: [{
      controlType: 'Field',
      staticControlType: 'KeyValue',
      id: 'criterion-**ns**.qualifier.term',
      name: 'matchDetails[##ri##].**ns**MatchExpression.qualifier.comparisonPart',
      label: '',
      component: 'Select',
      placeholder: 'Select comparison type',
      dataOptions: [{
        value: 'NUMERICS_ONLY',
        label: 'ui-data-import.match.comparison-part.numerics-only',
      }, {
        value: 'ALPHANUMERICS_ONLY',
        label: 'ui-data-import.match.comparison-part.alpha-numerics-only',
      }],
      validate: null,
      dataAttributes: { 'data-test-compare-part': '' },
    }],
  }],
  childControls: [{
    controlType: 'Headline',
    staticControlType: 'Fragment',
    id: 'profile-headline',
    size: 'xx-large',
    tag: 'h2',
    dataAttributes: { 'data-test-header-title': true },
  }, {
    controlType: 'AccordionSet',
    staticControlType: 'AccordionSet',
    dataAttributes: {},
    childControls: [{
      controlType: 'Accordion',
      staticControlType: 'Fragment',
      id: 'summary',
      collapsed: false,
      separator: false,
      label: 'ui-data-import.summary',
      dataAttributes: {},
      childControls: [{
        controlType: 'Field',
        staticControlType: 'Fragment',
        component: 'TextField',
        name: 'name',
        label: 'ui-data-import.name',
        required: true,
        validate: ['validateRequiredField'],
        dataAttributes: { 'data-test-name-field': '' },
      }, {
        controlType: 'Field',
        staticControlType: 'Fragment',
        component: 'TextArea',
        name: 'description',
        label: 'ui-data-import.description',
        validate: null,
        dataAttributes: { 'data-test-description-field': '' },
      }],
    }, {
      controlType: 'Accordion',
      staticControlType: 'Accordion',
      id: 'match-profile-details',
      collapsed: false,
      separator: false,
      label: 'ui-data-import.details',
      dataAttributes: {},
      childControls: [{
        controlType: 'RecordTypesSelect',
        staticControlType: 'RecordTypesSelect',
        id: 'panel-existing',
        name: 'existingType',
        label: 'ui-data-import.record-type.existing',
        required: true,
        validate: null,
        dataAttributes: {},
      }, { // Match Criteria Set section
        controlType: 'Accordion',
        staticControlType: 'Accordion',
        id: 'match-criteria',
        collapsed: false,
        separator: null,
        label: 'ui-data-import.match.criteria',
        dataAttributes: {},
        childControls: [{
          controlType: 'Section',
          staticControlType: 'Section',
          optional: false,
          classNames: ['match-criteria'],
          repeatable: true,
          name: 'matchDetails',
          fields: 'matchDetails',
          emptyMessage: 'EMPTY FIELDS HERE',
          dataAttributes: {},
          childControls: [{ // Match Criterions List (array)
            controlType: 'Accordion',
            staticControlType: 'Accordion',
            label: 'ui-data-import.match.criterion',
            collapsed: false,
            separator: null,
            childControls: [{
              controlType: 'Section',
              staticControlType: 'Section',
              optional: false,
              classNames: ['match-criterion'],
              dataAttributes: {},
              childControls: [{ // Incoming Record Section
                controlType: 'Section',
                staticControlType: 'Section',
                label: 'ui-data-import.match.incoming.record',
                id: 'incoming-record-section',
                optional: false,
                classNames: ['incoming'],
                dataAttributes: {},
                childControls: [{
                  controlType: 'CommonSection',
                  id: 'section-incoming-field',
                  stateField: 'incomingRecord',
                  sectionNamespace: 'incoming',
                  acceptedSections: {
                    MARC_BIBLIOGRAPHIC: 'fieldMarc',
                    MARC_HOLDINGS: 'fieldMarc',
                    MARC_AUTHORITY: 'fieldMarc',
                    STATIC_VALUE: 'staticValueType',
                  },
                }, {
                  controlType: 'CommonSection',
                  id: 'section-incoming-qualifier',
                  stateField: 'incomingRecord',
                  sectionNamespace: 'incoming',
                  acceptedSections: {
                    MARC_BIBLIOGRAPHIC: 'qualifier',
                    MARC_HOLDINGS: 'qualifier',
                    MARC_AUTHORITY: 'qualifier',
                    EDIFACT_INVOICE: 'qualifier',
                    DELIMITED: 'qualifier',
                  },
                }, {
                  controlType: 'CommonSection',
                  id: 'section-incoming-qualifier-part',
                  stateField: 'incomingRecord',
                  sectionNamespace: 'incoming',
                  acceptedSections: {
                    MARC_BIBLIOGRAPHIC: 'qualifierPart',
                    MARC_HOLDINGS: 'qualifierPart',
                    MARC_AUTHORITY: 'qualifierPart',
                    EDIFACT_INVOICE: 'qualifierPart',
                    DELIMITED: 'qualifierPart',
                  },
                }, {
                  controlType: 'CommonSection',
                  id: 'section-incoming-static-value-text',
                  stateField: 'staticValueType',
                  sectionNamespace: 'incoming',
                  acceptedSections: {
                    TEXT: 'staticValueText',
                    NUMBER: 'staticValueNumber',
                    DATE: 'staticValueDate',
                    DATE_RANGE: 'staticValueDateRange',
                  },
                }],
              }, { // Match Criterion Section
                controlType: 'Section',
                staticControlType: 'Section',
                label: 'ui-data-import.match.criterion',
                name: 'matchCriterion',
                optional: false,
                classNames: ['criterion', 'input-container'],
                dataAttributes: {},
                childControls: [{
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  component: 'Select',
                  id: 'criterion-criterion-type',
                  name: 'matchDetails[##ri##].matchCriterion',
                  label: '',
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
                  validate: null,
                  dataAttributes: { 'data-test-match-criterion': '' },
                }],
              }, { // Existing Record Section
                controlType: 'Section',
                staticControlType: 'Section',
                label: 'ui-data-import.match.existing.record',
                id: 'existing-record-section',
                optional: false,
                classNames: ['existing'],
                dataAttributes: {},
                childControls: [{
                  controlType: 'CommonSection',
                  id: 'section-existing-field',
                  stateField: 'existingRecord',
                  sectionNamespace: 'existing',
                  acceptedSections: {
                    INSTANCE: 'fieldInstance',
                    HOLDINGS: 'fieldInstance',
                    ITEM: 'fieldInstance',
                    ORDER: 'fieldInstance',
                    INVOICE: 'fieldInstance',
                    MARC_BIBLIOGRAPHIC: 'fieldMarc',
                    MARC_HOLDINGS: 'fieldMarc',
                    MARC_AUTHORITY: 'fieldMarc',
                    STATIC_VALUE: 'fieldStatic',
                  },
                }, {
                  controlType: 'CommonSection',
                  id: 'section-existing-qualifier',
                  stateField: 'existingRecord',
                  sectionNamespace: 'existing',
                  acceptedSections: {
                    MARC_BIBLIOGRAPHIC: 'qualifier',
                    MARC_HOLDINGS: 'qualifier',
                    MARC_AUTHORITY: 'qualifier',
                    EDIFACT_INVOICE: 'qualifier',
                    DELIMITED: 'qualifier',
                  },
                }, {
                  controlType: 'CommonSection',
                  id: 'section-existing-qualifier-part',
                  stateField: 'existingRecord',
                  sectionNamespace: 'existing',
                  acceptedSections: {
                    MARC_BIBLIOGRAPHIC: 'qualifierPart',
                    MARC_HOLDINGS: 'qualifierPart',
                    MARC_AUTHORITY: 'qualifierPart',
                    EDIFACT_INVOICE: 'qualifierPart',
                    DELIMITED: 'qualifierPart',
                  },
                }],
              }],
            }],
          }],
        }],
      }],
    }],
  }, {
    controlType: 'ConfirmationModal',
    staticControlType: 'Fragment',
    id: 'confirm-edit-match-profile-modal',
    dataAttributes: {},
  }],
}, {
  id: 'form-mapping-profiles',
  name: 'mappingProfilesForm',
  staticNamespace: '',
  editableNamespace: '',
  classNames: ['mapping-profiles'],
  childControls: [{
    controlType: 'Accordion',
    staticControlType: 'Accordion',
    id: 'mapping-profile-details',
    collapsed: false,
    separator: false,
    label: 'ui-data-import.details',
    dataAttributes: {},
    childControls: [{
      controlType: 'Headline',
      staticControlType: 'Fragment',
      id: 'instance-headline',
      size: 'xx-large',
      tag: 'h2',
    }, {
      controlType: 'AccordionSet',
      staticControlType: 'AccordionSet',
      dataAttributes: {},
      childControls: [{ // Administrative data section start
        controlType: 'Accordion',
        staticControlType: 'Fragment',
        id: 'administrative-data',
        collapsed: false,
        separator: true,
        label: 'ui-data-import.settings.mappingProfiles.details.instance.administrativeData',
        dataAttributes: {},
        childControls: [{
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 3,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'Checkbox',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.suppressDiscoveryField', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.suppressDiscoveryField',
              validate: null,
              dataAttributes: { 'data-test-field-main': '' },
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 3,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'Checkbox',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.staffSuppressField', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.staffSuppressField',
              validate: null,
              dataAttributes: { 'data-test-field-main': '' },
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 3,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'Checkbox',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.previouslyHeldField', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.previouslyHeldField',
              validate: null,
              dataAttributes: { 'data-test-field-main': '' },
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 5,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              disabled: true,
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.Hrid', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.Hrid',
              validate: [],
              dataAttributes: { 'data-test-field-main': '' },
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 5,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              required: true,
              disabled: true,
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.metadataSource', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.metadataSource',
              validate: [],
              dataAttributes: { 'data-test-field-main': '' },
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 5,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'Datepicker',
              dateFormat: 'YYYY-MM-DD',
              backendDateStandard: 'YYYY-MM-DD',
              label: 'ui-data-import.catalogedDate',
              name: 'catalogedDate',
              disabled: false,
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'Select',
              label: 'ui-data-import.instanceStatus',
              name: 'statusId',
              placeholder: 'Select instance status',
              dataOptions: [],
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'Select',
              label: 'ui-data-import.modeOfIssuance',
              name: 'issuanceId',
              placeholder: 'Select mode of issuance',
              dataOptions: [],
            }],
          }],
        }, { // start of statisticalCode repetable section
          controlType: 'Row',
          staticControlType: 'Row',
          dataAttributes: {},
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'div',
              staticControlType: 'Fragment',
              repeatable: true,
              name: 'mappingProfiles.details.instance.statisticalCode', // to be changed
              id: 'statistical-code',
              label: 'ui-data-import.settings.mappingProfiles.details.instance.statisticalCode',
              addLabel: 'ui-data-import.settings.mappingProfiles.details.instance.addStatisticalCode',
              childControls: [{
                controlType: 'TextField',
                ariaLabelledBy: 'statisticalCode',
              }],
            }],
          }],  // end of repetable section
        }],  // Administrative data section end
      }, { // Title data section start
        controlType: 'Accordion',
        staticControlType: 'Fragment',
        id: 'title-data',
        collapsed: false,
        separator: true,
        label: 'ui-data-import.settings.mappingProfiles.details.instance.titleData',
        dataAttributes: {},
        childControls: [{
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.resourceTitle', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.resourceTitle',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.alternativeTitles',
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 5,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              disabled: true,
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.type', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.type',
              validate: null,
              dataAttributes: {},
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 5,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              disabled: true,
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.alternativeTitle', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.alternativeTitle',
              validate: null,
              dataAttributes: {},
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              disabled: true,
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.indexTitle', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.indexTitle',
              validate: null,
              dataAttributes: {},
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Headline',
              staticControlType: 'Headline',
              margin: 'x-small',
              childControls: [{
                controlType: 'FormattedMessage',
                staticControlType: 'FormattedMessage',
                id: 'ui-data-import.settings.mappingProfiles.details.instance.seriesStatements',
              }],
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              disabled: true,
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.seriesStatements', // to be changed
              validate: null,
              dataAttributes: {},
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.relatedTitles',
            }],
          }],
        }, { // start of precedingTitles repetable section
          controlType: 'Row',
          staticControlType: 'Row',
          dataAttributes: {},
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'div',
              staticControlType: 'Fragment',
              repeatable: true,
              name: 'mappingProfiles.details.instance.precedingTitles', // to be changed
              id: 'preceding-titles',
              label: '',
              addLabel: 'ui-data-import.settings.mappingProfiles.details.instance.addPrecedingTitle',
              legend: 'ui-data-import.settings.mappingProfiles.details.instance.precedingTitles',
              childControls: [{
                controlType: 'TextField',
                staticControlType: 'Fragment',
                ariaLabelledBy: 'folioId_1',
              }],
            }],
          }],  // end of precedingTitles repetable section
        }, { // start of succeedingTitles repetable section
          controlType: 'Row',
          staticControlType: 'Row',
          dataAttributes: {},
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'div',
              staticControlType: 'Fragment',
              repeatable: true,
              name: 'mappingProfiles.details.instance.succeedingTitles', // to be changed
              id: 'succeeding-titles',
              label: '',
              addLabel: 'ui-data-import.settings.mappingProfiles.details.instance.addSucceedingTitle',
              legend: 'ui-data-import.settings.mappingProfiles.details.instance.succeedingTitles',
              childControls: [{
                controlType: 'TextField',
                staticControlType: 'Fragment',
                ariaLabelledBy: 'folioId_2',
              }],
            }],
          }],  // end of succeedingTitles repetable section
        }],  // Title data section end
      }, { // Identifier section start
        controlType: 'Accordion',
        staticControlType: 'Fragment',
        id: 'identifier',
        collapsed: false,
        separator: true,
        label: 'ui-data-import.settings.mappingProfiles.details.instance.identifier',
        dataAttributes: {},
        childControls: [{
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.identifiers',
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 5,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.type', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.type',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 5,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.identifier', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.identifier',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }],
        }],  // Identifier section end
      }, { // Contributor section start
        controlType: 'Accordion',
        staticControlType: 'Fragment',
        id: 'contributor',
        collapsed: false,
        separator: true,
        label: 'ui-data-import.settings.mappingProfiles.details.instance.contributor',
        dataAttributes: {},
        childControls: [{
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.contributors',
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 2,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.name', // to be changed
              label: 'ui-data-import.name',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 2,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.nameType', // to be changed
              label: 'ui-data-import.nameType',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 2,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.type', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.type',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 2,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.typeFreeText', // to be changed
              label: 'ui-data-import.typeFreeText',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 2,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.primary', // to be changed
              label: 'ui-data-import.primary',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }],
        }],  // Contributor section end
      }, { // Descriptive data section start
        controlType: 'Accordion',
        staticControlType: 'Fragment',
        id: 'descriptive',
        collapsed: false,
        separator: true,
        label: 'ui-data-import.settings.mappingProfiles.details.instance.descriptiveData',
        dataAttributes: {},
        childControls: [{
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.publications',
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Row',
              staticControlType: 'Row',
              childControls: [{
                controlType: 'Col',
                staticControlType: 'Col',
                xs: null,
                childControls: [{
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  component: 'TextField',
                  // id: 'criterion1-incoming.field.main',
                  name: 'mappingProfiles.details.instance.publisher', // to be changed
                  label: 'ui-data-import.settings.mappingProfiles.details.instance.publisher',
                  validate: null,
                  disabled: true,
                  dataAttributes: {},
                }],
              }, {
                controlType: 'Col',
                staticControlType: 'Col',
                xs: null,
                childControls: [{
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  component: 'TextField',
                  // id: 'criterion1-incoming.field.main',
                  name: 'mappingProfiles.details.instance.publisherRole', // to be changed
                  label: 'ui-data-import.settings.mappingProfiles.details.instance.publisherRole',
                  validate: null,
                  disabled: true,
                  dataAttributes: {},
                }],
              }, {
                controlType: 'Col',
                staticControlType: 'Col',
                xs: null,
                childControls: [{
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  component: 'TextField',
                  // id: 'criterion1-incoming.field.main',
                  name: 'mappingProfiles.details.instance.place', // to be changed
                  label: 'ui-data-import.settings.mappingProfiles.details.instance.place',
                  validate: null,
                  disabled: true,
                  dataAttributes: {},
                }],
              }, {
                controlType: 'Col',
                staticControlType: 'Col',
                xs: null,
                childControls: [{
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  component: 'TextField',
                  // id: 'criterion1-incoming.field.main',
                  name: 'mappingProfiles.details.instance.dateOfPublication', // to be changed
                  label: 'ui-data-import.settings.mappingProfiles.details.instance.dateOfPublication',
                  validate: null,
                  disabled: true,
                  dataAttributes: {},
                }],
              }],
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.editions',
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.edition', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.edition',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.physicalDescriptions',
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.physicalDescription', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.physicalDescription',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.resourceType', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.resourceType',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }],
        }, { // start of NatureOfContent repetable section
          controlType: 'Row',
          staticControlType: 'Row',
          dataAttributes: {},
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'div',
              staticControlType: 'Fragment',
              repeatable: true,
              name: 'mappingProfiles.details.instance.natureOfContentTerms', // to be changed
              id: 'nature-of-content-terms',
              label: '',
              addLabel: 'ui-data-import.settings.mappingProfiles.details.instance.addNatureOfContentTerm',
              legend: 'ui-data-import.settings.mappingProfiles.details.instance.natureOfContentTerms',
              childControls: [{
                controlType: 'TextField',
                ariaLabelledBy: 'natureOfContentTerm',
              }],
            }],
          }],  // end of NatureOfContent repetable section
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.formats',
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.format', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.format',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.languages',
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.language', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.language',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.publicationFrequency',
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.publicationFrequency', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.publicationFrequency',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.publicationRange',
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.publicationRange', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.publicationRange',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }],
        }],  // Descriptive data section end
      }, { // instanceNotes section start
        controlType: 'Accordion',
        staticControlType: 'Fragment',
        id: 'instanceNotes',
        collapsed: false,
        separator: true,
        label: 'ui-data-import.settings.mappingProfiles.details.instance.instanceNotes',
        dataAttributes: {},
        childControls: [{
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.notes',
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Row',
              staticControlType: 'Row',
              childControls: [{
                controlType: 'Col',
                staticControlType: 'Col',
                xs: null,
                childControls: [{
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  component: 'TextField',
                  // id: 'criterion1-incoming.field.main',
                  name: 'mappingProfiles.details.instance.noteType', // to be changed
                  label: 'ui-data-import.settings.mappingProfiles.details.instance.noteType',
                  validate: null,
                  disabled: true,
                  dataAttributes: {},
                }],
              }, {
                controlType: 'Col',
                staticControlType: 'Col',
                xs: null,
                childControls: [{
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  component: 'TextField',
                  // id: 'criterion1-incoming.field.main',
                  name: 'mappingProfiles.details.instance.note', // to be changed
                  label: 'ui-data-import.settings.mappingProfiles.details.instance.note',
                  validate: null,
                  disabled: true,
                  dataAttributes: {},
                }],
              }, {
                controlType: 'Col',
                staticControlType: 'Col',
                xs: null,
                childControls: [{
                  controlType: 'Field',
                  staticControlType: 'KeyValue',
                  component: 'TextField',
                  // id: 'criterion1-incoming.field.main',
                  name: 'mappingProfiles.details.instance.staffOnly', // to be changed
                  label: 'ui-data-import.settings.mappingProfiles.details.instance.staffOnly',
                  validate: null,
                  disabled: true,
                  dataAttributes: {},
                }],
              }],
            }],
          }],
        }],  // instanceNotes section end
      }, { // electronicAccess section start
        controlType: 'Accordion',
        staticControlType: 'Fragment',
        id: 'electronicAccess',
        collapsed: false,
        separator: true,
        label: 'ui-data-import.settings.mappingProfiles.details.instance.electronicAccess',
        dataAttributes: {},
        childControls: [{
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.electronicAccess',
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          bottom: 'xs',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 2,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.urlRelationship', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.urlRelationship',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 2,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.uri', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.uri',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 2,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.linkText', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.linkText',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 2,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.materialsSpecification', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.materialsSpecification',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 2,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.urlPublicNote', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.urlPublicNote',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }],
        }],  // electronicAccess section end
      }, { // Subject section start
        controlType: 'Accordion',
        staticControlType: 'Fragment',
        id: 'subject',
        collapsed: false,
        separator: true,
        label: 'ui-data-import.settings.mappingProfiles.details.instance.subjects',
        dataAttributes: {},
        childControls: [{
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.subjects', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.subjects',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }],
        }],  // Subject section end
      }, { // classification section start
        controlType: 'Accordion',
        staticControlType: 'Fragment',
        id: 'classification',
        collapsed: false,
        separator: true,
        label: 'ui-data-import.settings.mappingProfiles.details.instance.classification',
        dataAttributes: {},
        childControls: [{
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'FormattedMessage',
              staticControlType: 'FormattedMessage',
              id: 'ui-data-import.settings.mappingProfiles.details.instance.classification',
            }],
          }],
        }, {
          controlType: 'Row',
          staticControlType: 'Row',
          bottom: 'xs',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 5,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.classificationIdentifierType', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.classificationIdentifierType',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }, {
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 5,
            childControls: [{
              controlType: 'Field',
              staticControlType: 'KeyValue',
              component: 'TextField',
              // id: 'criterion1-incoming.field.main',
              name: 'mappingProfiles.details.instance.classification', // to be changed
              label: 'ui-data-import.settings.mappingProfiles.details.instance.classification',
              validate: null,
              disabled: true,
              dataAttributes: {},
            }],
          }],
        }],  // classification section end
      }, { // instanceRelationshipAnalyticsBoundWith section start
        controlType: 'Accordion',
        staticControlType: 'Fragment',
        id: 'instanceRelationshipAnalyticsBoundWith',
        collapsed: false,
        separator: true,
        label: 'ui-data-import.settings.mappingProfiles.details.instance.instanceRelationshipAnalyticsBoundWith',
        dataAttributes: {},
        childControls: [{ // start parentInstances repeatable section
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'div',
              staticControlType: 'Fragment',
              repeatable: true,
              name: 'mappingProfiles.details.instance.parentInstances', // to be changed
              id: 'parent-instances',
              legend: 'ui-data-import.settings.mappingProfiles.details.instance.parentInstances',
              addLabel: 'ui-data-import.settings.mappingProfiles.details.instance.addParentInstance',
              childControls: [{
                controlType: 'Row',
                staticControlType: 'Row',
                childControls: [{
                  controlType: 'Col',
                  staticControlType: 'Col',
                  xs: 6,
                  childControls: [{
                    controlType: 'TextField',
                    staticControlType: 'TextField',
                    ariaLabelledBy: 'parentInstances',
                    name: 'parent-instances',
                  }],
                }, {
                  controlType: 'Col',
                  staticControlType: 'Col',
                  xs: 6,
                  childControls: [{
                    controlType: 'TextField',
                    staticControlType: 'TextField',
                    ariaLabelledBy: 'typeOfRelation',
                    name: 'parent-relation',
                  }],
                }],
              }],
            }],
          }], // end parentInstances repeatable section
        }, { // start childInstances repeatable section
          controlType: 'Row',
          staticControlType: 'Row',
          childControls: [{
            controlType: 'Col',
            staticControlType: 'Col',
            xs: 10,
            childControls: [{
              controlType: 'div',
              staticControlType: 'Fragment',
              repeatable: true,
              name: 'mappingProfiles.details.instance.childInstances', // to be changed
              id: 'child-instances',
              legend: 'ui-data-import.settings.mappingProfiles.details.instance.childInstances',
              addLabel: 'ui-data-import.settings.mappingProfiles.details.instance.addChildInstance',
              childControls: [{
                controlType: 'Row',
                staticControlType: 'Row',
                childControls: [{
                  controlType: 'Col',
                  staticControlType: 'Col',
                  xs: 6,
                  childControls: [{
                    controlType: 'TextField',
                    staticControlType: 'TextField',
                    ariaLabelledBy: 'childInstance',
                    name: 'child-instances',
                  }],
                }, {
                  controlType: 'Col',
                  staticControlType: 'Col',
                  xs: 6,
                  childControls: [{
                    controlType: 'TextField',
                    staticControlType: 'TextField',
                    ariaLabelledBy: 'typeOfChildRelation',
                    name: 'child-relation',
                  }],
                }],
              }],
            }],
          }], // end childInstances repeatable section
        }],  // instanceRelationshipAnalyticsBoundWith section end
      }],
    }],
  }],
}];
