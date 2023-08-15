import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import { RecordNumberCell } from '../RecordNumberCell';

const renderRecordNumberCell = (isEdifactType) => {
  const component = (
    <RecordNumberCell
      isEdifactType={isEdifactType}
      sourceRecordOrder={1}
    />
  );

  return render(component);
};

describe('RecordNumberCell component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderRecordNumberCell(true);

    await runAxeTest({ rootNode: container });
  });

  describe('when is EDIFACT type', () => {
    it('should display order as it is', () => {
      const { getByText } = renderRecordNumberCell(true);

      expect(getByText('1')).toBeInTheDocument();
    });
  });

  describe('when is MARC type', () => {
    it('should display incremented order', () => {
      const { getByText } = renderRecordNumberCell(false);

      expect(getByText('2')).toBeInTheDocument();
    });
  });
});
