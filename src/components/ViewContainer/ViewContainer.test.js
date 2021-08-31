import React, { forwardRef } from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { renderWithReduxForm, translationsProperties } from '../../../test/jest/helpers';

import { ViewContainer } from './ViewContainer';
import { screen, render } from '@testing-library/react';

// jest.mock('@folio/stripes/components', () => {
//   const MockedCallOut = forwardRef((props, ref) => {
//     return <div>Callout</div>;
//   });
//   return {
//     ...jest.requireActual('@folio/stripes/components'),
//     Callout: MockedCallOut,
//   };
// });

const viewContainerProps = {
  entityKey: 'test-jobProfiles',
  children: (props) => {
    return JSON.stringify(props);
  },
  mutator: {},
  location: '',
  history: { push: () => {} },
  match: { path: '/' },
  selectedRecords: new Set(),
  selectRecord: () => {},
};

const renderViewContainer = (props) => {
  const component = () => <ViewContainer {...props} />;

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('ViewContainer Component', () => {
  it('should have not an element with ref attritube', () => {
    const { container } = render(<ViewContainer {...viewContainerProps} />);
    const elementWithRefAttr = container.querySelector('[ref]');
    expect(elementWithRefAttr).toBeNull();
  });
  it('should not render ExceptionModal component by default (renders only when an error occurs)', () => {
    // arrange
    const { container } = renderViewContainer(viewContainerProps);
    // act
    const exceptionModalDiv = container.querySelector('#delete-test-jobProfiles-exception-modal');
    // assert
    expect(exceptionModalDiv).toBeNull();
  });

  it("should have 'fullWidthAndHeightContainer' class", () => {
    const { container } = renderViewContainer(viewContainerProps);
    // act
    const fullWidthAndHeightContainerClass = container.querySelector('.fullWidthAndHeightContainer');
    // assert
    expect(fullWidthAndHeightContainerClass).toBeInTheDocument();
  });
});
