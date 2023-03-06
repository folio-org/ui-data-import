import React from 'react';
import { noop } from 'lodash';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';


import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { IncomingRecordTrigger } from './IncomingRecordTrigger';

expect.extend(toHaveNoViolations);

const incomingRecordTriggerProps = {
  triggerRef: {},
  ariaProps: {},
  keyHandler: noop,
  onClick: noop,
  captionId: 'ui-data-import.incomingRecordTypes.static',
};

const renderIncomingRecordTrigger = ({
  triggerRef,
  ariaProps,
  keyHandler,
  onClick,
  captionId,
  iconKey,
  isExpanded,
}) => {
  const component = (
    <IncomingRecordTrigger
      triggerRef={triggerRef}
      ariaProps={ariaProps}
      keyHandler={keyHandler}
      onClick={onClick}
      captionId={captionId}
      iconKey={iconKey}
      isExpanded={isExpanded}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('IncomingRecordTrigger', () => {
  describe('when iconKey is given', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderIncomingRecordTrigger({
        ...incomingRecordTriggerProps,
        iconKey: 'test-icon-key',
        isExpanded: false,
      });
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should be rendered title with icon', () => {
      const {
        container,
        getByText,
      } = renderIncomingRecordTrigger({
        ...incomingRecordTriggerProps,
        iconKey: 'test-icon-key',
        isExpanded: false,
      });

      expect(container.querySelector('.appIcon')).toBeDefined();
      expect(getByText('Static value (submatch only)')).toBeDefined();
    });
  });

  describe('when iconKey is not given', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderIncomingRecordTrigger({
        ...incomingRecordTriggerProps,
        iconKey: null,
        isExpanded: true,
      });
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should be rendered title without icon', () => {
      const {
        container,
        getByText,
      } = renderIncomingRecordTrigger({
        ...incomingRecordTriggerProps,
        iconKey: null,
        isExpanded: true,
      });

      expect(container.querySelector('.appIcon')).toBeNull();
      expect(getByText('Static value (submatch only)')).toBeDefined();
    });
  });
});
