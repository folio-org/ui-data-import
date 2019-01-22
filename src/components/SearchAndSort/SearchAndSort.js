import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import {
  debounce,
  get,
  upperFirst,
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
import { withModule } from '@folio/stripes-core/src/components/Modules';

import {
  withStripes,
  IfPermission,
} from '@folio/stripes-core';

import {
  Tags,
  mapNsKeys,
  getNsKey,
  makeConnectedSource,
} from '@folio/stripes/smart-components';

import css from './SearchAndSort.css';

class SearchAndSort extends Component {
  static propTypes = {
    actionMenu: PropTypes.func, // parameter properties provided by caller
    apolloQuery: PropTypes.object, // machine-readable
    apolloResource: PropTypes.string,
    browseOnly: PropTypes.bool,
    columnMapping: PropTypes.object,
    columnWidths: PropTypes.object,
    detailProps: PropTypes.object,
    disableRecordCreation: PropTypes.bool,
    editRecordComponent: PropTypes.func,
    finishedResourceName: PropTypes.string,
    getHelperResourcePath: PropTypes.func,
    initialResultCount: PropTypes.number.isRequired,
    location: PropTypes.shape({ // provided by withRouter
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
    }).isRequired,
    massageNewRecord: PropTypes.func,
    match: PropTypes.shape({ // provided by withRouter
      path: PropTypes.string.isRequired,
    }).isRequired,
    maxSortKeys: PropTypes.number,
    module: PropTypes.shape({ // values specified by the ModulesContext
      displayName: PropTypes.node, // human-readable
    }),
    newRecordInitialValues: PropTypes.object,
    newRecordPerms: PropTypes.string,
    notLoadedMessage: PropTypes.string,
    nsParams: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    objectName: PropTypes.string.isRequired,
    onChangeIndex: PropTypes.func,
    onComponentWillUnmount: PropTypes.func,
    onCreate: PropTypes.func,
    onSelectRow: PropTypes.func,
    packageInfo: PropTypes.shape({ // values pulled from the provider's package.json config object
      initialFilters: PropTypes.string, // default filters
      moduleName: PropTypes.string, // machine-readable, for HTML ids and translation keys
      stripes: PropTypes.shape({
        route: PropTypes.string, // base route; used to construct URLs
      }).isRequired,
    }),
    parentData: PropTypes.object,
    parentMutator: PropTypes.shape({
      query: PropTypes.shape({
        replace: PropTypes.func.isRequired,
        update: PropTypes.func.isRequired,
      }),
      resultCount: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired, // only needed when GraphQL is used
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
    path: PropTypes.string,
    queryFunction: PropTypes.func,
    renderFilters: PropTypes.func,
    resultCountIncrement: PropTypes.number.isRequired, // collection to be exploded and passed on to the detail view
    resultCountMessageKey: PropTypes.string, // URL path to parse for detail views
    resultsFormatter: PropTypes.shape({}),
    searchableIndexes: PropTypes.arrayOf(
      PropTypes.object,
    ),
    searchableIndexesPlaceholder: PropTypes.string,
    selectedIndex: PropTypes.string, // whether to auto-show the details record when a search returns a single row
    showSingleResult: PropTypes.bool,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
      hasPerm: PropTypes.func.isRequired,
    }),
    viewRecordComponent: PropTypes.func.isRequired,
    viewRecordPerms: PropTypes.string.isRequired,
    visibleColumns: PropTypes.arrayOf(
      PropTypes.string,
    ),
  };

  static defaultProps = {
    showSingleResult: false,
    maxSortKeys: 2,
  };

  constructor(props) {
    super(props);

    let initiallySelected = {};
    const match = this.props.location.pathname.match('/[^/]*/view/');

    if (match && match.index === 0) {
      const id = /view\/(.*)$/.exec(this.props.location.pathname)[1];

      initiallySelected = { id };
    }

    this.state = { selectedItem: initiallySelected };

    this.connectedViewRecord = props.stripes.connect(props.viewRecordComponent);

    this.helperApps = { tags: props.stripes.connect(Tags) };

    this.SRStatus = null;
    this.lastNonNullReaultCount = undefined;

    const initialPath = (get(props.packageInfo, ['stripes', 'home']) || get(props.packageInfo, ['stripes', 'route']));
    const initialSearch = initialPath.indexOf('?') === -1
      ? initialPath
      : initialPath.substr(initialPath.indexOf('?') + 1);

    this.initialQuery = queryString.parse(initialSearch);
  }

  componentWillReceiveProps(nextProps) {  // eslint-disable-line react/no-deprecated
    const {
      stripes: { logger },
      finishedResourceName,
    } = this.props;
    const oldState = makeConnectedSource(this.props, logger);
    const newState = makeConnectedSource(nextProps, logger);

    {
      // If the nominated mutation has finished, select the newly created record
      const oldStateForFinalSource = makeConnectedSource(this.props, logger, finishedResourceName);
      const newStateForFinalSource = makeConnectedSource(nextProps, logger, finishedResourceName);

      if (oldStateForFinalSource.records()) {
        const finishedResourceNextSM = newStateForFinalSource.successfulMutations();

        if (finishedResourceNextSM.length > oldStateForFinalSource.successfulMutations().length) {
          const sm = newState.successfulMutations();

          if (sm[0]) {
            this.onSelectRow(undefined, { id: sm[0].record.id });
          }
        }
      }
    }

    const isSearchComplete = oldState.pending() && !newState.pending();

    if (isSearchComplete) {
      const count = newState.totalCount();

      this.SRStatus.sendMessage(
        <FormattedMessage id="stripes-smart-components.searchReturnedResults" values={{ count }} />
      );
    }

    // if the results list is winnowed down to a single record, display the record.
    if (nextProps.showSingleResult &&
      newState.totalCount() === 1 &&
      this.lastNonNullReaultCount > 1) {
      this.onSelectRow(null, newState.records()[0]);
    }

    if (newState.totalCount() !== null) {
      this.lastNonNullReaultCount = newState.totalCount();
    }
  }

  componentWillUnmount() {
    this.props.parentMutator.query.replace(this.initialQuery);

    if (this.props.onComponentWillUnmount) {
      this.props.onComponentWillUnmount(this.props);
    }
  }

  craftLayerUrl = (mode) => {
    const {
      pathname,
      search,
    } = this.props.location;

    const url = `${pathname}${search}`;

    return `${url}${url.includes('?') ? '&' : '?'}layer=${mode}`;
  };

  onChangeSearch = (e) => {
    const query = e.target.value;

    this.setState({ locallyChangedSearchTerm: query });
  };

  onSubmitSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.performSearch(this.state.locallyChangedSearchTerm);
  };

  onClearSearchQuery = () => {
    this.setState({ locallyChangedSearchTerm: '' });
    this.transitionToParams({ query: '' });
  };

  onCloseEdit = (e) => {
    if (e) {
      e.preventDefault();
    }

    this.transitionToParams({ layer: null });
  };

  onEdit = (e) => {
    if (e) {
      e.preventDefault();
    }

    this.transitionToParams({ layer: 'edit' });
  };

  transitionToParams = (values) => {
    const {
      nsParams,
      parentMutator,
    } = this.props;
    const nsValues = mapNsKeys(values, nsParams);

    parentMutator.query.update(nsValues);
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
      packageInfo,
    } = this.props;

    if (onSelectRow) {
      const shouldFallBackToRegularRecordDisplay = onSelectRow(e, meta);

      if (!shouldFallBackToRegularRecordDisplay) {
        return;
      }
    }

    this.setState({ selectedItem: meta });
    this.transitionToParams({ _path: `${packageInfo.stripes.route}/view/${meta.id}` });
  };

  onSort = (e, meta) => {
    const newOrder = meta.alias;
    const oldOrder = this.queryParam('sort');

    const orders = oldOrder ? oldOrder.split(',') : [];

    if (orders[0] && newOrder === orders[0].replace(/^-/, '')) {
      orders[0] = `-${orders[0]}`.replace(/^--/, '');
    } else {
      orders.unshift(newOrder);
    }

    const { maxSortKeys } = this.props;
    const sortOrder = orders.slice(0, maxSortKeys).join(',');

    this.transitionToParams({ sort: sortOrder });
  };

  getRowURL(id) {
    const {
      match: { path },
      location: { search },
    } = this.props;

    return `${path}/view/${id}${search}`;
  }

  addNewRecord = (e) => {
    if (e) {
      e.preventDefault();
    }

    this.transitionToParams({ layer: 'create' });
  };

  anchoredRowFormatter = (row) => {
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

  closeNewRecord = (e) => {
    if (e) {
      e.preventDefault();
    }

    this.transitionToParams({ layer: null });
  };

  collapseDetails = () => {
    const { route } = this.props.packageInfo.stripes;

    this.setState({ selectedItem: {} });
    this.transitionToParams({ _path: `${route}/view` });
  };

  createRecord(record) {
    const {
      massageNewRecord,
      onCreate,
    } = this.props;

    if (massageNewRecord) {
      massageNewRecord(record);
    }

    onCreate(record);
  }

  performSearch = debounce((query) => {
    const {
      parentMutator: { resultCount },
      initialResultCount,
    } = this.props;

    resultCount.replace(initialResultCount);
    this.transitionToParams({ query });
  }, 350);

  queryParam(name) {
    const {
      parentResources: { query },
      nsParams,
    } = this.props;
    const nsKey = getNsKey(name, nsParams);

    return get(query, nsKey);
  }

  toggleHelperApp = (curHelper) => {
    const prevHelper = this.queryParam('helper');
    const helper = prevHelper === curHelper ? null : curHelper;

    this.transitionToParams({ helper });
  };

  toggleTags = () => this.toggleHelperApp('tags');

  getModuleName() {
    const { packageInfo: { name } } = this.props;

    return name.replace(/.*\//, '');
  }

  renderDetailsPane(source) {
    const {
      detailProps,
      browseOnly,
      parentMutator,
      parentResources,
      stripes,
      viewRecordPerms,
      match,
      path,
    } = this.props;

    if (browseOnly) {
      return null;
    }

    if (stripes.hasPerm(viewRecordPerms)) {
      return (
        <Route
          path={path || `${match.path}/view/:id`}
          render={
            props => (
              <this.connectedViewRecord
                stripes={stripes}
                paneWidth="44%"
                parentResources={parentResources}
                connectedSource={source}
                parentMutator={parentMutator}
                tagsToggle={this.toggleTags}
                onClose={this.collapseDetails}
                onEdit={this.onEdit}
                editLink={this.craftLayerUrl('edit')}
                onCloseEdit={this.onCloseEdit}
                {...props}
                {...detailProps}
              />
            )
          }
        />
      );
    }

    return (
      <div
        style={{
          position: 'absolute',
          right: '1rem',
          bottom: '1rem',
          width: '34%',
          zIndex: '9999',
          padding: '1rem',
          backgroundColor: '#fff',
        }}
      >
        <h2><FormattedMessage id="stripes-smart-components.permissionError" /></h2>
        <p><FormattedMessage id="stripes-smart-components.permissionsDoNotAllowAccess" /></p>
      </div>
    );
  }

  renderNewRecordBtn() {
    const {
      newRecordPerms,
      disableRecordCreation,
      objectName,
    } = this.props;

    if (!disableRecordCreation || !newRecordPerms) {
      return null;
    }

    return (
      <IfPermission perm={newRecordPerms}>
        <PaneMenu>
          <FormattedMessage id="stripes-smart-components.addNew">
            {ariaLabel => (
              <Button
                id={`clickable-new${objectName}`}
                href={this.craftLayerUrl('create')}
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
      </IfPermission>
    );
  }

  renderSearch(source) {
    const { locallyChangedSearchTerm } = this.state;
    const {
      objectName,
      onChangeIndex,
      searchableIndexes,
      selectedIndex,
    } = this.props;

    const query = this.queryParam('query') || '';
    const searchTerm = locallyChangedSearchTerm !== undefined ? locallyChangedSearchTerm : query;

    return (
      <form onSubmit={this.onSubmitSearch}>
        <FormattedMessage
          id="stripes-smart-components.searchFieldLabel"
          values={{ moduleName: module.displayName }}
        >
          {ariaLabel => (
            <SearchField
              ariaLabel={ariaLabel}
              id={`input-${objectName}-search`}
              className={css.searchField}
              searchableIndexes={searchableIndexes}
              selectedIndex={selectedIndex}
              value={searchTerm}
              loading={source.pending()}
              marginBottom0
              onChangeIndex={onChangeIndex}
              onChange={this.onChangeSearch}
              onClear={this.onClearSearchQuery}
            />
          )}
        </FormattedMessage>
      </form>
    );
  }

  renderSearchResults(source) {
    const {
      columnMapping,
      columnWidths,
      resultsFormatter,
      visibleColumns,
      notLoadedMessage,
      objectName,
    } = this.props;

    const records = source.records();
    const count = source.totalCount();
    const objectNameUC = upperFirst(objectName);
    const sortOrder = this.queryParam('sort') || '';
    const moduleName = this.getModuleName();

    return (
      <FormattedMessage
        id="stripes-smart-components.searchResults"
        values={{ objectName: objectNameUC }}
      >
        {ariaLabel => (
          <MultiColumnList
            id={`list-${moduleName}`}
            totalCount={count}
            contentData={records}
            selectedRow={this.state.selectedItem}
            formatter={resultsFormatter}
            visibleColumns={visibleColumns}
            sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
            sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
            isEmptyMessage={notLoadedMessage}
            columnWidths={columnWidths}
            columnMapping={columnMapping}
            loading={source.pending()}
            autosize
            virtualize
            ariaLabel={ariaLabel}
            rowFormatter={this.anchoredRowFormatter}
            containerRef={(ref) => { this.resultsList = ref; }}
            onRowClick={this.onSelectRow}
            onHeaderClick={this.onSort}
            onNeedMoreData={this.onNeedMore}
          />
        )}
      </FormattedMessage>
    );
  }

  renderHelperApp() {
    const {
      stripes,
      match: { path },
      getHelperResourcePath,
    } = this.props;

    const moduleName = this.getModuleName();
    const helper = this.queryParam('helper');
    const HelperAppComponent = this.helperApps[helper];

    if (!helper) {
      return null;
    }

    return (
      <Route
        path={`${path}/view/:id`}
        render={props => {
          const { match: { params } } = props;
          const link = getHelperResourcePath
            ? getHelperResourcePath(helper, params.id)
            : `${moduleName}/${params.id}`;

          return (
            <HelperAppComponent
              stripes={stripes}
              link={link}
              onToggle={() => this.toggleHelperApp(helper)}
              {...props}
            />
          );
        }}
      />
    );
  }

  renderCreateRecordLayer(source) {
    const {
      browserOnly,
      parentResources,
      objectName,
      detailProps,
      editRecordComponent,
      newRecordInitialValues,
      stripes,
      parentMutator,
      location: { search },
    } = this.props;

    const EditRecordComponent = editRecordComponent;

    if (browserOnly || !editRecordComponent) {
      return null;
    }

    const urlQuery = queryString.parse(search || '');

    return (
      <Layer isOpen={urlQuery.layer ? urlQuery.layer === 'create' : false}>
        <EditRecordComponent
          stripes={stripes}
          id={`${objectName}form-add${objectName}`}
          initialValues={newRecordInitialValues}
          onSubmit={record => this.createRecord(record)}
          onCancel={this.closeNewRecord}
          parentResources={parentResources}
          connectedSource={source}
          parentMutator={parentMutator}
          {...detailProps}
        />
      </Layer>
    );
  }

  render() {
    const {
      stripes,
      actionMenu,
      module,
      resultCountMessageKey,
    } = this.props;

    const source = makeConnectedSource(this.props, stripes.logger);
    const moduleName = this.getModuleName();
    const appIcon = { app: moduleName };
    const count = source.totalCount();
    const messageKey = resultCountMessageKey || 'stripes-smart-components.searchResultsCountHeader';
    const paneSub = !source.loaded()
      ? <FormattedMessage id="stripes-smart-components.searchCriteria" />
      : <FormattedMessage id={messageKey} values={{ count }} />;

    return (
      <Paneset>
        <SRStatus ref={(ref) => { this.SRStatus = ref; }} />

        <Pane
          padContent={false}
          id="pane-results"
          defaultWidth="fill"
          actionMenu={actionMenu}
          appIcon={appIcon}
          paneTitle={module.displayName}
          paneSub={paneSub}
          lastMenu={this.renderNewRecordBtn()}
          noOverflow
        >
          {this.renderSearch(source)}
          {this.renderSearchResults(source)}
        </Pane>
        {this.renderDetailsPane(source)}
        {this.renderCreateRecordLayer(source)}
        {this.renderHelperApp(source)}
      </Paneset>
    );
  }
}

export default withRouter(
  withModule(
    props => props.packageInfo && props.packageInfo.name
  )(withStripes(SearchAndSort))
);
