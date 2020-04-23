import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import * as stripesComponents from '@folio/stripes/components';
import * as stripesSmartComponents from '@folio/stripes/smart-components';
import * as components from '../..';

const controls = {
  FormattedMessage,
  Fragment,
  Field,
  ...stripesComponents,
  ...stripesSmartComponents,
};

export const getControl = controlType => components[controlType] || controls[controlType] || controlType;
