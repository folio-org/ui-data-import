import React, {
  useEffect,
  useState,
  memo,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useIntl } from 'react-intl';

import {
  Row,
  Col,
  NoValue,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';
import { getFieldMatchedWithCategory } from '@folio/stripes-data-transfer-components/lib/utils';

import { Section } from '../../..';

import {
  fieldsConfig,
  getIdentifierTypes,
  fieldCategoriesConfig,
} from '../../../../utils';

import css from '../ViewMatchCriterion.css';

const ExistingSectionFolio = memo(({
  existingRecordFields,
  existingRecordType,
  existingRecordFieldLabel,
  stripes,
}) => {
  const { formatMessage } = useIntl();
  const [identifierTypes, setIdentifierTypes] = useState([]);

  useEffect(() => {
    const { okapi } = stripes;
    getIdentifierTypes(okapi).then((data) => setIdentifierTypes(data));
  }, [stripes]);

  return (
    <Section
      label={existingRecordFieldLabel}
      className={classnames(css.field, css.inputContainer)}
    >
      <Row>
        <Col
          xs={12}
          className={css.fieldValue}
        >
          {
            getFieldMatchedWithCategory({
              fields: existingRecordFields,
              recordType: existingRecordType,
              formatMessage,
              resources: identifierTypes,
              fieldCategoriesConfig,
              fieldsConfig,
            }) || <NoValue />
          }
        </Col>
      </Row>
    </Section>
  );
});

ExistingSectionFolio.propTypes = {
  existingRecordFields: PropTypes.arrayOf(PropTypes.object),
  existingRecordType: PropTypes.oneOf(Object.keys(FOLIO_RECORD_TYPES)),
  existingRecordFieldLabel: PropTypes.node,
  stripes: PropTypes.object.isRequired,
};

ExistingSectionFolio.defaultProps = {
  existingRecordFields: [],
  existingRecordType: null,
  existingRecordFieldLabel: null,
};

export default stripesConnect(ExistingSectionFolio);
