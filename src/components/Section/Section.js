import React, {
  memo,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  isEmpty, pickBy,
} from 'lodash';

import {
  Checkbox,
  Headline,
} from '@folio/stripes/components';

import css from './Section.css';

export const Section = memo(({
  label,
  optional,
  isOpen,
  className,
  children,
  ...rest
}) => {
  const [isChecked, setChecked] = useState(isOpen);

  useEffect(() => {
    setChecked(isOpen);
  }, [isOpen]);

  const getDataAttributes = attrs => pickBy(attrs, (_, key) => key.startsWith('data-test-'));

  // eslint-disable-next-line react/prop-types
  const headline = ({ styles = '' }) => {
    if (!label) {
      return '';
    }

    return (
      <Headline
        size="large"
        margin="none"
        tag="h3"
        className={styles}
      >
        {label}
      </Headline>
    );
  };

  const optionalHeadline = () => {
    if (!label) {
      return '';
    }

    return (
      <Checkbox
        fullWidth
        label={headline({})}
        className={css.label}
        checked={isChecked}
        onChange={() => setChecked(!isChecked)}
      />
    );
  };

  return (
    <section
      className={`${css.container} ${className}`}
      {...getDataAttributes(rest)}
    >
      {optional ? optionalHeadline() : headline({ styles: css.label })}
      {isChecked && !isEmpty(children) && (<div className={`${css.content} ${label ? '' : css['no-label']}`}>{children}</div>)}
    </section>
  );
});

Section.propTypes = {
  label: PropTypes.node,
  optional: PropTypes.bool,
  isOpen: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.node),
};

Section.defaultProps = {
  label: null,
  optional: false,
  isOpen: true,
  children: [],
};
