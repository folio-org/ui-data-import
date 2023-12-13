import React, {
  useEffect,
  useMemo,
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
  useLocationsQuery,
  useIncomingRecordByIdQuery,
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
  const { data: srsRecordData } = useSRSRecordQuery(recordId, { tenant: jobLogData?.sourceRecordTenantId });
  const { data: instancesData } = useInventoryInstancesByIdQuery(instancesIds, { tenant: jobLogData?.relatedInstanceInfo?.tenantId });
  const { data: holdingsData } = useInventoryHoldingsByIdQuery(holdingsIds, { tenant: jobLogData?.relatedHoldingsInfo?.tenantId });
  const { data: itemsData } = useInventoryItemsByIdQuery(itemsIds, { tenant: jobLogData?.relatedItemInfo?.tenantId });
  const { data: orderData } = useOrderByIdQuery(orderId, { tenant: jobLogData?.relatedPoLineInfo?.tenantId });
  const { data: poLinesData } = usePOLinesByIdQuery(poLinesIds, { tenant: jobLogData?.relatedPoLineInfo?.tenantId });
  const { data: invoicesData } = useInvoicesByIdQuery(invoicesIds, { tenant: jobLogData?.relatedInvoiceInfo?.tenantId });
  const { data: invoiceLineData } = useInvoiceLineByIdQuery(invoiceLineId, { tenant: jobLogData?.relatedInvoiceInfo?.tenantId });
  const { data: authoritiesData } = useAuthoritiesByIdQuery(authoritiesIds, { tenant: jobLogData?.relatedAuthorityInfo?.tenantId });
  const { data: locationsData = [] } = useLocationsQuery({ tenant: jobLogData?.relatedHoldingsInfo?.tenantId });
  const { data: parsedRecordContent } = useIncomingRecordByIdQuery(recordId);

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
      setHoldingsIds(relatedHoldingsInfo.map((item) => item.id).filter((id) => !!id));
      setItemsIds(relatedItemInfo.map((item) => item.id).filter((id) => !!id));
      setOrderId(relatedPoLineInfo?.orderId);
      setPoLinesIds(relatedPoLineInfo?.idList);
      setInvoicesIds(relatedInvoiceInfo.idList);
      setInvoiceLineId(relatedInvoiceLineInfo?.id);
      setAuthoritiesIds(relatedAuthorityInfo?.idList);
    }
  }, [isJobLogLoading, isJobLogError, jobLogData]);

  const incomingRecordLogs = useMemo(() => {
    const { error } = jobLogData;

    return [
      {
        label: '',
        logs: parsedRecordContent ? JSON.parse(parsedRecordContent) : '',
        error: error || '',
        errorBlockId: 'incoming-record-error',
      },
    ];
  }, [jobLogData, parsedRecordContent]);

  const srsMarcBibLogs = useMemo(() => {
    const { error } = jobLogData;

    return [
      {
        label: '',
        logs: srsRecordData,
        error: error || '',
        errorBlockId: 'srs-marc-bib-error',
      },
    ];
  }, [jobLogData, srsRecordData]);
  const instanceLogs = useMemo(() => {
    const { relatedInstanceInfo } = jobLogData;

    return [
      {
        label: '',
        logs: instancesData,
        error: relatedInstanceInfo?.error || '',
        errorBlockId: 'instance-error',
      },
    ];
  }, [instancesData, jobLogData]);
  const holdingsLogs = useMemo(() => {
    const { relatedHoldingsInfo } = jobLogData;

    const getHoldingsLabel = (holding = {}) => {
      const { permanentLocationId } = holding;

      if (!permanentLocationId) return '';

      const permanentLocation = locationsData.find(
        (location) => location.id === permanentLocationId
      );

      return (
        <Headline margin="none" className={sharedCss.leftMargin}>
          {permanentLocation?.code}
        </Headline>
      );
    };

    return (
      relatedHoldingsInfo?.map((holding) => ({
        label: getHoldingsLabel(holding),
        logs: holdingsData?.find((data) => data.id === holding.id),
        error: holding.error || '',
        errorBlockId: 'holdings-error',
      })) || [{ logs: [] }]
    );
  }, [holdingsData, jobLogData, locationsData]);
  const itemsLogs = useMemo(() => {
    const { relatedItemInfo } = jobLogData;

    const getItemsLabel = (item = {}) => {
      const { hrid } = item;

      if (!hrid) return '';

      return (
        <Headline margin="none" className={sharedCss.leftMargin}>
          {hrid}
        </Headline>
      );
    };

    return (
      relatedItemInfo?.map((item) => ({
        label: getItemsLabel(item),
        logs: itemsData?.find((data) => data.id === item.id),
        error: item.error || '',
        errorBlockId: 'item-error',
      })) || [{ logs: [] }]
    );
  }, [itemsData, jobLogData]);
  const authorityLogs = useMemo(() => {
    const { relatedAuthorityInfo } = jobLogData;

    return [{
      label: '',
      logs: authoritiesData,
      error: relatedAuthorityInfo?.error || '',
      errorBlockId: 'authority-error',
    }];
  }, [authoritiesData, jobLogData]);
  const orderLogs = useMemo(() => {
    const { relatedPoLineInfo } = jobLogData;

    return [
      {
        label: (
          <Headline margin="none" className={sharedCss.leftMargin}>
            <FormattedMessage id="ui-data-import.logViewer.orderLine" />
          </Headline>
        ),
        logs: poLinesData,
        error: relatedPoLineInfo?.error || '',
        errorBlockId: 'order-line-error',
      },
      {
        label: (
          <Headline margin="none" className={sharedCss.leftMargin}>
            <FormattedMessage id="ui-data-import.logViewer.order" />
          </Headline>
        ),
        logs: orderData,
      },
    ];
  }, [jobLogData, orderData, poLinesData]);
  const invoiceLogs = useMemo(() => {
    const {
      relatedInvoiceLineInfo,
      relatedInvoiceInfo,
    } = jobLogData;

    return [
      {
        label: (
          <Headline margin="none" className={sharedCss.leftMargin}>
            <FormattedMessage id="ui-data-import.logViewer.invoiceLine" />
          </Headline>
        ),
        logs: invoiceLineData,
        error: relatedInvoiceLineInfo?.error || '',
        errorBlockId: 'invoice-line-error',
      },
      {
        label: (
          <Headline margin="none" className={sharedCss.leftMargin}>
            <FormattedMessage id="ui-data-import.logViewer.invoice" />
          </Headline>
        ),
        logs: invoicesData,
        error: relatedInvoiceInfo?.error || '',
        errorBlockId: 'invoice-error',
      },
    ];
  }, [invoiceLineData, invoicesData, jobLogData]);

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
    activeFilter: isEdifactType ? OPTIONS.INVOICE : OPTIONS.INCOMING_RECORD,
  };

  const logs = {
    [OPTIONS.INCOMING_RECORD]: incomingRecordLogs,
    [OPTIONS.SRS_MARC_BIB]: srsMarcBibLogs,
    [OPTIONS.INSTANCE]: instanceLogs,
    [OPTIONS.HOLDINGS]: holdingsLogs,
    [OPTIONS.ITEM]: itemsLogs,
    [OPTIONS.AUTHORITY]: authorityLogs,
    [OPTIONS.ORDER]: orderLogs,
    [OPTIONS.INVOICE]: invoiceLogs,
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
