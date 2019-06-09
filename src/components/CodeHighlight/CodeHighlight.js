import React, {
  memo,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';

import * as Languages from './Languages';
import * as Themes from './Themes';

import './code-highlight.css';

const { LANGUAGES } = Languages;
const { THEMES } = Themes;

export const CodeHighlight = memo(props => {
  const {
    code,
    language,
    theme,
    toolbar,
  } = props;
  const renderer = Languages[language];

  const markup = val => {
    return { __html: val };
  };

  const codePortion = Array.isArray(code) ? code : [code];

  return (
    <Fragment>
      {toolbar.visible && <div className="highlight-toolbar">Toolbar is here:</div>}
      <pre className={`highlight ${theme}`}>
        {codePortion.map((item, i) => {
          const codeString = JSON.stringify(item, null, 2);

          return (
            <code
              key={`snippet-${i}`}
              className={codeString.contains('error') ? 'error' : ''}
              dangerouslySetInnerHTML={markup(renderer(codeString))}
            />
          );
        })}
      </pre>
    </Fragment>
  );
});

CodeHighlight.propTypes = {
  code: PropTypes.any,
  language: PropTypes.string,
  theme: PropTypes.string,
  toolbar: PropTypes.shape({ visible: PropTypes.bool }),
};

CodeHighlight.defaultProps = {
  code: '',
  language: LANGUAGES.RAW,
  theme: THEMES.COY,
  toolbar: { visible: true },
};
