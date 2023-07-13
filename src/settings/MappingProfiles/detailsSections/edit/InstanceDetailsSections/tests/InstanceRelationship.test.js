import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { InstanceRelationship } from '../InstanceRelationship';

import { STATUS_CODES } from '../../../../../../utils';
import {
  onAdd,
  onRemove,
} from '../../../utils';

import {
  getInitialDetails,
  getInitialFields,
  getReferenceTables,
} from '../../../../initialDetails';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  onAdd: jest.fn(),
  onRemove: jest.fn(),
}));

global.fetch = jest.fn();

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.INSTANCE.type);
const {
  parentInstances,
  childInstances,
} = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.INSTANCE.type).mappingFields);

const setReferenceTablesMock = jest.fn();
const getRepeatableFieldActionMock = jest.fn(() => 'DELETE_INCOMING');
const okapi = buildOkapi();

const renderInstanceRelationship = ({
  parentInstancesProp = [],
  childInstancesProp = [],
}) => {
  const component = () => (
    <InstanceRelationship
      parentInstances={parentInstancesProp}
      childInstances={childInstancesProp}
      initialFields={initialFieldsProp}
      setReferenceTables={setReferenceTablesMock}
      getRepeatableFieldAction={getRepeatableFieldActionMock}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Instance "Instance relationship" edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: STATUS_CODES.OK,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    setReferenceTablesMock.mockClear();
    getRepeatableFieldActionMock.mockClear();
    onAdd.mockClear();
    onRemove.mockClear();
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const {
      container,
      findByText,
    } = renderInstanceRelationship({
      parentInstancesProp: parentInstances,
      childInstancesProp: childInstances,
    });
    const instanceRelationshipTitle = await findByText('Instance relationship (analytics and bound-with)');

    expect(instanceRelationshipTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByText } = renderInstanceRelationship({
      parentInstancesProp: parentInstances,
      childInstancesProp: childInstances,
    });
    const instanceRelationshipTitle = await findByText('Instance relationship (analytics and bound-with)');

    expect(instanceRelationshipTitle).toBeInTheDocument();
  });

  describe('"Parent instances" field', () => {
    it('User can add parent instance', async () => {
      const {
        findByRole,
        getByText,
      } = renderInstanceRelationship({ parentInstancesProp: parentInstances });

      const addButton = await findByRole('button', { name: /add parent instance/i });

      fireEvent.click(addButton);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('parentInstances');
      expect(getByText('Parent instance')).toBeInTheDocument();
      expect(getByText('Type of relation')).toBeInTheDocument();
    });

    it('User can delete parent instance', async () => {
      const { findByRole } = renderInstanceRelationship({ parentInstancesProp: parentInstances });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(parentInstances);
    });
  });

  describe('"Child instances" field', () => {
    it('User can add child instance', async () => {
      const {
        findByRole,
        getByText,
      } = renderInstanceRelationship({ childInstancesProp: childInstances });

      const addButton = await findByRole('button', { name: /add child instance/i });

      fireEvent.click(addButton);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('childInstances');
      expect(getByText('Child instance')).toBeInTheDocument();
      expect(getByText('Type of relation')).toBeInTheDocument();
    });

    it('User can delete child instance', async () => {
      const { findByRole } = renderInstanceRelationship({ childInstancesProp: childInstances });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(childInstances);
    });
  });
});
