import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import {
  get,
  noop,
} from 'lodash';

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
  onAdd,
  onRemove,
} from './utils';
import {
  AcceptedValuesField,
  DatePickerDecorator,
  RepeatableActionsField,
  BooleanActionField,
} from '../../../../components';

export const MappingInstanceDetails = ({
  initialFields,
  referenceTables,
  setReferenceTables,
  okapi,
  intl,
}) => {
  const translationPrefix = 'ui-data-import.settings.mappingProfiles.map';
  const fieldNamePrefix = 'profile.mappingDetails.mappingFields';

  const getFieldName = mappingFieldIndex => {
    return `${fieldNamePrefix}[${mappingFieldIndex}].value`;
  };
  const getBoolFieldName = mappingFieldIndex => {
    return `${fieldNamePrefix}[${mappingFieldIndex}].booleanFieldAction`;
  };
  const getSubfieldName = (mappingFieldIndex, fieldIndex, subfieldIndex) => {
    return `${fieldNamePrefix}[${mappingFieldIndex}].subfields[${subfieldIndex}].fields[${fieldIndex}].value`;
  };
  const getBoolSubfieldName = (mappingFieldIndex, fieldIndex, subfieldIndex) => {
    return `${fieldNamePrefix}[${mappingFieldIndex}].subfields[${subfieldIndex}].fields[${fieldIndex}].booleanFieldAction`;
  };

  const renderAdminData = () => {
    const statisticalCodes = get(referenceTables, 'statisticalCodeIds', []);

    return (
      <Accordion
        id="administrative-data"
        label={<FormattedMessage id={`${translationPrefix}.administrativeData.section`} />}
      >
        <Row left="xs">
          <Col
            data-test-suppress-from-discovery
            xs={4}
          >
            <BooleanActionField
              label={<FormattedMessage id={`${translationPrefix}.administrativeData.field.discoverySuppress`} />}
              name={getBoolFieldName(0)}
            />
          </Col>
          <Col
            data-test-staff-suppress
            xs={4}
          >
            <BooleanActionField
              label={<FormattedMessage id={`${translationPrefix}.administrativeData.field.staffSuppress`} />}
              name={getBoolFieldName(1)}
            />
          </Col>
          <Col
            data-test-previously-held
            xs={4}
          >
            <BooleanActionField
              label={<FormattedMessage id={`${translationPrefix}.administrativeData.field.previouslyHeld`} />}
              name={getBoolFieldName(2)}
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
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-cataloged-date
            xs={6}
          >
            <Field
              component={DatePickerDecorator}
              label={<FormattedMessage id={`${translationPrefix}.instance.administrationData.field.catalogedDate`} />}
              name={getFieldName(5)}
              wrappedComponent={TextField}
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
              disabled
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-statistical-codes
            xs={12}
          >
            <RepeatableActionsField
              wrapperFieldName={getFieldName(8)}
              legend={<FormattedMessage id={`${translationPrefix}.administrativeData.field.statisticalCodes.legend`} />}
            >
              <RepeatableField
                fields={statisticalCodes}
                addLabel={<FormattedMessage id={`${translationPrefix}.administrativeData.field.statisticalCodes.addLabel`} />}
                onAdd={() => onAdd(statisticalCodes, 'statisticalCodeIds', 8, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, statisticalCodes, 8, setReferenceTables, 'order')}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col
                      data-test-statistical-code
                      xs={12}
                    >
                      <AcceptedValuesField
                        okapi={okapi}
                        component={TextField}
                        name={getSubfieldName(8, 0, index)}
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
            </RepeatableActionsField>
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col
                    data-test-alternative-title-type
                    xs={6}
                  >
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.alternativeTitles.field.alternativeTitleTypeId`} />}
                      name={getSubfieldName(10, 0, index)}
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
                      name={getSubfieldName(10, 1, index)}
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.series.field.series`} />}
                      name={getSubfieldName(12, 0, index)}
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
            <RepeatableActionsField
              wrapperFieldName={getFieldName(13)}
              legend={<FormattedMessage id={`${translationPrefix}.titleData.field.precedingTitles.legend`} />}
              disabled
            >
              <RepeatableField
                fields={precedingTitles}
                addLabel={<FormattedMessage id={`${translationPrefix}.titleData.field.precedingTitles.addLabel`} />}
                canAdd={false}
                canRemove={false}
                onAdd={noop}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={3}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${translationPrefix}.titleData.precedingTitles.field.precedingTitlesTitle`} />}
                        name={getSubfieldName(13, 0, index)}
                        disabled
                      />
                    </Col>
                    <Col xs={3}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${translationPrefix}.titleData.precedingTitles.field.precedingTitlesHrid`} />}
                        name={getSubfieldName(13, 1, index)}
                        disabled
                      />
                    </Col>
                    <Col xs={3}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${translationPrefix}.titleData.precedingTitles.field.precedingTitlesIsbn`} />}
                        name={getSubfieldName(13, 2, index)}
                        disabled
                      />
                    </Col>
                    <Col xs={3}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${translationPrefix}.titleData.precedingTitles.field.precedingTitlesIssn`} />}
                        name={getSubfieldName(13, 3, index)}
                        disabled
                      />
                    </Col>
                  </Row>
                )}
              />
            </RepeatableActionsField>
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-succeeding-titles
            xs={12}
          >
            <RepeatableActionsField
              wrapperFieldName={getFieldName(14)}
              legend={<FormattedMessage id={`${translationPrefix}.titleData.field.succeedingTitles.legend`} />}
              disabled
            >
              <RepeatableField
                fields={succeedingTitles}
                addLabel={<FormattedMessage id={`${translationPrefix}.titleData.field.succeedingTitles.addLabel`} />}
                canAdd={false}
                canRemove={false}
                onAdd={noop}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={3}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${translationPrefix}.titleData.succeedingTitles.field.succeedingTitlesTitle`} />}
                        name={getSubfieldName(14, 0, index)}
                        disabled
                      />
                    </Col>
                    <Col xs={3}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${translationPrefix}.titleData.succeedingTitles.field.succeedingTitlesHrid`} />}
                        name={getSubfieldName(14, 1, index)}
                        disabled
                      />
                    </Col>
                    <Col xs={3}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${translationPrefix}.titleData.succeedingTitles.field.succeedingTitlesIsbn`} />}
                        name={getSubfieldName(14, 2, index)}
                        disabled
                      />
                    </Col>
                    <Col xs={3}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${translationPrefix}.titleData.succeedingTitles.field.succeedingTitlesIssn`} />}
                        name={getSubfieldName(14, 3, index)}
                        disabled
                      />
                    </Col>
                  </Row>
                )}
              />
            </RepeatableActionsField>
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.identifiers.field.identifierTypeId`} />}
                      name={getSubfieldName(15, 0, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.titleData.identifiers.field.value`} />}
                      name={getSubfieldName(15, 1, index)}
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.contributors.field.contributorName`} />}
                      name={getSubfieldName(16, 0, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.contributors.field.contributorNameTypeId`} />}
                      name={getSubfieldName(16, 1, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.contributors.field.contributorTypeId`} />}
                      name={getSubfieldName(16, 2, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.contributors.field.contributorTypeText`} />}
                      name={getSubfieldName(16, 3, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={2}>
                    <BooleanActionField
                      label={<FormattedMessage id={`${translationPrefix}.instance.contributors.field.primary`} />}
                      name={getBoolSubfieldName(16, 4, index)}
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.publisher`} />}
                      name={getSubfieldName(17, 0, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.role`} />}
                      name={getSubfieldName(17, 1, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.place`} />}
                      name={getSubfieldName(17, 2, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.dateOfPublication`} />}
                      name={getSubfieldName(17, 3, index)}
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.edition`} />}
                      name={getSubfieldName(18, 0, index)}
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.physicalDescription`} />}
                      name={getSubfieldName(19, 0, index)}
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
              disabled
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-nature-of-content-terms
            xs={12}
          >
            <RepeatableActionsField
              wrapperFieldName={getFieldName(21)}
              legend={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.natureOfContentTermsIds.legend`} />}
            >
              <RepeatableField
                fields={natureOfContentTermIds}
                addLabel={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.natureOfContentTermsIds.addLabel`} />}
                onAdd={() => onAdd(natureOfContentTermIds, 'natureOfContentTermIds', 21, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, natureOfContentTermIds, 21, setReferenceTables, 'order')}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col
                      data-test-nature-of-content-term
                      xs={12}
                    >
                      <AcceptedValuesField
                        okapi={okapi}
                        component={TextField}
                        label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.natureOfContentTermId`} />}
                        name={getSubfieldName(21, 0, index)}
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
            </RepeatableActionsField>
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.instanceFormatId`} />}
                      name={getSubfieldName(22, 0, index)}
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.languageId`} />}
                      name={getSubfieldName(23, 0, index)}
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.publicationFrequency`} />}
                      name={getSubfieldName(24, 0, index)}
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.publicationRange`} />}
                      name={getSubfieldName(25, 0, index)}
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={4}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.field.notes.noteType`} />}
                      name={getSubfieldName(26, 0, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={4}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.field.notes.note`} />}
                      name={getSubfieldName(26, 1, index)}
                      disabled
                    />
                  </Col>
                  <Col
                    data-test-staff-only
                    xs={4}
                  >
                    <BooleanActionField
                      label={<FormattedMessage id={`${translationPrefix}.field.notes.note`} />}
                      name={getBoolSubfieldName(26, 2, index)}
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
              canRemove={false}
              onAdd={noop}
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
                      name={getSubfieldName(27, 0, index)}
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
                      name={getSubfieldName(27, 1, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.EAccess.field.linkText`} />}
                      name={getSubfieldName(27, 2, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.EAccess.field.materialsSpecified`} />}
                      name={getSubfieldName(27, 3, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.EAccess.field.urlPublicNote`} />}
                      name={getSubfieldName(27, 4, index)}
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.subjects`} />}
                      name={getSubfieldName(28, 0, index)}
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
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.classificationTypeId`} />}
                      name={getSubfieldName(29, 0, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${translationPrefix}.instance.descriptiveData.field.classificationNumber`} />}
                      name={getSubfieldName(29, 0, index)}
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
      >
        <Row left="xs">
          <Col
            data-test-parent-instances
            xs={12}
          >
            <RepeatableActionsField
              wrapperFieldName={getFieldName(30)}
              legend={<FormattedMessage id={`${translationPrefix}.instance.field.parentInstances.legend`} />}
            >
              <RepeatableField
                fields={parentInstances}
                addLabel={<FormattedMessage id={`${translationPrefix}.instance.field.parentInstances.addLabel`} />}
                onAdd={() => onAdd(parentInstances, 'parentInstances', 30, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, parentInstances, 30, setReferenceTables, 'order')}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={6}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${translationPrefix}.instance.parentInstances.field.superInstanceId`} />}
                        name={getSubfieldName(30, 0, index)}
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
                        name={getSubfieldName(30, 1, index)}
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
            </RepeatableActionsField>
          </Col>
        </Row>
        <Row left="xs">
          <Col
            data-test-child-instances
            xs={12}
          >
            <RepeatableActionsField
              wrapperFieldName={getFieldName(31)}
              legend={<FormattedMessage id={`${translationPrefix}.instance.field.childInstances.legend`} />}
            >
              <RepeatableField
                fields={childInstances}
                addLabel={<FormattedMessage id={`${translationPrefix}.instance.field.childInstances.addLabel`} />}
                onAdd={() => onAdd(childInstances, 'childInstances', 31, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, childInstances, 31, setReferenceTables, 'order')}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={6}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${translationPrefix}.instance.childInstances.field.subInstanceId`} />}
                        name={getSubfieldName(31, 0, index)}
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
                        name={getSubfieldName(31, 1, index)}
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
            </RepeatableActionsField>
          </Col>
        </Row>
      </Accordion>
    );
  };
  const renderRelatedInstances = () => {
    return (
      <Accordion
        id="related-instances"
        label={<FormattedMessage id={`${translationPrefix}.item.relatedInstances.section`} />}
      >
        <></>
      </Accordion>
    );
  };

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
