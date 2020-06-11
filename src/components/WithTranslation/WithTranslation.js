import { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import {
  isFormattedMessage,
  isTranslationId,
} from '../../utils';

@injectIntl
export class WithTranslation extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.func,
    ]).isRequired,
    wrapperLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const {
      intl,
      wrapperLabel,
    } = this.props;

    const needsTranslation = wrapperLabel && !isFormattedMessage(wrapperLabel) && isTranslationId(wrapperLabel);
    const label = needsTranslation ? intl.formatMessage({ id: wrapperLabel }) : wrapperLabel;

    return this.props.children(label);
  }
}
