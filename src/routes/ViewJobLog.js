import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { noop } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Preloader } from '@folio/stripes-data-transfer-components';

import { LogViewer } from '../components/LogViewer';
import { LANGUAGES } from '../components/CodeHighlight/Languages';
import { THEMES } from '../components';

import { LOG_VIEWER } from '../utils';

import sharedCss from '../shared.css';

const { FILTER: { OPTIONS } } = LOG_VIEWER;

@stripesConnect
export class ViewJobLog extends Component {
  static manifest = Object.freeze({
    jobLog: {
      type: 'okapi',
      path: 'metadata-provider/jobLogEntries/:{id}/records/:{recordId}',
      throwsErrors: false,
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
    }).isRequired,
    mutator: PropTypes.shape({
      instances: PropTypes.shape({ GET: PropTypes.func.isRequired }).isRequired,
      holdings: PropTypes.shape({ GET: PropTypes.func.isRequired }).isRequired,
      items: PropTypes.shape({ GET: PropTypes.func.isRequired }).isRequired,
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

  get jobLogData() {
    const { resources } = this.props;

    const jobLog = resources.jobLog || {};
    const [record] = jobLog.records || [];

    return {
      hasLoaded: jobLog.hasLoaded,
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

  render() {
    const {
      hasLoaded,
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
    } = record;

    const toolbar = {
      visible: true,
      message: (
        <SafeHTMLMessage
          id="ui-data-import.import-log"
          tagName="span"
          values={{
            recordOrder: sourceRecordOrder + 1,
            recordTitle: sourceRecordTitle,
          }}
        />
      ),
      showThemes: false,
    };

    const logs = {
      [OPTIONS.SRS_MARC_BIB]: this.srsMarcBibData.record,
      [OPTIONS.INSTANCE]: this.instanceData.record,
      [OPTIONS.HOLDINGS]: this.holdingsData.record,
      [OPTIONS.ITEM]: this.itemData.record,
      [OPTIONS.ORDER]: {},
      [OPTIONS.INVOICE]: {},
    };

    return (
      <div id="job-log-colorizer">
        <LogViewer
          logs={logs}
          language={LANGUAGES.JSON}
          theme={THEMES.COY}
          toolbar={toolbar}
          errorDetector={noop}
        />
      </div>
    );
  }
}
