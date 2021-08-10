import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { ProfileLinker } from './ProfileLinker';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: jest.fn(({ onLink, renderTrigger }) =>
    <span
      onLink={onLink}
      renderTrigger={renderTrigger}
    >
      test
    </span>),
}));

const profileLinkerProps = {
  id: 'testId',
  parentType: 'jobProfiles',
  onLink: jest.fn(),
  linkingRules: { profilesAllowed: ['matchProfiles', 'actionProfiles'] },
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
    const { getByText, debug } = renderProfileLinker(profileLinkerProps);


    expect(getByText('Click here to get started')).toBeDefined();
  });

  describe('when clicking on linker button', () => {
    it('dropdown should be expanded', () => {
      const { getByText } = renderProfileLinker(profileLinkerProps);

      fireEvent.click(getByText('Icon'));

      expect(getByText('Match')).toBeDefined();
      expect(getByText('Action')).toBeDefined();
    });

    it('dropdown should be collapsed', () => {
      const { getByText } = renderProfileLinker(profileLinkerProps);

      fireEvent.click(getByText('Icon'));
      fireEvent.click(getByText('Icon'));

      expect(getByText('Match')).not.toBeVisible();
      expect(getByText('Action')).not.toBeVisible();
    });

    describe('when clicking on Match option', () => {
      it('modal window should appear', () => {
        const { container, getByText, debug } = renderProfileLinker(profileLinkerProps);

        fireEvent.click(getByText('Icon'));

        expect(getByText('Match')).toBeDefined();
        fireEvent.click(container.querySelector('[data-test-no-plugin-available="true"]'));
        console.log(container.querySelector('[data-test-no-plugin-available="true"]'));

        fireEvent.click(getByText('Match'));
      });
    });
  });
});
