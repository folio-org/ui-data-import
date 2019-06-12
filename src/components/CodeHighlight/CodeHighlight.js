import React, { memo } from 'react';
import PropTypes from 'prop-types';

import * as Languages from './Languages';
import * as Themes from './Themes';

const { LANGUAGES } = Languages;
const {
  THEMES,
  themes,
} = Themes;

const markup = val => ({ __html: val });

export const CodeHighlight = memo(props => {
  const {
    code,
    language,
    theme,
    usePre,
    className,
  } = props;

  const themeModule = themes[theme];
  const codeBlock = (
    <code
      className={className}
      dangerouslySetInnerHTML={markup(Languages[language](code, themeModule))}
    />
  );

  if (usePre) {
    return (
      <pre className={theme}>
        {codeBlock}
      </pre>
    );
  }

  return codeBlock;
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
