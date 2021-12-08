import React, { useState } from 'react';
import {
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react';
import { usePrevious } from '../hooks';

function TestComponent() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  const isPrevExist = prevCount !== null && prevCount !== undefined;

  return (
    <>
      <span>Previous: {isPrevExist ? prevCount : 'No previous count'}</span>
      <span>Current: {count}</span>
      <button
        type="button"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </>
  );
}

describe('usePrevious hook', () => {
  it('returns "null" during first call', () => {
    const { getByText } = render(<TestComponent />);

    expect(getByText('Previous: No previous count')).toBeInTheDocument();
  });

  it('returns correct previous value', async () => {
    const {
      getByRole,
      getByText,
      queryByText,
    } = render(<TestComponent />);

    expect(queryByText('Previous: 0')).not.toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: 'Increment' }));

    await waitFor(() => expect(getByText('Previous: 0')).toBeInTheDocument());
  });
});
