import React, { createRef } from 'react';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { IncomingRecordTrigger } from './IncomingRecordTrigger';

const incomingRecordTriggerProps = {
  triggerRef: createRef(),
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

describe('IncomingRecordTrigger component', () => {
  describe('when iconKey is given', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderIncomingRecordTrigger({
        ...incomingRecordTriggerProps,
        iconKey: 'test-icon-key',
        isExpanded: false,
      });

      await runAxeTest({ rootNode: container });
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

      await runAxeTest({ rootNode: container });
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
