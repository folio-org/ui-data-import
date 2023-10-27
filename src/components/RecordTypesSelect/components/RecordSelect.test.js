import React from 'react';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { RecordSelect } from './RecordSelect';

const spyOnCheckIfUserInCentralTenant = jest.spyOn(require('@folio/stripes/core'), 'checkIfUserInCentralTenant');

const renderRecordSelect = ({ isLocalLTR }) => {
  const component = (
    <RecordSelect
      onSelect={noop}
      id="testId"
      isLocalLTR={isLocalLTR}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('RecordSelect component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderRecordSelect({ isLocalLTR: false });

    await runAxeTest({ rootNode: container });
  });

  describe('when user is non-consortial tenant', () => {
    it('should render all record types', () => {
      const { getByText } = renderRecordSelect({ isLocalLTR: false });

      expect(getByText('Instance')).toBeInTheDocument();
      expect(getByText('Holdings')).toBeInTheDocument();
      expect(getByText('Item')).toBeInTheDocument();
      expect(getByText('MARC Bibliographic')).toBeInTheDocument();
      expect(getByText('MARC Authority')).toBeInTheDocument();
    });
  });

  describe('when user is in central tenant', () => {
    it('should render "Instance", "MARC Bibliographic" and "MARC Authority" record types', () => {
      spyOnCheckIfUserInCentralTenant.mockReturnValue(true);

      const {
        getByText,
        queryByText,
      } = renderRecordSelect({ isLocalLTR: false });

      expect(queryByText('Holdings')).not.toBeInTheDocument();
      expect(queryByText('Item')).not.toBeInTheDocument();

      expect(getByText('Instance')).toBeInTheDocument();
      expect(getByText('MARC Bibliographic')).toBeInTheDocument();
      expect(getByText('MARC Authority')).toBeInTheDocument();
    });
  });

  describe('when user is in member tenant', () => {
    it('should render all record types', () => {
      spyOnCheckIfUserInCentralTenant.mockReturnValue(false);

      const { getByText } = renderRecordSelect({ isLocalLTR: false });

      expect(getByText('Instance')).toBeInTheDocument();
      expect(getByText('Holdings')).toBeInTheDocument();
      expect(getByText('Item')).toBeInTheDocument();
      expect(getByText('MARC Bibliographic')).toBeInTheDocument();
      expect(getByText('MARC Authority')).toBeInTheDocument();
    });
  });

  describe('when current language is RTL', () => {
    it('direction should be rendered correctly', () => {
      const { container } = renderRecordSelect({ isLocalLTR: false });

      expect(container.querySelector('treeViewRTL')).toBeDefined();
    });
  });

  describe('when current language is LTR', () => {
    it('direction should be rendered correctly', () => {
      const { container } = renderRecordSelect({ isLocalLTR: true });

      expect(container.querySelector('treeViewLTR')).toBeDefined();
    });
  });
});
