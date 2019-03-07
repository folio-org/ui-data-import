import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import {
  debounce,
  get,
  upperFirst,
  noop,
} from 'lodash';

import {
  Button,
  Layer,
  MultiColumnList,
  Pane,
  PaneMenu,
  Paneset,
  SearchField,
  SRStatus,
} from '@folio/stripes/components';
import {
  withStripes,
  stripesShape,
} from '@folio/stripes-core';
import {
  mapNsKeys,
  getNsKey,
  makeConnectedSource,
  buildUrl,
} from '@folio/stripes/smart-components';

import { Preloader } from '../Preloader';
import { SORT_TYPES } from '../../utils/constants';

import css from './SearchAndSort.css';

@withRouter
@withStripes
export class SearchAndSort extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    objectName: PropTypes.string.isRequired,
    resultsLabel: PropTypes.node.isRequired,
    initialResultCount: PropTypes.number.isRequired,
    resultCountIncrement: PropTypes.number.isRequired, // collection to be exploded and passed on to the detail view
    searchLabelKey: PropTypes.string.isRequired,
    resultCountMessageKey: PropTypes.string.isRequired,
    location: PropTypes.shape({ // provided by withRouter
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({ // provided by withRouter
      push: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({ // provided by withRouter
      path: PropTypes.string.isRequired,
    }).isRequired,
    parentMutator: PropTypes.shape({
      query: PropTypes.shape({
        replace: PropTypes.func.isRequired,
        update: PropTypes.func.isRequired,
      }),
      resultCount: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    parentResources: PropTypes.shape({
      query: PropTypes.shape({
        filters: PropTypes.string,
        notes: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.bool,
        ]),
      }),
      records: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        isPending: PropTypes.bool,
        other: PropTypes.shape({
          totalRecords: PropTypes.number.isRequired,
        }),
        successfulMutations: PropTypes.arrayOf(
          PropTypes.shape({
            record: PropTypes.shape({
              id: PropTypes.string.isRequired,
            }).isRequired,
          }),
        ),
      }),
      resultCount: PropTypes.number,
    }).isRequired,
    ViewRecordComponent: PropTypes.func.isRequired,
    EditRecordComponent: PropTypes.func,
    actionMenu: PropTypes.func, // parameter properties provided by caller
    detailProps: PropTypes.object,
    massageNewRecord: PropTypes.func,
    maxSortKeys: PropTypes.number,
    newRecordInitialValues: PropTypes.object,
    nsParams: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    onChangeIndex: PropTypes.func,
    onComponentWillUnmount: PropTypes.func,
    onCreate: PropTypes.func,
    onEdit: PropTypes.func,
    handleCreateSuccess: PropTypes.func,
    onSelectRow: PropTypes.func,
    path: PropTypes.string,
    searchableIndexes: PropTypes.arrayOf(PropTypes.object),
    selectedIndex: PropTypes.string, // whether to auto-show the details record when a search returns a single row
    showSingleResult: PropTypes.bool,
    notLoadedMessage: PropTypes.string,
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
    columnMapping: PropTypes.object,
    columnWidths: PropTypes.object,
    resultsFormatter: PropTypes.shape({}),
    defaultSort: PropTypes.string,
    fullWidthContainer: PropTypes.instanceOf(Element),
  };

  static defaultProps = {
    showSingleResult: false,
    maxSortKeys: 2,
    onComponentWillUnmount: noop,
    onChangeIndex: noop,
    onCreate: noop,
    onEdit: noop,
    handleCreateSuccess: noop,
    massageNewRecord: noop,
    defaultSort: '',
  };

  constructor(props) {
    super(props);

    const {
      stripes,
      ViewRecordComponent,
      match: { path: routePath },
    } = this.props;

    this.state = { selectedItem: this.initiallySelectedRecord };

    this.SRStatus = null;
    this.lastNonNullResultCount = undefined;
    this.initialQuery = queryString.parse(routePath);
    this.connectedViewRecord = stripes.connect(ViewRecordComponent);
  }

  componentWillReceiveProps(nextProps) {  // eslint-disable-line react/no-deprecated
    const { stripes: { logger } } = this.props;

    const oldState = makeConnectedSource(this.props, logger);
    const newState = makeConnectedSource(nextProps, logger);

    const isSearchComplete = oldState.pending() && !newState.pending();

    if (isSearchComplete) {
      const count = newState.totalCount();

      this.SRStatus.sendMessage(
        <FormattedMessage
          id="stripes-smart-components.searchReturnedResults"
          values={{ count }}
        />
      );
    }

    const showSingleResult = nextProps.showSingleResult &&
      newState.totalCount() === 1 && this.lastNonNullResultCount > 1;

    if (showSingleResult) {
      this.onSelectRow(null, newState.records()[0]);
    }

    if (newState.totalCount() !== null) {
      this.lastNonNullResultCount = newState.totalCount();
    }
  }

  componentWillUnmount() {
    const {
      parentMutator: { query },
      onComponentWillUnmount,
    } = this.props;

    query.replace(this.initialQuery);
    onComponentWillUnmount(this.props);
  }

  get initiallySelectedRecord() {
    const { location: { pathname } } = this.props;

    const match = pathname.match(/^\/.*\/view\/(.*)$/);
    const recordId = match && match[1];

    return { id: recordId };
  }

  onChangeSearch = e => {
    const query = e.target.value;

    this.setState({ locallyChangedSearchTerm: query });
  };

  onSubmitSearch = e => {
    e.preventDefault();
    e.stopPropagation();

    const { locallyChangedSearchTerm } = this.state;

    this.performSearch(locallyChangedSearchTerm);
  };

  performSearch = debounce(query => {
    const {
      parentMutator: { resultCount },
      initialResultCount,
    } = this.props;

    resultCount.replace(initialResultCount);
    this.transitionToParams({ query });
  }, 350);

  onClearSearchQuery = () => {
    this.setState({ locallyChangedSearchTerm: '' });
    this.transitionToParams({ query: '' });
  };

  onOpenEditRecord = e => {
    if (e) {
      e.preventDefault();
    }

    this.transitionToParams({ layer: 'edit' });
  };

  onCloseEditRecord = e => {
    if (e) {
      e.preventDefault();
    }

    this.transitionToParams({ layer: null });
  };

  onNeedMore = () => {
    const {
      stripes: { logger },
      resultCountIncrement,
    } = this.props;

    const source = makeConnectedSource(this.props, logger);

    source.fetchMore(resultCountIncrement);
  };

  onSelectRow = (e, meta) => {
    const {
      onSelectRow,
      match: { path },
    } = this.props;

    if (onSelectRow) {
      const shouldFallBackToRegularRecordDisplay = onSelectRow(e, meta);

      if (!shouldFallBackToRegularRecordDisplay) {
        return;
      }
    }

    this.setState({ selectedItem: meta });
    this.transitionToParams({ _path: `${path}/view/${meta.id}` });
  };

  onSort = (e, meta) => {
    const {
      maxSortKeys,
      defaultSort,
    } = this.props;

    const newOrder = meta.name;
    const oldOrder = this.queryParam('sort') || defaultSort;
    const orders = oldOrder ? oldOrder.split(',') : [];
    const mainSort = orders[0];
    const isSameColumn = mainSort && newOrder === mainSort.replace(/^-/, '');

    if (isSameColumn) {
      orders[0] = `-${mainSort}`.replace(/^--/, '');
    } else {
      orders.unshift(newOrder);
    }

    const sortOrder = orders.slice(0, maxSortKeys).join(',');

    this.transitionToParams({ sort: sortOrder });
  };

  addNewRecord = e => {
    if (e) {
      e.preventDefault();
    }

    this.transitionToParams({ layer: 'create' });
  };

  createNewRecord = record => {
    const {
      massageNewRecord,
      onCreate,
    } = this.props;

    massageNewRecord(record);

    return onCreate(record);
  };

  editRecord = record => {
    const { onEdit } = this.props;

    return onEdit(record);
  };

  closeNewRecord = e => {
    if (e) {
      e.preventDefault();
    }

    this.transitionToParams({ layer: null });
  };

  collapseRecordDetails = () => {
    const { match: { path } } = this.props;

    this.setState({ selectedItem: {} });
    this.transitionToParams({ _path: `${path}/view` });
  };

  anchoredRowFormatter = row => {
    const {
      rowIndex,
      rowClass,
      rowData,
      cells,
      rowProps,
      labelStrings,
    } = row;

    return (
      <div
        role="listitem"
        key={`row-${rowIndex}`}
      >
        <a
          href={this.getRowURL(rowData.id)}
          aria-label={labelStrings && labelStrings.join('...')}
          className={rowClass}
          {...rowProps}
        >
          {cells}
        </a>
      </div>
    );
  };

  transitionToParams(values) {
    const {
      nsParams,
      location,
      history,
    } = this.props;

    const nsValues = mapNsKeys(values, nsParams);
    const url = buildUrl(location, nsValues);

    history.push(url);
  }

  queryParam(name) {
    const {
      parentResources: { query },
      nsParams,
    } = this.props;

    const nsKey = getNsKey(name, nsParams);

    return get(query, nsKey);
  }

  craftLayerURL(mode) {
    const {
      location: {
        pathname,
        search,
      },
    } = this.props;

    const url = `${pathname}${search}`;

    return `${url}${url.includes('?') ? '&' : '?'}layer=${mode}`;
  }

  getRowURL(id) {
    const {
      match: { path },
      location: { search },
    } = this.props;

    return `${path}/view/${id}${search}`;
  }

  renderDetailsPane(source) {
    const {
      detailProps,
      parentMutator,
      parentResources,
      stripes,
      match,
      fullWidthContainer,
      handleEditSuccess,
    } = this.props;

    return (
      <Route
        path={`${match.path}/view/:id`}
        render={
          props => (
            <this.connectedViewRecord
              stripes={stripes}
              paneWidth="44%"
              editContainer={fullWidthContainer}
              parentResources={parentResources}
              connectedSource={source}
              parentMutator={parentMutator}
              editLink={this.craftLayerURL('edit')}
              onClose={this.collapseRecordDetails}
              onOpenEdit={this.onOpenEditRecord}
              onCloseEdit={this.onCloseEditRecord}
              onEdit={this.editRecord}
              onEditSuccess={handleEditSuccess}
              {...props}
              {...detailProps}
            />
          )
        }
      />
    );
  }

  renderNewRecordButton() {
    return (
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.addNew">
          {ariaLabel => (
            <Button
              data-test-new-file-extension-button
              href={this.craftLayerURL('create')}
              aria-label={ariaLabel}
              buttonStyle="primary"
              marginBottom0
              onClick={this.addNewRecord}
            >
              <FormattedMessage id="stripes-smart-components.new" />
            </Button>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  renderSearch(source) {
    const {
      objectName,
      onChangeIndex,
      searchableIndexes,
      selectedIndex,
      searchLabelKey,
    } = this.props;
    const { locallyChangedSearchTerm } = this.state;

    const query = this.queryParam('query') || '';
    const searchTerm = locallyChangedSearchTerm !== undefined ? locallyChangedSearchTerm : query;

    return (
      <form onSubmit={this.onSubmitSearch}>
        <FormattedMessage id={searchLabelKey}>
          {searchDetailsLabel => (
            <FormattedMessage
              id="stripes-smart-components.searchFieldLabel"
              values={{ moduleName: searchDetailsLabel }}
            >
              {ariaLabel => (
                <SearchField
                  id={`input-${objectName}-search`}
                  className={css.searchField}
                  ariaLabel={ariaLabel}
                  marginBottom0
                  searchableIndexes={searchableIndexes}
                  selectedIndex={selectedIndex}
                  value={searchTerm}
                  loading={source.pending()}
                  onChangeIndex={onChangeIndex}
                  onChange={this.onChangeSearch}
                  onClear={this.onClearSearchQuery}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </form>
    );
  }

  renderEmptyMessage(source) {
    const { notLoadedMessage } = this.props;

    return source.pending() ? <Preloader /> : notLoadedMessage;
  }

  renderSearchResults(source) {
    const {
      columnMapping,
      columnWidths,
      resultsFormatter,
      visibleColumns,
      objectName,
      defaultSort,
    } = this.props;
    const { selectedItem } = this.state;

    const records = source.records();
    const count = source.totalCount();
    const objectNameUC = upperFirst(objectName);
    const sortOrderQuery = this.queryParam('sort') || defaultSort;
    const sortDirection = sortOrderQuery.startsWith('-') ? SORT_TYPES.DESCENDING : SORT_TYPES.ASCENDING;
    const sortOrder = sortOrderQuery.replace(/^-/, '').replace(/,.*/, '');

    return (
      <FormattedMessage
        id="stripes-smart-components.searchResults"
        values={{ objectName: objectNameUC }}
      >
        {ariaLabel => (
          <MultiColumnList
            id={`${objectName}-list`}
            ariaLabel={ariaLabel}
            totalCount={count}
            contentData={records}
            selectedRow={selectedItem}
            formatter={resultsFormatter}
            visibleColumns={visibleColumns}
            sortOrder={sortOrder}
            sortDirection={sortDirection}
            isEmptyMessage={this.renderEmptyMessage(source)}
            columnWidths={columnWidths}
            columnMapping={columnMapping}
            loading={source.pending()}
            autosize
            virtualize
            rowFormatter={this.anchoredRowFormatter}
            onRowClick={this.onSelectRow}
            onHeaderClick={this.onSort}
            onNeedMoreData={this.onNeedMore}
          />
        )}
      </FormattedMessage>
    );
  }

  renderCreateRecordLayer(source) {
    const {
      parentResources,
      objectName,
      detailProps,
      EditRecordComponent,
      newRecordInitialValues,
      stripes,
      parentMutator,
      location: { search },
      fullWidthContainer,
      handleCreateSuccess,
    } = this.props;

    if (!EditRecordComponent) {
      return null;
    }

    const urlQuery = queryString.parse(search || '');
    const isLayerOpen = urlQuery.layer ? urlQuery.layer === 'create' : false;

    return (
      <Layer
        isOpen={isLayerOpen}
        container={fullWidthContainer}
      >
        <EditRecordComponent
          id={`${objectName}form-add${objectName}`}
          stripes={stripes}
          initialValues={newRecordInitialValues}
          parentResources={parentResources}
          connectedSource={source}
          parentMutator={parentMutator}
          onSubmit={this.createNewRecord}
          onSubmitSuccess={handleCreateSuccess}
          onCancel={this.closeNewRecord}
          {...detailProps}
        />
      </Layer>
    );
  }

  render() {
    const {
      stripes,
      actionMenu,
      resultCountMessageKey,
      resultsLabel,
    } = this.props;

    const source = makeConnectedSource(this.props, stripes.logger);
    const count = source.totalCount();
    const paneSub = (
      <FormattedMessage
        id={resultCountMessageKey}
        values={{ count }}
      />
    );

    return (
      <Paneset>
        <SRStatus ref={ref => { this.SRStatus = ref; }} />

        <Pane
          id="pane-results"
          defaultWidth="fill"
          noOverflow
          padContent={false}
          actionMenu={actionMenu}
          paneTitle={resultsLabel}
          paneSub={paneSub}
          lastMenu={this.renderNewRecordButton()}
        >
          {this.renderSearch(source)}
          {this.renderSearchResults(source)}
        </Pane>
        {this.renderDetailsPane(source)}
        {this.renderCreateRecordLayer(source)}
      </Paneset>
    );
  }
}
