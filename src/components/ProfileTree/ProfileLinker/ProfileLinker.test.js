import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { ProfileLinker } from './ProfileLinker';

const profileLinkerProps = {
  id: 'testId',
  parentType: 'jobProfiles',
  onLink: jest.fn(),
  linkingRules: {
    profilesAllowed: [
      'matchProfiles',
      'actionProfiles',
    ]
  },
  dataKey: 'testDataKey',
  initialData: [{}],
  setInitialData: jest.fn(),
  okapi: {
    tenant: 'test-tenant',
    token: 'test-token',
    url: 'test-url',
  },
};

const renderProfileLinker = ({
  id,
  parentType,
  onLink,
  linkingRules,
  dataKey,
  initialData,
  setInitialData,
  okapi,
}) => {
  const component = (
    <ProfileLinker
      id={id}
      parentType={parentType}
      onLink={onLink}
      linkingRules={linkingRules}
      dataKey={dataKey}
      initialData={initialData}
      setInitialData={setInitialData}
      okapi={okapi}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ProfileLinker', () => {
  it('should be rendered', () => {
    const { debug } = renderProfileLinker(profileLinkerProps);
    debug();
  });

  describe('when clicking on plus icon', () => {
   /*  it('should be changed the state', () => {
      const { getByText, debug } = renderProfileLinker(profileLinkerProps);

      fireEvent.click(getByText('Icon'));
      debug();
    }); */

    describe('when click on dropdown', () => {
      it('should click on item', () => {
        const { container, getByText, debug } = renderProfileLinker(profileLinkerProps);
        
        fireEvent.click(getByText('Icon'));

        expect(getByText('Action')).toBeVisible();
debug();
       // const elem = container.querySelector('#menu-link-match-type-selector-menu-testId-button-find-import-profile-matchProfiles');
        fireEvent.click(getByText('Icon'));

        const elem = container.querySelector('#menu-link-match-type-selector-menu-testId-button-find-import-profile-matchProfiles');
        fireEvent.click(elem);
       /*  debug();
        fireEvent.click(getByText('Icon'));

        expect(getByText('Action')).not.toBeVisible();
        debug(); */
      });
    });
  });
});