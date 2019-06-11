import React, { memo } from 'react';
import PropTypes from 'prop-types';

import * as Languages from './Languages';
import * as Themes from './Themes';

const { LANGUAGES } = Languages;
const {
  THEMES,
  themes,
} = Themes;

const markup = val => {
  return { __html: val };
};

export const CodeHighlight = memo(props => {
  const {
    code,
    language,
    theme,
    usePre,
    className,
  } = props;

  const hlTheme = themes[theme];

  if (usePre) {
    return (
      <pre className={theme}>
        <code
          className={className}
          dangerouslySetInnerHTML={markup(Languages[language](code, hlTheme))}
        />
      </pre>
    );
  }

  return (
    <code
      className={className}
      dangerouslySetInnerHTML={markup(Languages[language](code, hlTheme))}
    />
  );
});

CodeHighlight.propTypes = {
  code: PropTypes.any,
  language: PropTypes.string,
  theme: PropTypes.string,
  usePre: PropTypes.bool,
  className: PropTypes.string,
};

CodeHighlight.defaultProps = {
  code: '',
  language: LANGUAGES.RAW,
  theme: THEMES.STALKER,
  usePre: false,
  className: '',
};
