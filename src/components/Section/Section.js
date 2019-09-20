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
  id,
  children,
}) => {
  const [isChecked, setChecked] = useState(true);

  const headline = (
    <Headline
      size="1.17rem"
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
      id={id}
      checked={isChecked}
      onChange={() => setChecked(!isChecked)}
    />
  );

  return (
    <div className={css.container}>
      {isOptional ? optionalHeadline : headline}
      {isChecked && children}
    </div>
  );
});

Section.propTypes = {
  headerCaption: PropTypes.node.isRequired,
  isOptional: PropTypes.bool,
  id: PropTypes.string,
  children: PropTypes.node,
};
