import {
  useCallback,
  useEffect,
  useRef,
} from 'react';

import {
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react';

import { useForceUpdate } from '../useForceUpdate';

const TestComponent = () => {
  const forceUpdate = useForceUpdate();
  const count = useRef(0);

  useEffect(() => {
    count.current++;
  });

  const handleClick = useCallback(() => {
    forceUpdate();
  }, [forceUpdate]);

  return (
    <>
      <span>Count: {count.current}</span>
      <button
        type="button"
        onClick={handleClick}
      >
        Force update
      </button>
    </>
  );
};

describe('useForceUpdate hook', () => {
  it('forces a component to re-render', async () => {
    const {
      getByText,
      getByRole,
    } = render(<TestComponent />);

    expect(getByText('Count: 0')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: 'Force update' }));

    await waitFor(() => expect(getByText('Count: 1')).toBeInTheDocument());
  });
});
