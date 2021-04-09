import React, {
  memo,
  useEffect,
  useState,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  ButtonGroup,
  Button,
  Select,
} from '@folio/stripes/components';

import {
  THEMES,
  themes,
  CodeHighlight,
} from '../CodeHighlight';
import { LANGUAGES } from '../CodeHighlight/Languages';

import { LOG_VIEWER } from '../../utils';

import css from './LogViewer.css';

const { FILTER: { OPTIONS } } = LOG_VIEWER;

const filterOptions = [
  {
    id: OPTIONS.SRS_MARC_BIB,
    caption: 'ui-data-import.logViewer.filter.srsMARCBib',
  }, {
    id: OPTIONS.INSTANCE,
    caption: 'ui-data-import.logViewer.filter.instance',
  }, {
    id: OPTIONS.HOLDINGS,
    caption: 'ui-data-import.logViewer.filter.holdings',
  }, {
    id: OPTIONS.ITEM,
    caption: 'ui-data-import.logViewer.filter.item',
  }, {
    id: OPTIONS.ORDER,
    caption: 'ui-data-import.logViewer.filter.order',
    disabled: true,
  }, {
    id: OPTIONS.INVOICE,
    caption: 'ui-data-import.logViewer.filter.invoice',
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

export const LogViewer = memo(({
  logs = {},
  language = LANGUAGES.RAW,
  theme = THEMES.COY,
  errorDetector,
  toolbar: {
    visible = true,
    message = '',
    showThemes = true,
    activeFilter = OPTIONS.SRS_MARC_BIB,
  } = {},
}) => {
  const { formatMessage } = useIntl();

  const [currentFilter, setCurrentFilter] = useState(activeFilter);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentFilter(activeFilter);
  }, [activeFilter]);

  const noRecord = logs[currentFilter].every(item => isEmpty(item.logs));
  const hasError = !!errorDetector(currentFilter);
  const themeModule = themes[currentTheme];

  const getCodeString = item => (
    !noRecord
      ? JSON.stringify(item, null, 2)
      : formatMessage({ id: 'ui-data-import.noRecord' })
  );

  const renderCodeHighlight = (id, codeString, className) => (
    codeString && (
      <CodeHighlight
        key={`snippet-${id}`}
        code={codeString}
        language={language}
        theme={currentTheme}
        className={className}
      />
    )
  );

  return (
    <>
      {visible && (
        <div className={css.toolbar}>
          <div className={css.header}>{message}</div>
          <div className={css.filter}>
            <span className={css.filter__label}>
              <FormattedMessage id="ui-data-import.logViewer.filter.label" />:
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
                  disabled={option.disabled}
                >
                  <FormattedMessage id={option.caption}>
                    {label => (errorDetector(option.id) ? `${label}*` : label)}
                  </FormattedMessage>
                </Button>
              ))}
            </ButtonGroup>
          </div>
          {showThemes && (
            <div className={css.themes}>
              <span className={css.themes__label}>
                <FormattedMessage id="ui-data-import.logViewer.themes.label" />:
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
        <>
          {logs[currentFilter].map(item => {
            const code = item.logs || '';
            const codePortion = Array.isArray(code) ? code : [code];

            return codePortion.map(portion => {
              const codeString = getCodeString(portion);
              const dataId = portion.id;

              return (
                <>
                  {item.label}
                  {hasError && renderCodeHighlight(item.errorBlockId || 'error', item.errorDetector, themeModule.error)}
                  {renderCodeHighlight(dataId, codeString, themeModule.info)}
                </>
              );
            });
          })}
        </>
      </pre>
    </>
  );
});

LogViewer.propTypes = {
  errorDetector: PropTypes.func.isRequired,
  logs: PropTypes.object,
  language: PropTypes.string,
  theme: PropTypes.string,
  toolbar: PropTypes.shape({
    visible: PropTypes.bool,
    message: PropTypes.node,
    showThemes: PropTypes.bool,
  }),
};
