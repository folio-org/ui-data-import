import React, {
  memo,
  useState,
  Fragment,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  ButtonGroup,
  Button,
  Select,
} from '@folio/stripes/components';

import { LOG_COLORIZER } from '../../utils/constants';
import { CodeHighlight } from './CodeHighlight';
import { LANGUAGES } from './Languages';
import {
  THEMES,
  themes,
} from './Themes';

import css from './LogColorizer.css';

const { FILTER: { OPTIONS } } = LOG_COLORIZER;

const filterOptions = [
  {
    id: OPTIONS.ALL,
    caption: 'ui-data-import.logColorizer.filter.all',
  }, {
    id: OPTIONS.INFO,
    caption: 'ui-data-import.logColorizer.filter.info',
  }, {
    id: OPTIONS.ERRORS,
    caption: 'ui-data-import.logColorizer.filter.errors',
  },
];
const themesPresent = [
  {
    id: 'coy',
    caption: 'Coy',
  }, {
    id: 'stalker',
    caption: 'Stalker',
  },
];

export const LogColorizer = memo(props => {
  const {
    code,
    language,
    theme,
    errorDetector,
    toolbar: {
      visible,
      message,
      showThemes,
    },
  } = props;

  const [currentFilter, setCurrentFilter] = useState(OPTIONS.ALL);
  const [currentTheme, setCurrentTheme] = useState(theme);

  const codePortion = Array.isArray(code) ? code : [code];
  const themeModule = themes[currentTheme];

  const recordsCount = codePortion.length;
  const errorsCount = codePortion.filter(item => errorDetector(item)).length;

  const entries = (
    <span className={css.header__entries}>
      <FormattedMessage
        id="ui-data-import.recordsCount"
        values={{ count: recordsCount }}
      />
    </span>
  );
  const errors = (
    <span>
      &#40;
      <span className={css.header__errors}>
        <FormattedMessage
          id="ui-data-import.errorsCount"
          values={{ count: errorsCount }}
        />
      </span>
      &#41;
    </span>
  );

  return (
    <Fragment>
      {visible && (
        <div className={css.toolbar}>
          <div className={css.header}>{message}&nbsp;{entries}&nbsp;{(errorsCount > 0) && errors}</div>
          <div className={css.filter}>
            <span className={css.filter__label}>
              <FormattedMessage id="ui-data-import.logColorizer.filter.label" />:
            </span>
            <ButtonGroup
              data-test-logs-filter
              fullWidth
              role="tablist"
            >
              {filterOptions.map(option => (
                <Button
                  role="tab"
                  aria-selected={currentFilter === option.id}
                  id={`option-${option.id}`}
                  key={`option-${option.id}`}
                  buttonStyle={currentFilter === option.id ? 'primary' : 'default'}
                  className={css.filter__button}
                  data-test-logs-filter-option={option.id}
                  marginBottom0
                  onClick={() => setCurrentFilter(option.id)}
                >
                  <FormattedMessage id={option.caption} />
                </Button>
              ))}
            </ButtonGroup>
          </div>
          {showThemes && (
            <div className={css.themes}>
              <span className={css.themes__label}>
                <FormattedMessage id="ui-data-import.logColorizer.themes.label" />:
              </span>
              <Select
                onChange={e => setCurrentTheme(e.target.value)}
                value={currentTheme}
                marginBottom0
              >
                {themesPresent.map(item => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.caption}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      )}
      <pre
        id="logs-pane"
        className={currentTheme}
      >
        {codePortion.map(item => {
          const codeString = JSON.stringify(item, null, 2);
          const hasError = errorDetector(item);
          const showErrors = hasError && OPTIONS.ERRORS === currentFilter;
          const showInfo = !hasError && OPTIONS.INFO === currentFilter;
          const showAll = OPTIONS.ALL === currentFilter;

          return (showAll || showErrors || showInfo) && (
            <CodeHighlight
              key={`snippet-${item.id}`}
              code={codeString}
              language={language}
              theme={currentTheme}
              className={hasError ? themeModule.error : themeModule.info}
            />
          );
        })}
      </pre>
    </Fragment>
  );
});

LogColorizer.propTypes = {
  code: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  language: PropTypes.string,
  theme: PropTypes.string,
  errorDetector: PropTypes.func.isRequired,
  toolbar: PropTypes.shape({
    visible: PropTypes.bool,
    message: PropTypes.any,
    showThemes: PropTypes.bool,
  }),
};

LogColorizer.defaultProps = {
  code: '',
  language: LANGUAGES.RAW,
  theme: THEMES.COY,
  toolbar: {
    visible: true,
    message: '',
    showThemes: true,
  },
};
