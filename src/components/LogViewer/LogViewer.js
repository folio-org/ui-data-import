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

  const noRecord = isEmpty(logs[currentFilter]);
  const hasError = !!errorDetector(currentFilter);
  const hasInvoiceError = !!errorDetector(currentFilter)?.invoiceInfo;
  const hasInvoiceLineError = !!errorDetector(currentFilter)?.invoiceLineInfo;
  const code = logs[currentFilter] || '';
  const codePortion = Array.isArray(code) ? code : [code];
  const themeModule = themes[currentTheme];
  const isEdifactType = currentFilter === OPTIONS.INVOICE;

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
        {isEdifactType ? (
          <>
            <FormattedMessage id="ui-data-import.logViewer.invoiceLine">
              {title => <strong className={css.codeBlockTitle}>{title}:</strong>}
            </FormattedMessage>
            {hasInvoiceLineError && renderCodeHighlight('invoice-line-error', errorDetector(currentFilter).invoiceLineInfo, themeModule.error)}
            {codePortion.map(item => {
              const invoiceLineCodeString = getCodeString(item.invoiceLineData);
              const invoiceLineDataId = `invoiceLine-${item?.invoiceLineData?.id}`;

              return renderCodeHighlight(invoiceLineDataId, invoiceLineCodeString, themeModule.info);
            })}
            <FormattedMessage id="ui-data-import.logViewer.invoice">
              {title => <strong className={css.codeBlockTitle}>{title}:</strong>}
            </FormattedMessage>
            {hasInvoiceError && renderCodeHighlight('invoice-error', errorDetector(currentFilter).invoiceInfo, themeModule.error)}
            {codePortion.map(item => {
              const invoiceCodeString = getCodeString(item.invoiceData);
              const invoiceDataId = `invoice-${item?.invoiceData?.id}`;

              return renderCodeHighlight(invoiceDataId, invoiceCodeString, themeModule.info);
            })}
          </>
        ) : (
          <>
            {hasError && renderCodeHighlight('error', errorDetector(currentFilter), themeModule.error)}
            {codePortion.map(item => {
              const codeString = getCodeString(item);
              const dataId = item.id;

              return renderCodeHighlight(dataId, codeString, themeModule.info);
            })}
          </>
        )}
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
