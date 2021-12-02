import * as React from 'react';
import { render } from '@testing-library/react';
import { withProfileWrapper } from '../withProfileWrapper';

describe('withProfileWrapper HOC', () => {
  it('returns wrapped component with passed props', () => {
    const TestComponent = jest.fn(props => (
      <span style={{ color: props.color }}>
        WrappedComponent
      </span>
    ));
    const WrappedComponent = withProfileWrapper(TestComponent);
    const { getByText } = render(
      <WrappedComponent
        color="blue"
        initialValues={{ id: 'testId' }}
      />,
    );

    expect(getByText('WrappedComponent')).toBeInTheDocument();
    expect(getByText('WrappedComponent')).toHaveStyle({ color: 'blue' });
    expect(TestComponent).toHaveBeenCalledWith({
      initialValues: {
        id: 'testId',
        addedRelations: [],
        deletedRelations: [],
        profile: { id: 'testId' },
      },
      color: 'blue',
    }, expect.anything());
  });
});
