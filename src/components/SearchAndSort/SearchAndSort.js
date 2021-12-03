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
  omit,
} from 'lodash';

import {
  Layer,
  Pane,
  Paneset,
  SRStatus,
  PaneHeader,
  HasCommand,
  checkScope,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';
import { SearchResults } from '@folio/stripes-data-transfer-components/lib/SearchResults';
import { SearchForm } from '@folio/stripes-data-transfer-components';
import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';
import {
  mapNsKeys,
  getNsKey,
  makeConnectedSource,
  buildUrl,
} from '@folio/stripes/smart-components';
import {
  SORT_TYPES,
  buildSortOrder,
} from '@folio/stripes-data-transfer-components/lib/utils';

import {
  createLayerURL,
  LAYER_TYPES,
} from '../../utils';

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
    location: PropTypes.oneOfType([
      PropTypes.shape({
        search: PropTypes.string.isRequired,
        pathname: PropTypes.string.isRequired,
      }).isRequired,
      PropTypes.string.isRequired,
    ]).isRequired,
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
      resultCount: PropTypes.shape({ replace: PropTypes.func.isRequired }).isRequired,
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
        other: PropTypes.shape({ totalRecords: PropTypes.number.isRequired }),
        successfulMutations: PropTypes.arrayOf(
          PropTypes.shape({
            record: PropTypes.shape({ // eslint-disable-line object-curly-newline
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
    onSubmitSearch: PropTypes.func,
    handleCreateSuccess: PropTypes.func,
    handleEditSuccess: PropTypes.func,
    handleDeleteSuccess: PropTypes.func,
    handleDeleteError: PropTypes.func,
    handleRestoreSuccess: PropTypes.func,
    handleRestoreError: PropTypes.func,
    onSelectRow: PropTypes.func,
    path: PropTypes.string,
    searchableIndexes: PropTypes.arrayOf(PropTypes.object),
    selectedIndex: PropTypes.string, // whether to auto-show the details record when a search returns a single row
    showSingleResult: PropTypes.bool,
    notLoadedMessage: PropTypes.string,
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
    columnMapping: PropTypes.object,
    columnWidths: PropTypes.object,
    resultsFormatter: PropTypes.object,
    defaultSort: PropTypes.string,
    finishedResourceName: PropTypes.string,
    fullWidthContainer: PropTypes.instanceOf(Element),
    rowUpdater: PropTypes.func,
    isFullScreen: PropTypes.bool,
  };

  static defaultProps = {
    showSingleResult: false,
    maxSortKeys: 2,
    onComponentWillUnmount: noop,
    onChangeIndex: noop,
    onCreate: noop,
    onEdit: noop,
    onDelete: noop,
    onSubmitSearch: noop,
    handleCreateSuccess: noop,
    handleEditSuccess: noop,
    handleDeleteSuccess: noop,
    handleDeleteError: noop,
    handleRestoreSuccess: noop,
    handleRestoreError: noop,
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
    this.searchInputRef = createRef();
    this.accordionStatusRef = createRef();
    this.keyCommands = [
      {
        name: 'new',
        handler: () => {
          const {
            history,
            location,
          } = this.props;
          const url = createLayerURL(location, LAYER_TYPES.CREATE);

          history.push(url);
        },
      }, {
        name: 'expandAllSections',
        handler: e => expandAllSections(e, this.accordionStatusRef),
      }, {
        name: 'collapseAllSections',
        handler: e => collapseAllSections(e, this.accordionStatusRef),
      }, {
        name: 'search',
        handler: this.focusSearchField,
      },
    ];
  }

  componentDidMount() {
    this.setInitialSortQueryParam();
  }

  componentDidUpdate(prevProps) {
    const {
      stripes: { logger },
      finishedResourceName,
    } = prevProps;

    const oldState = makeConnectedSource(prevProps, logger, finishedResourceName);
    const newState = makeConnectedSource(this.props, this.props.stripes.logger, this.props.finishedResourceName);

    const isSearchComplete = oldState.pending() && !newState.pending();

    if (isSearchComplete) {
      const count = newState.totalCount();

      this.SRStatusRef.current.sendMessage((
        <FormattedMessage
          id="stripes-smart-components.searchReturnedResults"
          values={{ count }}
        />
      ));
    }

    const showSingleResult = this.props.showSingleResult &&
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

  focusSearchField = () => {
    this.searchInputRef.current.focus();
  };

  onChangeSearch = e => {
    const query = e.target.value;

    this.setState({ locallyChangedSearchTerm: query });
  };

  onSubmitSearch = e => {
    const { onSubmitSearch } = this.props;
    const { locallyChangedSearchTerm } = this.state;

    e.preventDefault();
    e.stopPropagation();
    this.performSearch(locallyChangedSearchTerm);
    onSubmitSearch(e, locallyChangedSearchTerm);
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
    const { onSubmitSearch } = this.props;

    this.setState({ locallyChangedSearchTerm: '' });
    this.transitionToParams({ query: '' });
    onSubmitSearch(null, '');
  };

  onCloseEditRecord = e => {
    if (e) {
      e.preventDefault();
    }

    this.transitionToParams({ layer: null });
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

    const sortOrder = buildSortOrder(this.queryParam('sort') || defaultSort, meta.name, defaultSort, maxSortKeys);

    this.transitionToParams({ sort: sortOrder });
  };

  createNewRecord = async record => {
    const {
      massageNewRecord,
      onCreate,
    } = this.props;

    massageNewRecord(record);

    const response = await onCreate(record);

    this.setState({ selectedItem: { id: response.id } });

    return response;
  };

  editRecord = record => {
    const { onEdit } = this.props;

    return onEdit(record);
  };

  deleteRecord = async record => {
    const {
      onDelete,
      handleDeleteSuccess,
      handleDeleteError,
    } = this.props;

    const response = await onDelete(record);

    if (response.ok) {
      this.setState({ selectedItem: null });
      handleDeleteSuccess(record);
    } else {
      handleDeleteError(record, response);
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
    } = row;

    return (
      <div
        role="gridcell"
        key={`row-${rowIndex}`}
      >
        <a
          href={this.getRowURL(rowData.id)}
          className={rowClass}
          {...rowProps}
        >
          <div
            className={css.searchResultsRow}
            role="grid"
          >
            <div
              className={css.searchResultsInnerRow}
              role="row"
            >
              {cells}
            </div>
          </div>
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
      isFullScreen,
      location,
      location: { pathname },
    } = this.props;

    const commonProps = {
      key: pathname,
      stripes,
      editContainer: fullWidthContainer,
      parentResources,
      connectedSource: source,
      parentMutator,
      onClose: this.collapseRecordDetails,
      onCloseEdit: this.onCloseEditRecord,
      onEdit: this.editRecord,
      onDelete: this.deleteRecord,
      onEditSuccess: handleEditSuccess,
      accordionStatusRef: this.accordionStatusRef,
      location,
    };

    const narrowViewScreenProps = {
      ...commonProps,
      paneWidth: '44%',
    };

    const viewRecordComponentProps = isFullScreen ? commonProps : narrowViewScreenProps;

    return (
      <Route
        path={`${match.path}/view/:id`}
        render={
          props => (
            <ViewRecordComponent
              {...viewRecordComponentProps}
              {...props}
              {...detailProps}
            />
          )
        }
      />
    );
  }

  renderSearch(source) {
    const {
      searchableIndexes,
      selectedIndex,
      searchLabelKey,
      onChangeIndex,
      objectName,
    } = this.props;
    const { locallyChangedSearchTerm } = this.state;

    const query = this.queryParam('query') || '';
    const searchTerm = locallyChangedSearchTerm !== undefined ? locallyChangedSearchTerm : query;

    return (
      <SearchForm
        searchableIndexes={searchableIndexes}
        selectedIndex={selectedIndex}
        searchLabelKey={searchLabelKey}
        searchTerm={searchTerm}
        isLoading={source.pending()}
        handleChangeIndex={onChangeIndex}
        handleChange={this.onChangeSearch}
        handleClear={this.onClearSearchQuery}
        handleSubmit={this.onSubmitSearch}
        idKey={objectName}
        searchInputRef={this.searchInputRef}
      />
    );
  }

  renderSearchResults(source) {
    const {
      objectName,
      notLoadedMessage,
      resultCountIncrement,
      resultsFormatter,
      rowUpdater,
      visibleColumns,
      defaultSort,
      columnWidths,
      columnMapping,
    } = this.props;
    const { selectedItem } = this.state;

    const objectNameUC = upperFirst(objectName);
    const sortOrderQuery = this.queryParam('sort') || defaultSort;
    const sortDirection = sortOrderQuery.startsWith('-') ? SORT_TYPES.DESCENDING : SORT_TYPES.ASCENDING;
    const sortOrder = sortOrderQuery.replace(/^-/, '').replace(/,.*/, '');

    return (
      <FormattedMessage
        id="stripes-smart-components.searchResults"
        values={{ objectName: objectNameUC }}
      >
        {([ariaLabel]) => (
          <SearchResults
            id={`${objectName}-list`}
            source={source}
            notLoadedMessage={notLoadedMessage}
            resultCountIncrement={resultCountIncrement}
            ariaLabel={ariaLabel}
            selectedRow={selectedItem}
            formatter={resultsFormatter}
            rowUpdater={rowUpdater}
            visibleColumns={visibleColumns}
            sortOrder={sortOrder}
            sortDirection={sortDirection}
            columnWidths={columnWidths}
            columnMapping={columnMapping}
            rowFormatter={this.anchoredRowFormatter}
            onRowClick={this.onSelectRow}
            onHeaderClick={this.onSort}
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
      case LAYER_TYPES.DUPLICATE: {
        return {
          initialValues: omit(editRecordInitialValues, ['id', 'parentProfiles', 'childProfiles']),
          onSubmit: this.createNewRecord,
          onSubmitSuccess: handleCreateSuccess,
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
      match,
    } = this.props;

    if (!EditRecordComponent) {
      return null;
    }

    const { layer } = queryString.parse(search);
    const isCreateLayerOpen = layer === LAYER_TYPES.CREATE;
    const isEditLayerOpen = layer === LAYER_TYPES.EDIT && editRecordInitialValuesAreLoaded;
    const isDuplicateLayerOpen = layer === LAYER_TYPES.DUPLICATE && editRecordInitialValuesAreLoaded;
    const isLayerOpen = isCreateLayerOpen || isEditLayerOpen || isDuplicateLayerOpen;

    return (
      <Layer
        isOpen={isLayerOpen}
        container={fullWidthContainer}
        contentLabel="Mapping profile form"
      >
        <EditRecordComponent
          id={`${objectName}form-add${objectName}`}
          stripes={stripes}
          parentResources={parentResources}
          connectedSource={source}
          parentMutator={parentMutator}
          onCancel={this.closeNewRecord}
          transitionToParams={values => this.transitionToParams(values)}
          match={match}
          accordionStatusRef={this.accordionStatusRef}
          {...detailProps}
          {...this.getLayerProps(layer)}
        />
      </Layer>
    );
  }

  SRStatusRef = createRef();

  getSource() {
    const {
      stripes,
      finishedResourceName,
    } = this.props;

    return makeConnectedSource(this.props, stripes.logger, finishedResourceName);
  }

  renderPaneHeader = renderProps => {
    const {
      actionMenu,
      resultCountMessageKey,
      resultsLabel,
    } = this.props;

    const count = this.getSource().totalCount();

    const paneSub = (
      <FormattedMessage
        id={resultCountMessageKey}
        values={{ count }}
      />
    );

    return (
      <PaneHeader
        {...renderProps}
        actionMenu={actionMenu}
        paneTitle={resultsLabel}
        paneSub={paneSub}
      />
    );
  };

  render() {
    const { isFullScreen } = this.props;

    const source = this.getSource();

    return (
      <>
        <HasCommand
          commands={this.keyCommands}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <Paneset>
            <SRStatus ref={this.SRStatusRef} />
            <Pane
              id="pane-results"
              defaultWidth="fill"
              noOverflow
              padContent={false}
              renderHeader={this.renderPaneHeader}
            >
              <div className={css.paneBody}>
                {this.renderSearch(source)}
                <div className={css.searchResults}>
                  {this.renderSearchResults(source)}
                </div>
              </div>
            </Pane>
            {!isFullScreen && this.renderDetailsPane(source)}
            {this.renderCreateRecordLayer(source)}
          </Paneset>
          {isFullScreen && this.renderDetailsPane(source)}
        </HasCommand>
      </>
    );
  }
}
