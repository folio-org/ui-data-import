import React, {
  Component,
  Fragment,
} from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes-core';
import {
  getNsKey,
  makeQueryFunction,
} from '@folio/stripes-smart-components';

import { STRING_CAPITALIZATION_MODES } from '../../utils/constants';
import { capitalize } from '../../utils';
import { AssociatorStatic } from './AssociatorStatic';
import { AssociatorEditable } from './AssociatorEditable';

export const createProfileAssociator = props => {
  const {
    entityKey,
    namespaceKey,
    masterType,
    parentType,
    detailType,
  } = props;

  const entity = `associated${capitalize(entityKey, STRING_CAPITALIZATION_MODES.FIRST)}`;
  const nsSort = getNsKey('sort', namespaceKey);
  const nsQuery = getNsKey('query', namespaceKey);
  const initialQuery = {
    [nsSort]: 'name',
    [nsQuery]: '',
  };

  @withRouter
  @stripesConnect
  class ProfileAssociatorComponent extends Component {
    static propTypes = {
      record: PropTypes.object,
      dataAttributes: PropTypes.shape(PropTypes.object),
      isMultiSelect: PropTypes.bool,
      isMultiLink: PropTypes.bool,
      resources: PropTypes.shape({
        query: PropTypes.object.isRequired,
        associatedProfiles: PropTypes.shape({
          hasLoaded: PropTypes.bool.isRequired,
          records: PropTypes.arrayOf(PropTypes.object),
        }),
      }).isRequired,
      mutator: PropTypes.shape({ query: PropTypes.object.isRequired }).isRequired,
      history: PropTypes.shape({ push: PropTypes.func.isRequired }),
    };

    static defaultProps = {
      record: null,
      dataAttributes: null,
      isMultiSelect: true,
      isMultiLink: true,
    };

    static manifest = Object.freeze({
      initializedFilterConfig: { initialValue: false },
      query: { initialValue: initialQuery },
      [entity]: {
        type: 'okapi',
        path: `data-import-profiles/profileAssociations/:{id}/${masterType === parentType ? 'details' : 'masters'}`,
        throwErrors: false,
        GET: {
          params: {
            masterType,
            detailType,
            query: makeQueryFunction(
              'cql.allRecords=1',
              '(name="%{query.query}*" OR tags.tagList="%{query.query}*")',
              {
                name: 'name',
                tags: 'tags.tagList',
                updated: 'metadata.updatedDate',
                updatedBy: 'userInfo.firstName userInfo.lastName userInfo.userName',
              },
              [],
              0,
              namespaceKey,
            ),
          },
          staticFallback: { params: {} },
        },
      },
    });

    componentDidMount() {
      this.props.mutator.query.update(initialQuery);
    }

    get profiles() {
      return get(this.props, ['resources', entity, 'records', 0, 'childSnapshotWrappers'], [])
        .map(({ content }) => content);
    }

    get profilesLoaded() {
      return get(this.props, ['resources', entity, 'hasLoaded'], false);
    }

    render() {
      const {
        resources: { query },
        mutator,
        record,
        isMultiSelect,
        isMultiLink,
        dataAttributes,
        history,
      } = this.props;

      return (
        <Fragment>
          {record ? (
            <AssociatorStatic
              entityKey={entityKey}
              namespaceKey={namespaceKey}
              record={record}
              mutator={mutator}
              nsSort={nsSort}
              nsQuery={nsQuery}
              initialQuery={initialQuery}
              query={query}
              contentData={this.profiles}
              hasLoaded={this.profilesLoaded}
              dataAttributes={dataAttributes}
              history={history}
              isMultiSelect={isMultiSelect}
            />
          ) : (
            <AssociatorEditable
              entityKey={entityKey}
              parentType={parentType}
              isMultiSelect={isMultiSelect}
              isMultiLink={isMultiLink}
              nsSort={nsSort}
              nsQuery={nsQuery}
              initialQuery={initialQuery}
              query={query}
              contentData={this.profiles}
              hasLoaded={this.profilesLoaded}
              dataAttributes={dataAttributes}
            />
          )}
        </Fragment>
      );
    }
  }

  return ProfileAssociatorComponent;
};
