import React, {
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useParams,
  useLocation,
} from 'react-router-dom';

import { Headline } from '@folio/stripes/components';
import { Preloader } from '@folio/stripes-data-transfer-components';

import { LogViewer } from '../components/LogViewer';
import { LANGUAGES } from '../components/CodeHighlight/Languages';
import { THEMES } from '../components';
import {
  useJobLogRecordsQuery,
  useSRSRecordQuery,
  useInventoryInstancesByIdQuery,
  useInventoryHoldingsByIdQuery,
  useInventoryItemsByIdQuery,
  useOrderByIdQuery,
  usePOLinesByIdQuery,
  useInvoicesByIdQuery,
  useInvoiceLineByIdQuery,
  useAuthoritiesByIdQuery,
} from '../hooks';

import {
  DATA_TYPES,
  LOG_VIEWER,
} from '../utils';

import sharedCss from '../shared.css';

const { FILTER: { OPTIONS } } = LOG_VIEWER;

export const ViewJobLog = () => {
  const { id: logId, recordId } = useParams();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const instanceLineIdParam = searchParams.get('instanceLineId');

  const [instancesIds, setInstancesIds] = useState([]);
  const [holdingsIds, setHoldingsIds] = useState([]);
  const [itemsIds, setItemsIds] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [poLinesIds, setPoLinesIds] = useState([]);
  const [invoicesIds, setInvoicesIds] = useState([]);
  const [invoiceLineId, setInvoiceLineId] = useState(null);
  const [authoritiesIds, setAuthoritiesIds] = useState([]);

  const {
    isError: isJobLogError,
    isLoading: isJobLogLoading,
    data: jobLogData = {},
  } = useJobLogRecordsQuery(logId, instanceLineIdParam || recordId);
  const { data: srsRecordData } = useSRSRecordQuery(recordId);
  const { data: instancesData } = useInventoryInstancesByIdQuery(instancesIds);
  const { data: holdingsData } = useInventoryHoldingsByIdQuery(holdingsIds);
  const { data: itemsData } = useInventoryItemsByIdQuery(itemsIds);
  const { data: orderData } = useOrderByIdQuery(orderId);
  const { data: poLinesData } = usePOLinesByIdQuery(poLinesIds);
  const { data: invoicesData } = useInvoicesByIdQuery(invoicesIds);
  const { data: invoiceLineData } = useInvoiceLineByIdQuery(invoiceLineId);
  const { data: authoritiesData } = useAuthoritiesByIdQuery(authoritiesIds);

  useEffect(() => {
    if (!isJobLogLoading && !isJobLogError) {
      const {
        relatedInstanceInfo,
        relatedHoldingsInfo,
        relatedItemInfo,
        relatedPoLineInfo,
        relatedInvoiceInfo,
        relatedInvoiceLineInfo,
        relatedAuthorityInfo,
      } = jobLogData;

      setInstancesIds(relatedInstanceInfo.idList);
      setHoldingsIds(relatedHoldingsInfo.idList);
      setItemsIds(relatedItemInfo.idList);
      setOrderId(relatedPoLineInfo?.orderId);
      setPoLinesIds(relatedPoLineInfo?.idList);
      setInvoicesIds(relatedInvoiceInfo.idList);
      setInvoiceLineId(relatedInvoiceLineInfo?.id);
      setAuthoritiesIds(relatedAuthorityInfo?.idList);
    }
  }, [isJobLogLoading, isJobLogError, jobLogData]);

  const getErrorMessage = entityOption => {
    if (isJobLogLoading || isJobLogError) return '';

    const {
      error,
      relatedInstanceInfo,
      relatedHoldingsInfo,
      relatedItemInfo,
      relatedAuthorityInfo,
      relatedPoLineInfo,
      relatedInvoiceInfo,
      relatedInvoiceLineInfo,
    } = jobLogData;

    const errors = {
      [OPTIONS.SRS_MARC_BIB]: error || '',
      [OPTIONS.INSTANCE]: relatedInstanceInfo.error || '',
      [OPTIONS.HOLDINGS]: relatedHoldingsInfo.error || '',
      [OPTIONS.ITEM]: relatedItemInfo.error || '',
      [OPTIONS.ORDER]: relatedPoLineInfo.error || '',
      [OPTIONS.AUTHORITY]: relatedAuthorityInfo.error || '',
      [OPTIONS.INVOICE]: {
        invoiceInfo: relatedInvoiceInfo.error || '',
        invoiceLineInfo: relatedInvoiceLineInfo?.error || '',
      },
    };

    return errors[entityOption];
  };

  if (isJobLogLoading) {
    return (
      <Preloader
        message={<FormattedMessage id="ui-data-import.loading" />}
        size="medium"
        preloaderClassName={sharedCss.preloader}
      />
    );
  }

  const recordType = srsRecordData?.recordType;
  const {
    sourceRecordOrder,
    sourceRecordTitle,
    relatedInvoiceLineInfo,
  } = jobLogData;

  const isEdifactType = recordType === DATA_TYPES[1];
  const recordOrder = isEdifactType ? relatedInvoiceLineInfo.fullInvoiceLineNumber : sourceRecordOrder + 1;
  const toolbar = {
    visible: true,
    message: (
      <FormattedMessage
        id="ui-data-import.import-log"
        tagName="span"
        values={{
          recordOrder,
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
      logs: srsRecordData,
      error: getErrorMessage(OPTIONS.SRS_MARC_BIB),
      errorBlockId: 'srs-marc-bib-error',
    }],
    [OPTIONS.INSTANCE]: [{
      label: '',
      logs: instancesData,
      error: getErrorMessage(OPTIONS.INSTANCE),
      errorBlockId: 'instance-error',
    }],
    [OPTIONS.HOLDINGS]: [{
      label: '',
      logs: holdingsData,
      error: getErrorMessage(OPTIONS.HOLDINGS),
      errorBlockId: 'holdings-error',
    }],
    [OPTIONS.ITEM]: [{
      label: '',
      logs: itemsData,
      error: getErrorMessage(OPTIONS.ITEM),
      errorBlockId: 'item-error',
    }],
    [OPTIONS.AUTHORITY]: [{
      label: '',
      logs: authoritiesData,
      error: getErrorMessage(OPTIONS.AUTHORITY),
      errorBlockId: 'authority-error',
    }],
    [OPTIONS.ORDER]: [{
      label: (
        <Headline margin="none" className={sharedCss.leftMargin}>
          <FormattedMessage id="ui-data-import.logViewer.orderLine" />
        </Headline>
      ),
      logs: poLinesData,
      error: getErrorMessage(OPTIONS.ORDER),
      errorBlockId: 'order-line-error',
    }, {
      label: (
        <Headline margin="none" className={sharedCss.leftMargin}>
          <FormattedMessage id="ui-data-import.logViewer.order" />
        </Headline>
      ),
      logs: orderData,
    }],
    [OPTIONS.INVOICE]: [{
      label: (
        <Headline margin="none" className={sharedCss.leftMargin}>
          <FormattedMessage id="ui-data-import.logViewer.invoiceLine" />
        </Headline>
      ),
      logs: invoiceLineData,
      error: getErrorMessage(OPTIONS.INVOICE).invoiceLineInfo,
      errorBlockId: 'invoice-line-error',
    }, {
      label: (
        <Headline margin="none" className={sharedCss.leftMargin}>
          <FormattedMessage id="ui-data-import.logViewer.invoice" />
        </Headline>
      ),
      logs: invoicesData,
      error: getErrorMessage(OPTIONS.INVOICE).invoiceInfo,
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
      />
    </div>
  );
};
