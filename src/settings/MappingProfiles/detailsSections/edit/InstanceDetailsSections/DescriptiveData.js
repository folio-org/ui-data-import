import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { noop } from 'lodash';

import {
  Accordion,
  Row,
  Col,
  RepeatableField,
  TextField,
} from '@folio/stripes/components';

import {
  AcceptedValuesField,
  RepeatableActionsField,
} from '../../../../../components';

import {
  onAdd,
  onRemove,
  getSubfieldName,
  getFieldName,
} from '../utils';
import { TRANSLATION_ID_PREFIX } from '../constants';

export const DescriptiveData = ({
  publications,
  editions,
  physicalDescriptions,
  natureOfContentTermIds,
  languages,
  instanceFormatIds,
  publicationFrequency,
  publicationRange,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  return (
    <Accordion
      id="descriptive-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-publications
          xs={12}
        >
          <RepeatableField
            fields={publications}
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.publications.addLabel`} />}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.publications.legend`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col xs={3}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.publisher`} />}
                    name={getSubfieldName(17, 0, index)}
                    disabled
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.role`} />}
                    name={getSubfieldName(17, 1, index)}
                    disabled
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.place`} />}
                    name={getSubfieldName(17, 2, index)}
                    disabled
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.dateOfPublication`} />}
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
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.editions.addLabel`} />}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.editions.legend`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col xs={12}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.edition`} />}
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
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.physicalDescriptions.addLabel`} />}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.physicalDescriptions.legend`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col xs={12}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.physicalDescription`} />}
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
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.instanceTypeId`} />}
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
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.natureOfContentTermsIds.legend`} />}
          >
            <RepeatableField
              fields={natureOfContentTermIds}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.natureOfContentTermsIds.addLabel`} />}
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
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.natureOfContentTermId`} />}
                      name={getSubfieldName(21, 0, index)}
                      optionValue="name"
                      optionLabel="name"
                      wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
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
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.instanceFormatIds.addLabel`} />}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.instanceFormatIds.legend`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col xs={12}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.instanceFormatId`} />}
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
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.languages.addLabel`} />}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.languages.legend`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col xs={12}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.languageId`} />}
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
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.publicationFrequency.addLabel`} />}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.publicationFrequency.legend`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col xs={12}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.publicationFrequency`} />}
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
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.publicationRange.addLabel`} />}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.publicationRange.legend`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col xs={12}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.publicationRange`} />}
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

DescriptiveData.propTypes = {
  publications: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])).isRequired,
  editions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])).isRequired,
  physicalDescriptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])).isRequired,
  natureOfContentTermIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])).isRequired,
  languages: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])).isRequired,
  instanceFormatIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])).isRequired,
  publicationFrequency: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])).isRequired,
  publicationRange: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.object.isRequired,
};
