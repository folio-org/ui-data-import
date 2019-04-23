import React, {
  Component,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
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
import {
  SORT_TYPES,
  LAYER_TYPES,
} from '../../utils/constants';

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
    editRecordInitialValues: PropTypes.object,
    editRecordInitialValuesAreLoaded: PropTypes.bool,
    nsParams: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    onChangeIndex: PropTypes.func,
    onComponentWillUnmount: PropTypes.func,
    onCreate: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    handleCreateSuccess: PropTypes.func,
    handleEditSuccess: PropTypes.func,
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
    finishedResourceName: PropTypes.string,
    fullWidthContainer: PropTypes.instanceOf(Element),
  };

  static defaultProps = {
    showSingleResult: false,
    maxSortKeys: 2,
    onComponentWillUnmount: noop,
    onChangeIndex: noop,
    onCreate: noop,
    onEdit: noop,
    onDelete: noop,
    handleCreateSuccess: noop,
    massageNewRecord: noop,
    defaultSort: '',
    finishedResourceName: '',
    editRecordInitialValuesAreLoaded: true,
  };

  constructor(props) {
    super(props);

    const { match: { path: routePath } } = this.props;

    this.state = { selectedItem: this.initiallySelectedRecord };

    this.lastNonNullResultCount = undefined;
    this.initialQuery = queryString.parse(routePath);
  }

  componentDidMount() {
    this.setInitialSortQueryParam();
  }

  componentWillReceiveProps(nextProps) { // eslint-disable-line react/no-deprecated
    const {
      stripes: { logger },
      finishedResourceName,
    } = this.props;

    const oldState = makeConnectedSource(this.props, logger, finishedResourceName);
    const newState = makeConnectedSource(nextProps, logger, finishedResourceName);

    const isSearchComplete = oldState.pending() && !newState.pending();

    if (isSearchComplete) {
      const count = newState.totalCount();

      this.SRStatusRef.current.sendMessage(
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

  setInitialSortQueryParam() {
    const {
      defaultSort,
      location: { search },
    } = this.props;

    const queryParams = queryString.parse(search);
    const sortOrder = queryParams.sort || defaultSort;

    this.transitionToParams({ sort: sortOrder });
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

    this.transitionToParams({ layer: LAYER_TYPES.EDIT });
  };

  onCloseEditRecord = e => {
    if (e) {
      e.preventDefault();
    }

    this.transitionToParams({ layer: null });
  };

  onNeedMore = source => {
    const { resultCountIncrement } = this.props;

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

    this.transitionToParams({ layer: LAYER_TYPES.CREATE });
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

  deleteRecord = async record => {
    const { onDelete } = this.props;
    const deleted = await onDelete(record);

    if (deleted) {
      this.collapseRecordDetails();
      this.setState({ selectedItem: null });
    }
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
      ViewRecordComponent,
    } = this.props;

    return (
      <Route
        path={`${match.path}/view/:id`}
        render={
          props => (
            <ViewRecordComponent
              stripes={stripes}
              paneWidth="44%"
              editContainer={fullWidthContainer}
              parentResources={parentResources}
              connectedSource={source}
              parentMutator={parentMutator}
              editLink={this.craftLayerURL(LAYER_TYPES.EDIT)}
              onClose={this.collapseRecordDetails}
              onOpenEdit={this.onOpenEditRecord}
              onCloseEdit={this.onCloseEditRecord}
              onEdit={this.editRecord}
              onDelete={this.deleteRecord}
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
              data-test-new-button
              href={this.craftLayerURL(LAYER_TYPES.CREATE)}
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
        <div className={css.searchWrap}>
          <div className={css.searchFiledWrap}>
            <FormattedMessage id={searchLabelKey}>
              {searchDetailsLabel => (
                <FormattedMessage
                  id="stripes-smart-components.searchFieldLabel"
                  values={{ moduleName: searchDetailsLabel }}
                >
                  {ariaLabel => (
                    <SearchField
                      id={`input-${objectName}-search`}
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
          </div>
          <div className={css.searchButtonWrap}>
            <Button
              data-test-search-and-sort-submit
              type="submit"
              buttonStyle="primary"
              fullWidth
              marginBottom0
              disabled={!searchTerm}
            >
              <FormattedMessage id="stripes-smart-components.search" />
            </Button>
          </div>
        </div>
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
            onNeedMoreData={() => this.onNeedMore(source)}
          />
        )}
      </FormattedMessage>
    );
  }

  getLayerProps(layer) {
    const {
      newRecordInitialValues,
      editRecordInitialValues,
      handleCreateSuccess,
      handleEditSuccess,
    } = this.props;

    switch (layer) {
      case LAYER_TYPES.CREATE: {
        return {
          initialValues: newRecordInitialValues,
          onSubmit: this.createNewRecord,
          onSubmitSuccess: handleCreateSuccess,
        };
      }
      case LAYER_TYPES.EDIT: {
        return {
          initialValues: editRecordInitialValues,
          onSubmit: this.editRecord,
          onSubmitSuccess: handleEditSuccess,
        };
      }
      default: {
        return {};
      }
    }
  }

  renderCreateRecordLayer(source) {
    const {
      parentResources,
      objectName,
      detailProps,
      EditRecordComponent,
      editRecordInitialValuesAreLoaded,
      stripes,
      parentMutator,
      location: { search },
      fullWidthContainer,
    } = this.props;

    if (!EditRecordComponent) {
      return null;
    }

    const { layer } = queryString.parse(search);
    const isCreateLayerOpen = layer === LAYER_TYPES.CREATE;
    const isEditLayerOpen = layer === LAYER_TYPES.EDIT && editRecordInitialValuesAreLoaded;
    const isLayerOpen = isCreateLayerOpen || isEditLayerOpen;

    return (
      <Layer
        isOpen={isLayerOpen}
        container={fullWidthContainer}
      >
        <EditRecordComponent
          id={`${objectName}form-add${objectName}`}
          stripes={stripes}
          parentResources={parentResources}
          connectedSource={source}
          parentMutator={parentMutator}
          onCancel={this.closeNewRecord}
          {...detailProps}
          {...this.getLayerProps(layer)}
        />
      </Layer>
    );
  }

  SRStatusRef = createRef();

  render() {
    const {
      stripes,
      actionMenu,
      resultCountMessageKey,
      resultsLabel,
      finishedResourceName,
    } = this.props;

    const source = makeConnectedSource(this.props, stripes.logger, finishedResourceName);
    const count = source.totalCount();
    const paneSub = (
      <FormattedMessage
        id={resultCountMessageKey}
        values={{ count }}
      />
    );

    return (
      <Paneset>
        <SRStatus ref={this.SRStatusRef} />

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
          <div className={css.paneBody}>
            {this.renderSearch(source)}
            <div className={css.searchResults}>
              {this.renderSearchResults(source)}
            </div>
          </div>
        </Pane>
        {this.renderDetailsPane(source)}
        {this.renderCreateRecordLayer(source)}
      </Paneset>
    );
  }
}
