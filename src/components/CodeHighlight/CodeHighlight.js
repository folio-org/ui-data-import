import React, { memo } from 'react';
import PropTypes from 'prop-types';

import * as Languages from './Languages';
import {
  THEMES,
  themes,
} from './Themes';

const { LANGUAGES } = Languages;

const markup = val => ({ __html: val });

export const CodeHighlight = memo(({
  code = '',
  language = LANGUAGES.RAW,
  theme = THEMES.COY,
  usePre = false,
  className,
}) => {
  const themeModule = themes[theme];
  const codeBlock = (
    <code
      className={className}
      dangerouslySetInnerHTML={markup(Languages[language](code, themeModule))} // eslint-disable-line react/no-danger
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
  code: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  language: PropTypes.string,
  theme: PropTypes.string,
  usePre: PropTypes.bool,
  className: PropTypes.string,
};
