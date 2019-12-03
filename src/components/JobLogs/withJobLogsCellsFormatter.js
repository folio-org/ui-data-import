import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape,
} from 'react-intl';

import { Button } from '@folio/stripes/components';

import { listTemplate } from '../ListTemplate';

import sharedCss from '../../shared.css';

export const withJobLogsCellsFormatter = WrappedComponent => {
  return injectIntl(class extends Component {
    static propTypes = {
      intl: intlShape.isRequired,
      formatter: PropTypes.object,
    };

    static defaultProps = { formatter: {} };

    /**
     * @returns {*}
     */
    render() {
      const {
        intl,
        formatter: externalFormatter,
      } = this.props;

      const formatter = {
        ...externalFormatter,
        ...listTemplate({ intl }),
        fileName: record => (
          <Button
            buttonStyle="link"
            marginBottom0
            to={`/data-import/log/${record.id}`}
            buttonClass={sharedCss.cellLink}
            target="_blank"
          >
            {record.fileName}
          </Button>
        ),
      };

      return (
        <WrappedComponent
          {...this.props}
          formatter={formatter}
        />
      );
    }
  });
};
