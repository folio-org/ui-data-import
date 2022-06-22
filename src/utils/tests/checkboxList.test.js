import * as React from 'react';
import {
  render,
  waitFor,
} from '@testing-library/react';

import {
  useCheckboxList,
  withCheckboxList,
} from '../checkboxList';

function setup(...args) {
  const returnVal = {};

  function TestComponent() {
    Object.assign(returnVal, useCheckboxList(...args));

    return null;
  }
  render(<TestComponent />);

  return returnVal;
}

describe('useCheckboxList hook', () => {
  const list = [{ id: '#id1' }, { id: '#id2' }];

  it('returns correct values initially', () => {
    const checkboxList = setup();

    expect(checkboxList.selectedRecords.size).toBe(0);
    expect(checkboxList.isAllSelected).toBe(false);
  });

  it('allows select record', async () => {
    const checkboxList = setup(list);

    await waitFor(() => checkboxList.selectRecord(list[0].id));

    expect(checkboxList.selectedRecords.size).toBe(1);
    expect(checkboxList.selectedRecords.has(list[0].id)).toBeTruthy();
  });

  describe('upon selecting a record', () => {
    describe('if that record already exists in selected records', () => {
      it('that record is removed from selected records', async () => {
        const checkboxList = setup(list);

        await waitFor(() => checkboxList.selectRecord(list[1].id));

        expect(checkboxList.selectedRecords.has(list[1].id)).toBeTruthy();

        await waitFor(() => checkboxList.selectRecord(list[1].id));

        expect(checkboxList.selectedRecords.has(list[1].id)).toBeFalsy();
      });
    });
  });

  it('allows select all', async () => {
    const checkboxList = setup(list);

    await waitFor(() => checkboxList.selectAll());

    expect(checkboxList.selectedRecords.size).toBe(list.length);
    expect(checkboxList.selectedRecords.has(list[0].id)).toBeTruthy();
    expect(checkboxList.selectedRecords.has(list[1].id)).toBeTruthy();
  });

  it('allows deselect all', async () => {
    const checkboxList = setup(list);

    await waitFor(() => checkboxList.selectAll());

    expect(checkboxList.selectedRecords.size).toBe(list.length);

    await waitFor(() => checkboxList.deselectAll());

    expect(checkboxList.selectedRecords.size).toBe(0);
  });

  describe('handles toggling all via "checkbox"', () => {
    describe('when "checkbox" is checked', () => {
      it('all records are checked', async () => {
        const checkboxList = setup(list);

        await waitFor(() => checkboxList.handleSelectAllCheckbox({ target: { checked: true } }));

        expect(checkboxList.selectedRecords.size).toBe(list.length);
      });
    });

    describe('when "checkbox" is unchecked', () => {
      it('all records are unchecked', async () => {
        const checkboxList = setup(list);

        await waitFor(() => checkboxList.handleSelectAllCheckbox({ target: { checked: false } }));

        expect(checkboxList.selectedRecords.size).toBe(0);
      });
    });
  });
});

describe('withCheckboxList HOC', () => {
  it('returns wrapped component with passed props', () => {
    const TestComponent = props => <span style={{ color: props.color }}>TestComponent</span>;
    const WrappedComponent = withCheckboxList()(TestComponent);
    const { getByText } = render(<WrappedComponent color="red" />);

    expect(getByText('TestComponent')).toBeInTheDocument();
    expect(getByText('TestComponent')).toHaveStyle({ color: 'red' });
  });
});
