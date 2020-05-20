import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { get } from 'lodash';

import {
  Row,
  Col,
  AccordionSet,
  Accordion,
  TextField,
  RepeatableField,
} from '@folio/stripes/components';

import { validateMARCWithDate } from '../../../../utils';
import {
  AcceptedValuesField,
  BooleanActionField,
  withDatePicker,
} from '../../../../components';

export const MappingInstanceDetails = ({
  initialFields,
  referenceTables,
  setReferenceTables,
  okapi,
  intl,
}) => {
  const translationPrefix = 'ui-data-import.settings.mappingProfiles.map';
  const fieldNamePrefix = 'profile.mappingDetails';

  const getFieldName = mappingFieldIndex => {
    return `${fieldNamePrefix}.mappingFields[${mappingFieldIndex}].value`;
  };
  const getSubfieldName = (mappingFieldIndex, fieldIndex) => {
    return `${fieldNamePrefix}.mappingFields[${mappingFieldIndex}].subfields[0].fields[${fieldIndex}].value`;
  };

  const onAdd = (refTable, fieldName, incrementalField, fieldIndex) => {
    const fieldsPath = `${fieldNamePrefix}.mappingFields[${fieldIndex}].subfields`;
    let newInitRow = { ...get(initialFields, [fieldName], {}) };

    if (incrementalField) {
      newInitRow = {
        ...newInitRow,
        [incrementalField]: refTable.length,
      };
    }

    refTable.push(newInitRow);
    setReferenceTables(fieldsPath, refTable);
  };
  const onRemove = (index, refTable, incrementalField, fieldIndex) => {
    const fieldsPath = `${fieldNamePrefix}.mappingFields[${fieldIndex}].subfields`;
    let newRefTable = [...refTable];

    newRefTable.splice(index, 1);

    if (incrementalField) {
      newRefTable = newRefTable.map((row, i) => ({
        ...row,
        [incrementalField]: i,
      }));
    }

    setReferenceTables(fieldsPath, newRefTable);
  };

  const renderAdminData = () => {
    const statisticalCodes = get(referenceTables, 'statisticalCodeIds', []);

    return (
      <Accordion
        id="administrative-data"
        label={<FormattedMessage id={`${translationPrefix}.administrativeData.section`} />}
        separator
      >
        <Row left="xs">
          <Col
            data-test-suppress-from-discovery
            xs={4}
          >
            <BooleanActionField
              label={<FormattedMessage id={`${translationPrefix}.administrativeData.field.discoverySuppress`} />}
              name={`${fieldNamePrefix}.mappingFields[0].booleanFieldAction`}
            />
          </Col>
          <Col
            data-test-staff-suppress
            xs={4}
          >
            <BooleanActionField
              label={<FormattedMessage id={`${translationPrefix}.administrativeData.field.staffSuppress`} />}
              name={`${fieldNamePrefix}.mappingFields[1].booleanFieldAction`}
            />
          </Col>
          <Col
            data-test-previously-held
            xs={4}
          >
            <BooleanActionField
              label={<FormattedMessage id={`${translationPrefix}.administrativeData.field.previouslyHeld`} />}
              name={`${fieldNamePrefix}.mappingFields[2].booleanFieldAction`}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-instance-hrid
            xs={6}
          >
            <Field
              component={TextField}
              label={<FormattedMessage id={`${translationPrefix}.instance.administrationData.field.hrid`} />}
              name={getFieldName(3)}
              disabled
              enabled={false}
            />
          </Col>
          <Col
            data-test-metadata-source
            xs={6}
          >
            <Field
              component={TextField}
              label={<FormattedMessage id={`${translationPrefix}.instance.administrationData.field.source`} />}
              name={getFieldName(4)}
              disabled
              enabled={false}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-cataloged-date
            xs={6}
          >
            <Field
              component={withDatePicker}
              label={<FormattedMessage id={`${translationPrefix}.instance.administrationData.field.catalogedDate`} />}
              name={getFieldName(5)}
              WrappedComponent={TextField}
              wrapperLabel={`${translationPrefix}.wrapper.acceptedValues`}
              validate={[validateMARCWithDate]}
              intl={intl}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-status-term
            xs={12}
          >
            <AcceptedValuesField
              okapi={okapi}
              component={TextField}
              name={getFieldName(6)}
              label={<FormattedMessage id={`${translationPrefix}.instance.administrationData.field.statusId`} />}
              enabled
              optionValue="name"
              optionLabel="name"
              wrapperLabel={`${translationPrefix}.wrapper.acceptedValues`}
              wrapperSourceLink="/instance-statuses?limit=1000&query=cql.allRecords=1 sortby name"
              wrapperSourcePath="instanceStatuses"
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-mode-of-issuance
            xs={12}
          >
            <Field
              component={TextField}
              label={<FormattedMessage id={`${translationPrefix}.instance.administrationData.field.modeOfIssuanceId`} />}
              name={getFieldName(7)}
              enabled={false}
              disabled
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-statistical-codes
            xs={12}
          >
            <RepeatableField
              fields={statisticalCodes}
              addLabel={<FormattedMessage id={`${translationPrefix}.administrativeData.field.statisticalCodes.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.administrativeData.field.statisticalCodes.legend`} />}
              onAdd={() => onAdd(statisticalCodes, 'statisticalCodeIds', 'order', 8)}
              onRemove={index => onRemove(index, statisticalCodes, 'order', 8)}
              renderField={() => (
                <Row left="xs">
                  <Col
                    data-test-statistical-code
                    xs={12}
                  >
                    <AcceptedValuesField
                      okapi={okapi}
                      component={TextField}
                      name={getSubfieldName(8, 0)}
                      label={<FormattedMessage id={`${translationPrefix}.administrativeData.field.statisticalCode`} />}
                      optionLabel="name"
                      optionValue="name"
                      wrapperLabel={`${translationPrefix}.wrapper.acceptedValues`}
                      wrapperSourceLink="/statistical-codes?limit=2000&query=cql.allRecords=1 sortby name"
                      wrapperSourcePath="statisticalCodes"
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
      </Accordion>
    );
  };
  const renderTitleData = () => {
    const alternativeTitles = get(referenceTables, 'alternativeTitles', []);
    const seriesStatements = get(referenceTables, 'series', []);
    const precedingTitles = get(referenceTables, 'precedingTitles', []);
    const succeedingTitles = get(referenceTables, 'succeedingTitles', []);

    return (
      <Accordion
        id="title-data"
        label={<FormattedMessage id={`${translationPrefix}.instance.titleData.section`} />}
        separator
      >
        <Row left="xs">
          <Col
            data-test-resource-title
            xs={12}
          >
            <Field
              component={TextField}
              label={<FormattedMessage id={`${translationPrefix}.instance.titleData.field.title`} />}
              name={getFieldName(9)}
              enabled={false}
              disabled
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-alternative-titles
            xs={12}
          >
            <RepeatableField
              fields={alternativeTitles}
              addLabel={<FormattedMessage id={`${translationPrefix}.titleData.field.alternativeTitles.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.titleData.field.alternativeTitles.legend`} />}
              canAdd={false}
              canDelete={false}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col
                    data-test-alternative-title-type
                    xs={6}
                  >
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.alternativeTitles.field.alternativeTitleTypeId`} />}
                      name={getSubfieldName(10, index)}
                      disabled
                    />
                  </Col>
                  <Col
                    data-test-alternative-title
                    xs={6}
                  >
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.alternativeTitles.field.alternativeTitle`} />}
                      name={getSubfieldName(10, index)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-index-title
            xs={12}
          >
            <Field
              component={TextField}
              label={<FormattedMessage id={`${translationPrefix}.instance.titleData.field.indexTitle`} />}
              name={getFieldName(11)}
              enabled={false}
              disabled
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-series-statements
            xs={12}
          >
            <RepeatableField
              fields={seriesStatements}
              addLabel={<FormattedMessage id={`${translationPrefix}.titleData.field.series.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.titleData.field.series.legend`} />}
              canAdd={false}
              canDelete={false}
              renderField={() => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.series.field.series`} />}
                      name={getSubfieldName(12, 0)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-preceding-titles
            xs={12}
          >
            <RepeatableField
              fields={precedingTitles}
              addLabel={<FormattedMessage id={`${translationPrefix}.titleData.field.precedingTitles.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.titleData.field.precedingTitles.legend`} />}
              canAdd={false}
              canDelete={false}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.precedingTitles.field.precedingTitlesTitle`} />}
                      name={getSubfieldName(13, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.precedingTitles.field.precedingTitlesHrid`} />}
                      name={getSubfieldName(13, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.precedingTitles.field.precedingTitlesIsbn`} />}
                      name={getSubfieldName(13, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.precedingTitles.field.precedingTitlesIssn`} />}
                      name={getSubfieldName(13, index)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-succeeding-titles
            xs={12}
          >
            <RepeatableField
              fields={succeedingTitles}
              addLabel={<FormattedMessage id={`${translationPrefix}.titleData.field.succeedingTitles.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.titleData.field.succeedingTitles.legend`} />}
              canAdd={false}
              canDelete={false}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.succeedingTitles.field.succeedingTitlesTitle`} />}
                      name={getSubfieldName(14, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.succeedingTitles.field.succeedingTitlesHrid`} />}
                      name={getSubfieldName(14, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.succeedingTitles.field.succeedingTitlesIsbn`} />}
                      name={getSubfieldName(14, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.succeedingTitles.field.succeedingTitlesIssn`} />}
                      name={getSubfieldName(14, index)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
      </Accordion>
    );
  };
  const renderIdentifier = () => {
    const identifiers = get(referenceTables, 'identifiers', []);

    return (
      <Accordion
        id="identifiers"
        label={<FormattedMessage id={`${translationPrefix}.identifiers.section`} />}
        separator
      >
        <Row left="xs">
          <Col
            data-test-identifiers
            xs={12}
          >
            <RepeatableField
              fields={identifiers}
              addLabel={<FormattedMessage id={`${translationPrefix}.titleData.field.identifiers.addLabel`} />}
              canAdd={false}
              canDelete={false}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.identifiers.field.identifierTypeId`} />}
                      name={getSubfieldName(15, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.identifiers.field.value`} />}
                      name={getSubfieldName(14, index)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
      </Accordion>
    );
  };
  const renderContributor = () => {
    const contributors = get(referenceTables, 'contributors', []);

    return (
      <Accordion
        id="contributors"
        label={<FormattedMessage id={`${translationPrefix}.instance.contributors.section`} />}
        separator
      >
        <Row left="xs">
          <Col
            data-test-contributors
            xs={12}
          >
            <RepeatableField
              fields={contributors}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.contributors.field.addLabel`} />}
              canAdd={false}
              canDelete={false}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.contributors.field.contributorName`} />}
                      name={getSubfieldName(16, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.contributors.field.contributorNameTypeId`} />}
                      name={getSubfieldName(16, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.contributors.field.contributorTypeId`} />}
                      name={getSubfieldName(16, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.contributors.field.contributorTypeText`} />}
                      name={getSubfieldName(16, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={2}>
                    <BooleanActionField
                      label={<FormattedMessage id={`${translationPrefix}.instance.contributors.field.primary`} />}
                      name={getSubfieldName(16, index)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
      </Accordion>
    );
  };
  const renderDescriptiveData = () => {
    const publications = get(referenceTables, 'publication', []);
    const editions = get(referenceTables, 'editions', []);
    const physicalDescriptions = get(referenceTables, 'physicalDescriptions', []);
    const natureOfContentTermIds = get(referenceTables, 'natureOfContentTermIds', []);
    const instanceFormatIds = get(referenceTables, 'instanceFormatIds', []);
    const languages = get(referenceTables, 'languages', []);
    const publicationFrequency = get(referenceTables, 'publicationFrequency', []);
    const publicationRange = get(referenceTables, 'publicationRange', []);

    return (
      <Accordion
        id="descriptive-data"
        label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.section`} />}
        separator
      >
        <Row left="xs">
          <Col
            data-test-publications
            xs={12}
          >
            <RepeatableField
              fields={publications}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.publications.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.publications.legend`} />}
              canAdd={false}
              canDelete={false}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.publisher`} />}
                      name={getSubfieldName(17, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.role`} />}
                      name={getSubfieldName(17, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.place`} />}
                      name={getSubfieldName(17, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.dateOfPublication`} />}
                      name={getSubfieldName(17, index)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-editions
            xs={12}
          >
            <RepeatableField
              fields={editions}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.editions.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.editions.legend`} />}
              canAdd={false}
              canDelete={false}
              renderField={() => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.edition`} />}
                      name={getSubfieldName(18, 0)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-physical-descriptions
            xs={12}
          >
            <RepeatableField
              fields={physicalDescriptions}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.physicalDescriptions.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.physicalDescriptions.legend`} />}
              canAdd={false}
              canDelete={false}
              renderField={() => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.physicalDescription`} />}
                      name={getSubfieldName(19, 0)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-resource-type
            xs={12}
          >
            <Field
              component={TextField}
              label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.instanceTypeId`} />}
              name={getFieldName(20)}
              enabled={false}
              disabled
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-nature-of-content-terms
            xs={12}
          >
            <RepeatableField
              fields={natureOfContentTermIds}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.natureOfContentTermsIds.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.natureOfContentTermsIds.legend`} />}
              renderField={() => (
                <Row left="xs">
                  <Col
                    data-test-nature-of-content-term
                    xs={12}
                  >
                    <AcceptedValuesField
                      okapi={okapi}
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.natureOfContentTermId`} />}
                      name={getSubfieldName(21, 0)}
                      optionValue="name"
                      optionLabel="name"
                      wrapperLabel={`${translationPrefix}.wrapper.acceptedValues`}
                      wrapperSourceLink="/nature-of-content-terms?limit=1000&query=cql.allRecords=1 sortby name"
                      wrapperSourcePath="natureOfContentTerms"
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-formats
            xs={12}
          >
            <RepeatableField
              fields={instanceFormatIds}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.instanceFormatIds.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.instanceFormatIds.legend`} />}
              canAdd={false}
              canDelete={false}
              renderField={() => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.instanceFormatId`} />}
                      name={getSubfieldName(22, 0)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-languages
            xs={12}
          >
            <RepeatableField
              fields={languages}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.languages.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.languages.legend`} />}
              canAdd={false}
              canDelete={false}
              renderField={() => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.languageId`} />}
                      name={getSubfieldName(23, 0)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-publication-frequencies
            xs={12}
          >
            <RepeatableField
              fields={publicationFrequency}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.publicationFrequency.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.publicationFrequency.legend`} />}
              canAdd={false}
              canDelete={false}
              renderField={() => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.publicationFrequency`} />}
                      name={getSubfieldName(24, 0)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-publication-ranges
            xs={12}
          >
            <RepeatableField
              fields={publicationRange}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.publicationRange.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.publicationRange.legend`} />}
              canAdd={false}
              canDelete={false}
              renderField={() => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.publicationRange`} />}
                      name={getSubfieldName(25, 0)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
      </Accordion>
    );
  };
  const renderInstanceNotes = () => {
    const notes = get(referenceTables, 'notes', []);

    return (
      <Accordion
        id="instance-notes"
        label={<FormattedMessage id={`${translationPrefix}.instance.instanceNotes.section`} />}
        separator
      >
        <Row left="xs">
          <Col
            data-test-notes
            xs={12}
          >
            <RepeatableField
              fields={notes}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.field.notes.addLabel`} />}
              canAdd={false}
              canDelete={false}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={4}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.field.notes.noteType`} />}
                      name={getSubfieldName(26, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={4}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.field.notes.note`} />}
                      name={getSubfieldName(26, index)}
                      disabled
                    />
                  </Col>
                  <Col
                    data-test-staff-only
                    xs={4}
                  >
                    <BooleanActionField
                      label={<FormattedMessage id={`${translationPrefix}.field.notes.note`} />}
                      name={getSubfieldName(26, index)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
      </Accordion>
    );
  };
  const renderElectronicAccess = () => {
    const electronicAccess = get(referenceTables, 'electronicAccess', []);

    return (
      <Accordion
        id="instance-electronic-access"
        label={<FormattedMessage id={`${translationPrefix}.EAccess.section`} />}
        separator
      >
        <Row left="xs">
          <Col
            data-test-electronic-access
            xs={12}
          >
            <RepeatableField
              fields={electronicAccess}
              addLabel={<FormattedMessage id={`${translationPrefix}.field.EAccess.addLabel`} />}
              canAdd={false}
              canDelete={false}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col
                    data-test-relationship
                    xs={4}
                  >
                    <AcceptedValuesField
                      okapi={okapi}
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.EAccess.field.relationship`} />}
                      name={getSubfieldName(27, index)}
                      optionValue="name"
                      optionLabel="name"
                      wrapperLabel={`${translationPrefix}.wrapper.acceptedValues`}
                      wrapperSourceLink="/electronic-access-relationships?limit=1000&query=cql.allRecords=1 sortby name"
                      wrapperSourcePath="electronicAccessRelationships"
                      disabled
                    />
                  </Col>
                  <Col xs={4}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.EAccess.field.uri`} />}
                      name={getSubfieldName(27, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.EAccess.field.linkText`} />}
                      name={getSubfieldName(27, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.EAccess.field.materialsSpecified`} />}
                      name={getSubfieldName(27, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.EAccess.field.urlPublicNote`} />}
                      name={getSubfieldName(27, index)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
      </Accordion>
    );
  };
  const renderSubject = () => {
    const subjects = get(referenceTables, 'subjects', []);

    return (
      <Accordion
        id="subjects"
        label={<FormattedMessage id={`${translationPrefix}.instance.subject.section`} />}
        separator
      >
        <Row left="xs">
          <Col
            data-test-subjects
            xs={12}
          >
            <RepeatableField
              fields={subjects}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.subjects.addLabel`} />}
              canAdd={false}
              canDelete={false}
              renderField={() => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.subjects`} />}
                      name={getSubfieldName(28, 0)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
      </Accordion>
    );
  };
  const renderClassification = () => {
    const classifications = get(referenceTables, 'classifications', []);

    return (
      <Accordion
        id="classification"
        label={<FormattedMessage id={`${translationPrefix}.instance.classifications.section`} />}
        separator
      >
        <Row left="xs">
          <Col
            data-test-classifications
            xs={12}
          >
            <RepeatableField
              fields={classifications}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.classifications.addLabel`} />}
              canAdd={false}
              canDelete={false}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.classificationTypeId`} />}
                      name={getSubfieldName(29, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.classificationNumber`} />}
                      name={getSubfieldName(29, index)}
                      disabled
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
      </Accordion>
    );
  };
  const renderInstanceRelationship = () => {
    const parentInstances = get(referenceTables, 'parentInstances', []);
    const childInstances = get(referenceTables, 'childInstances', []);

    return (
      <Accordion
        id="instance-relationship"
        label={<FormattedMessage id={`${translationPrefix}.instance.relationship.section`} />}
        separator
      >
        <Row left="xs">
          <Col
            data-test-parent-instances
            xs={12}
          >
            <RepeatableField
              fields={parentInstances}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.field.parentInstances.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.instance.field.parentInstances.legend`} />}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.parentInstances.field.superInstanceId`} />}
                      name={getSubfieldName(30, index)}
                    />
                  </Col>
                  <Col
                    data-test-parent-type-of-relation
                    xs={6}
                  >
                    <AcceptedValuesField
                      okapi={okapi}
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.parentInstances.field.instnaceRelationshipTypeId`} />}
                      name={getSubfieldName(30, index)}
                      optionValue="name"
                      optionLabel="name"
                      wrapperLabel={`${translationPrefix}.wrapper.acceptedValues`}
                      wrapperSourceLink="/instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name"
                      wrapperSourcePath="instanceRelationshipTypes"
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-child-instances
            xs={12}
          >
            <RepeatableField
              fields={childInstances}
              addLabel={<FormattedMessage id={`${translationPrefix}.instance.field.childInstances.addLabel`} />}
              legend={<FormattedMessage id={`${translationPrefix}.instance.field.childInstances.legend`} />}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.childInstances.field.subInstanceId`} />}
                      name={getSubfieldName(31, index)}
                    />
                  </Col>
                  <Col
                    data-test-child-type-of-relation
                    xs={6}
                  >
                    <AcceptedValuesField
                      okapi={okapi}
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.childInstances.field.instnaceRelationshipTypeId`} />}
                      name={getSubfieldName(31, index)}
                      optionValue="name"
                      optionLabel="name"
                      wrapperLabel={`${translationPrefix}.wrapper.acceptedValues`}
                      wrapperSourceLink="/instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name"
                      wrapperSourcePath="instanceRelationshipTypes"
                    />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row>
      </Accordion>
    );
  };
  const renderRelatedInstances = () => (
    <Accordion
      id="related-instances"
      label={<FormattedMessage id={`${translationPrefix}.item.relatedInstances.section`} />}
      separator
    />
  );

  return (
    <AccordionSet>
      {renderAdminData()}
      {renderTitleData()}
      {renderIdentifier()}
      {renderContributor()}
      {renderDescriptiveData()}
      {renderInstanceNotes()}
      {renderElectronicAccess()}
      {renderSubject()}
      {renderClassification()}
      {renderInstanceRelationship()}
      {renderRelatedInstances()}
    </AccordionSet>
  );
};
