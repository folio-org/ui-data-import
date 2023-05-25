import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../test/jest/__mock__';

import { Pluggable } from '@folio/stripes/core';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';

import { ProfileLinker } from './ProfileLinker';

const onLink = jest.fn();

const profileLinkerProps = {
  id: 'testId',
  parentType: 'matchProfiles',
  linkingRules: { profilesAllowed: ['matchProfiles', 'actionProfiles'] },
  dataKey: 'testDataKey',
  initialData: [{}],
  setInitialData: jest.fn(),
  okapi: {
    tenant: 'test-tenant',
    token: 'test-token',
    url: 'test-url',
  },
  title: <span>test title</span>,
};

const renderProfileLinker = ({
  id,
  parentType,
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
      profileType="profileType"
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
  afterEach(() => {
    Pluggable.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderProfileLinker(profileLinkerProps);

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered', () => {
    const { getByText } = renderProfileLinker(profileLinkerProps);

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
  });

  it('plugin info should be rendered', async () => {
    const { getAllByText } = renderProfileLinker(profileLinkerProps);

    await Pluggable.mock.calls[0][0].renderTrigger({ buttonRefs: 'asd' });
    await Pluggable.mock.calls[0][0].onLink([{ id: 'testId' }]);

    expect(getAllByText('Find Import Profile Plugin is not available now')).toBeDefined();
  });
});
