import React from 'react';

export const withProfileWrapper = WrappedComponent => props => {
  const {
    // eslint-disable-next-line react/prop-types
    initialValues,
    ...rest
  } = props;

  const newValues = {
    id: initialValues.id,
    profile: initialValues,
    addedRelations: [],
    deletedRelations: [],
  };

  return (
    <WrappedComponent
      initialValues={newValues}
      {...rest}
    />
  );
};
