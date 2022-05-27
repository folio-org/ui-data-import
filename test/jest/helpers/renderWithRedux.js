import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

export const renderWithRedux = (children, initialStateValues = {}) => {
  const reducer = (state = initialStateValues) => state;
  const store = createStore(reducer);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};
