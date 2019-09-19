import React, {
  memo,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import css from './Section.css';

export const Section = memo(({
  headerCaption,
  isOptional,
  sectionId,
  children,
}) => {
  const [isChecked, setChecked] = useState(true);

  const optionalHeader = caption => {
    return (
      <div>
        <label
          className={css.heading}
          htmlFor={sectionId}
        >
          <input
            className={css.optionalCheckbox}
            id={sectionId}
            type="checkbox"
            checked={isChecked}
            onChange={() => setChecked(!isChecked)}
          />
          {caption}
        </label>
      </div>
    );
  };

  const renderHeader = caption => {
    return (
      <header>
        {isOptional
          ? optionalHeader(caption)
          : (<h3 className={css.heading}>{caption}</h3>)
        }
      </header>
    );
  };

  return (
    <div className={css.container}>
      {renderHeader(headerCaption)}
      {isChecked && children}
    </div>
  );
});

Section.propTypes = {
  headerCaption: PropTypes.string.isRequired,
  isOptional: PropTypes.bool,
  sectionId: PropTypes.string,
  children: PropTypes.node,
};
