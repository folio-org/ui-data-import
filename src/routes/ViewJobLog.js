import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import { stripesConnect } from '@folio/stripes/core';
import { Headline } from '@folio/stripes/components';
import { Preloader } from '@folio/stripes-data-transfer-components';

import { LogViewer } from '../components/LogViewer';
import { LANGUAGES } from '../components/CodeHighlight/Languages';
import { THEMES } from '../components';

import {
  DATA_TYPES,
  LOG_VIEWER,
} from '../utils';

import sharedCss from '../shared.css';

const { FILTER: { OPTIONS } } = LOG_VIEWER;

@stripesConnect
export class ViewJobLog extends Component {
  static manifest = Object.freeze({
    jobLog: {
      type: 'okapi',
      throwsErrors: false,
      path: (_q, _p) => {
        const recordId = _q.instanceLineId || _p.recordId;

        return `metadata-provider/jobLogEntries/${_p.id}/records/${recordId}`;
      },
    },
    srsMarcBib: {
      type: 'okapi',
      path: 'source-storage/records/:{recordId}',
      throwsErrors: false,
    },
    instances: {
      type: 'okapi',
      path: 'inventory/instances',
      throwsErrors: false,
      accumulate: true,
    },
    holdings: {
      type: 'okapi',
      path: 'holdings-storage/holdings',
      throwsErrors: false,
      accumulate: true,
    },
    items: {
      type: 'okapi',
      path: 'inventory/items',
      throwsErrors: false,
      accumulate: true,
    },
    invoice: {
      type: 'okapi',
      path: 'invoice-storage/invoices',
      throwsErrors: false,
      accumulate: true,
    },
    invoiceLine: {
      type: 'okapi',
      path: 'invoice-storage/invoice-lines',
      throwsErrors: false,
      accumulate: true,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      jobLog: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
      }),
      srsMarcBib: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
      }),
      instances: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
      }),
      holdings: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
      }),
      items: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
      }),
      invoice: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
      }),
      invoiceLine: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      instances: PropTypes.shape({ GET: PropTypes.func.isRequired }).isRequired,
      holdings: PropTypes.shape({ GET: PropTypes.func.isRequired }).isRequired,
      items: PropTypes.shape({ GET: PropTypes.func.isRequired }).isRequired,
      invoice: PropTypes.shape({ GET: PropTypes.func.isRequired }).isRequired,
      invoiceLine: PropTypes.shape({ GET: PropTypes.func.isRequired }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    document.querySelector('header').setAttribute('style', 'display: none');
  }

  componentDidUpdate(prevProps) {
    const jobLogPrevResources = prevProps.resources.jobLog;
    const jobLogCurrentResources = this.props.resources.jobLog;

    if (jobLogPrevResources.hasLoaded !== jobLogCurrentResources.hasLoaded
      && (jobLogCurrentResources.hasLoaded === true)) {
      this.fetchInstancesData();
      this.fetchHoldingsData();
      this.fetchItemsData();
      this.fetchInvoiceData();
      this.fetchInvoiceLineData();
    }
  }

  fetchInstancesData() {
    const instanceIds = this.props.resources.jobLog.records[0]?.relatedInstanceInfo.idList || [];

    instanceIds.forEach(instanceId => {
      this.props.mutator.instances.GET({ path: `inventory/instances/${instanceId}` });
    });
  }

  fetchHoldingsData() {
    const holdingsIds = this.props.resources.jobLog.records[0]?.relatedHoldingsInfo.idList || [];

    holdingsIds.forEach(holdingsId => {
      this.props.mutator.holdings.GET({ path: `holdings-storage/holdings/${holdingsId}` });
    });
  }

  fetchItemsData() {
    const itemIds = this.props.resources.jobLog.records[0]?.relatedItemInfo.idList || [];

    itemIds.forEach(itemId => {
      this.props.mutator.items.GET({ path: `inventory/items/${itemId}` });
    });
  }

  fetchInvoiceData() {
    const invoiceIds = this.props.resources.jobLog.records[0]?.relatedInvoiceInfo.idList || [];

    invoiceIds.forEach(invoiceId => {
      if (invoiceId) {
        this.props.mutator.invoice.GET({ path: `invoice-storage/invoices/${invoiceId}` });
      }
    });
  }

  fetchInvoiceLineData() {
    const invoiceLineId = this.props.resources.jobLog.records[0]?.relatedInvoiceLineInfo.id;

    if (invoiceLineId) {
      this.props.mutator.invoiceLine.GET({ path: `invoice-storage/invoice-lines/${invoiceLineId}` });
    }
  }

  get jobLogData() {
    const { resources } = this.props;

    const jobLog = resources.jobLog || {};
    const srsMarcBibLog = resources.srsMarcBib || {};
    const [record] = jobLog.records || [];
    const recordType = srsMarcBibLog.records[0]?.recordType;

    return {
      hasLoaded: jobLog.hasLoaded,
      recordType,
      record,
    };
  }

  get srsMarcBibData() {
    const { resources } = this.props;

    const srsMarcBib = resources.srsMarcBib || {};
    const [record] = srsMarcBib.records || [];

    return {
      hasLoaded: srsMarcBib.hasLoaded,
      record,
    };
  }

  get instanceData() {
    const { resources } = this.props;

    const instances = resources.instances || {};
    const [record] = instances.records || [];

    return {
      hasLoaded: instances.hasLoaded,
      record,
    };
  }

  get holdingsData() {
    const { resources } = this.props;

    const holdings = resources.holdings || {};
    const [record] = holdings.records || [];

    return {
      hasLoaded: holdings.hasLoaded,
      record,
    };
  }

  get itemData() {
    const { resources } = this.props;

    const items = resources.items || {};
    const [record] = items.records || [];

    return {
      hasLoaded: items.hasLoaded,
      record,
    };
  }

  get invoiceData() {
    const { resources } = this.props;

    const invoice = resources.invoice || {};
    const [record] = invoice.records || [];

    return {
      hasLoaded: invoice.hasLoaded,
      record,
    };
  }

  get invoiceLineData() {
    const { resources } = this.props;

    const invoiceLine = resources.invoiceLine || {};
    const [record] = invoiceLine.records || [];

    return {
      hasLoaded: invoiceLine.hasLoaded,
      record,
    };
  }

  getErrorMessage(entityOption) {
    const {
      hasLoaded,
      record,
    } = this.jobLogData;

    if (!hasLoaded) return '';

    const {
      error,
      relatedInstanceInfo,
      relatedHoldingsInfo,
      relatedItemInfo,
      relatedOrderInfo,
      relatedInvoiceInfo,
      relatedInvoiceLineInfo,
    } = record;

    const errors = {
      [OPTIONS.SRS_MARC_BIB]: error,
      [OPTIONS.INSTANCE]: relatedInstanceInfo.error,
      [OPTIONS.HOLDINGS]: relatedHoldingsInfo.error,
      [OPTIONS.ITEM]: relatedItemInfo.error,
      [OPTIONS.ORDER]: relatedOrderInfo.error,
      [OPTIONS.INVOICE]: {
        invoiceInfo: relatedInvoiceInfo.error,
        invoiceLineInfo: relatedInvoiceLineInfo.error,
      },
    };

    return errors[entityOption];
  }

  render() {
    const {
      hasLoaded,
      recordType,
      record,
    } = this.jobLogData;

    if (!record || !hasLoaded) {
      return (
        <Preloader
          message={<FormattedMessage id="ui-data-import.loading" />}
          size="medium"
          preloaderClassName={sharedCss.preloader}
        />
      );
    }

    const {
      sourceRecordOrder,
      sourceRecordTitle,
      relatedInvoiceLineInfo: { fullInvoiceLineNumber },
    } = record;

    const isEdifactType = recordType === DATA_TYPES[1];
    const toolbar = {
      visible: true,
      message: (
        <SafeHTMLMessage
          id="ui-data-import.import-log"
          tagName="span"
          values={{
            recordOrder: isEdifactType ? fullInvoiceLineNumber : sourceRecordOrder + 1,
            recordTitle: sourceRecordTitle,
          }}
        />
      ),
      showThemes: false,
      activeFilter: isEdifactType ? OPTIONS.INVOICE : OPTIONS.SRS_MARC_BIB,
    };

    const logs = {
      [OPTIONS.SRS_MARC_BIB]: [{
        label: '',
        logs: this.srsMarcBibData.record,
        error: this.getErrorMessage(OPTIONS.SRS_MARC_BIB),
        errorBlockId: 'srs-marc-bib-error',
      }],
      [OPTIONS.INSTANCE]: [{
        label: '',
        logs: this.instanceData.record,
        error: this.getErrorMessage(OPTIONS.INSTANCE),
        errorBlockId: 'instance-error',
      }],
      [OPTIONS.HOLDINGS]: [{
        label: '',
        logs: this.holdingsData.record,
        error: this.getErrorMessage(OPTIONS.HOLDINGS),
        errorBlockId: 'holdings-error',
      }],
      [OPTIONS.ITEM]: [{
        label: '',
        logs: this.itemData.record,
        error: this.getErrorMessage(OPTIONS.ITEM),
        errorBlockId: 'item-error',
      }],
      [OPTIONS.ORDER]: [{}],
      [OPTIONS.INVOICE]: [{
        label: (
          <Headline margin="none">
            <FormattedMessage id="ui-data-import.logViewer.invoiceLine" />
          </Headline>
        ),
        logs: this.invoiceData.record,
        error: this.getErrorMessage(OPTIONS.INVOICE).invoiceInfo,
        errorBlockId: 'invoice-line-error',
      }, {
        label: (
          <Headline margin="none">
            <FormattedMessage id="ui-data-import.logViewer.invoice" />
          </Headline>
        ),
        logs: this.invoiceLineData.record,
        error: this.getErrorMessage(OPTIONS.INVOICE).invoiceLineInfo,
        errorBlockId: 'invoice-error',
      }],
    };

    return (
      <div id="job-log-colorizer">
        <LogViewer
          logs={logs}
          language={LANGUAGES.JSON}
          theme={THEMES.COY}
          toolbar={toolbar}
          errorDetector={entityOption => this.getErrorMessage(entityOption)}
        />
      </div>
    );
  }
}
