import React, {
  memo,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import {
  Checkbox,
  Headline,
} from '@folio/stripes/components';

import css from './Section.css';

export const Section = memo(({
  headerCaption,
  isOptional,
  children,
}) => {
  const [isChecked, setChecked] = useState(true);

  const headline = (
    <Headline
      size="large"
      margin="none"
      tag="h3"
    >
      {headerCaption}
    </Headline>
  );

  const optionalHeadline = (
    <Checkbox
      fullWidth
      label={headline}
      checked={isChecked}
      onChange={() => setChecked(!isChecked)}
    />
  );

  return (
    <section className={css.container}>
      {isOptional ? optionalHeadline : headline}
      {isChecked && children}
    </section>
  );
});

Section.propTypes = {
  headerCaption: PropTypes.node.isRequired,
  isOptional: PropTypes.bool,
  children: PropTypes.node,
};
