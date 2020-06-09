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

import { RepeatableActionsField } from '../../../../../components';

import {
  getFieldName,
  getSubfieldName,
} from '../utils';
import { TRANSLATION_ID_PREFIX } from '../constants';

export const TitleData = ({
  alternativeTitles,
  seriesStatements,
  precedingTitles,
  succeedingTitles,
}) => {
  return (
    <Accordion
      id="title-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.titleData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-resource-title
          xs={12}
        >
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.titleData.field.title`} />}
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
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.field.alternativeTitles.addLabel`} />}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.field.alternativeTitles.legend`} />}
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
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.alternativeTitles.field.alternativeTitleTypeId`} />}
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
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.alternativeTitles.field.alternativeTitle`} />}
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
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.titleData.field.indexTitle`} />}
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
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.field.series.addLabel`} />}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.field.series.legend`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col xs={12}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.series.field.series`} />}
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
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.field.precedingTitles.legend`} />}
            disabled
          >
            <RepeatableField
              fields={precedingTitles}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.field.precedingTitles.addLabel`} />}
              canAdd={false}
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.precedingTitles.field.precedingTitlesTitle`} />}
                      name={getSubfieldName(13, 0, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.precedingTitles.field.precedingTitlesHrid`} />}
                      name={getSubfieldName(13, 1, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.precedingTitles.field.precedingTitlesIsbn`} />}
                      name={getSubfieldName(13, 2, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.precedingTitles.field.precedingTitlesIssn`} />}
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
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.field.succeedingTitles.legend`} />}
            disabled
          >
            <RepeatableField
              fields={succeedingTitles}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.field.succeedingTitles.addLabel`} />}
              canAdd={false}
              canRemove={false}
              onAdd={noop}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.succeedingTitles.field.succeedingTitlesTitle`} />}
                      name={getSubfieldName(14, 0, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.succeedingTitles.field.succeedingTitlesHrid`} />}
                      name={getSubfieldName(14, 1, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.succeedingTitles.field.succeedingTitlesIsbn`} />}
                      name={getSubfieldName(14, 2, index)}
                      disabled
                    />
                  </Col>
                  <Col xs={3}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.succeedingTitles.field.succeedingTitlesIssn`} />}
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

TitleData.propTypes = {
  alternativeTitles: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])).isRequired,
  seriesStatements: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])).isRequired,
  precedingTitles: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])).isRequired,
  succeedingTitles: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])).isRequired,
};
