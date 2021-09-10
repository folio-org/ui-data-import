import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { ProfileLabel } from './ProfileLabel';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  ConfirmationModal: jest.fn(({
    open,
    onCancel,
    onConfirm,
  }) => (open ? (
    <div>
      <span>Confirmation modal</span>
      <button
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="button"
        id="confirmButton"
        onClick={onConfirm}
      >
        Confirm
      </button>
    </div>
  ) : null)),
}));

const profileLabelProps = ({
  allowUnlink,
  allowDelete,
  record,
}) => {
  return {
    linkingRules: {
      columnsAllowed: {
        matchProfiles: ['name', 'match'],
        actionProfiles: ['name', 'action'],
      },
      allowUnlink,
      allowDelete,
    },
    recordData: {
      contentType: 'matchProfile',
      content: {
        id: 'testId',
        name: 'testName',
      },
      childSnapshotWrappers: [{ contentType: 'mapping-profiles' }],
    },
    parentRecordData: {
      contentType: 'INVOICE',
      profileId: '448ae575-daec-49c1-8041-d64c8ed8e5b1',
    },
    parentSectionKey: 'jobProfiles.current',
    parentSectionData: [{}],
    setParentSectionData: jest.fn(),
    resources: {},
    label: 'test label',
    currentProfilesRelationTypes: 'ROOT',
    record,
  };
};

const renderProfileLabel = ({
  linkingRules,
  recordData,
  parentRecordData,
  parentSectionKey,
  parentSectionData,
  setParentSectionData,
  resources,
  label,
  record,
}) => {
  const component = (
    <ProfileLabel
      linkingRules={linkingRules}
      recordData={recordData}
      parentRecordData={parentRecordData}
      parentSectionKey={parentSectionKey}
      parentSectionData={parentSectionData}
      setParentSectionData={setParentSectionData}
      resources={resources}
      label={label}
      record={record}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ProfileLabel', () => {
  describe('when unlink is allowed', () => {
    it('should be rendered unlink button', () => {
      const { container } = renderProfileLabel(profileLabelProps({
        allowUnlink: true,
        allowDelete: false,
        record: null,
      }));
      const unlinkButton = container.querySelector('[data-test-profile-unlink="true"]');

      expect(unlinkButton).toBeDefined();
    });
  });

  describe('when clicking on unlink icon', () => {
    it('unlink modal window should be rendered', () => {
      const {
        container,
        getByText,
      } = renderProfileLabel(profileLabelProps({
        allowUnlink: true,
        allowDelete: false,
        record: null,
      }));
      const unlinkButton = container.querySelector('[data-test-profile-unlink="true"]');

      fireEvent.click(unlinkButton);

      expect(getByText('Confirmation modal')).toBeDefined();
    });

    describe('when clicking on Cancel button', () => {
      it('unlink modal window should be closed', () => {
        const {
          container,
          getByText,
          queryByText,
        } = renderProfileLabel(profileLabelProps({
          allowUnlink: true,
          allowDelete: false,
          record: null,
        }));
        const unlinkButton = container.querySelector('[data-test-profile-unlink="true"]');

        fireEvent.click(unlinkButton);

        const cancel = getByText('Cancel');

        fireEvent.click(cancel);

        expect(queryByText('Confirmation modal')).toBeNull();
      });
    });

    describe('when clicking on Confirm button', () => {
      it('unlink modal window should be closed', () => {
        const {
          container,
          queryByText,
        } = renderProfileLabel(profileLabelProps({
          allowUnlink: true,
          allowDelete: false,
          record: null,
        }));
        const unlinkButton = container.querySelector('[data-test-profile-unlink="true"]');

        fireEvent.click(unlinkButton);

        const unlink = container.querySelector('#confirmButton');

        fireEvent.click(unlink);

        expect(queryByText('Confirmation modal')).toBeNull();
      });
    });
  });

  describe('when clicking on Delete icon', () => {
    it('unlink modal window should be rendered', () => {
      const {
        container,
        getByText,
      } = renderProfileLabel(profileLabelProps({
        allowUnlink: false,
        allowDelete: true,
        record: null,
      }));
      const deleteButton = container.querySelector('[data-test-profile-delete="true"]');

      fireEvent.click(deleteButton);

      expect(getByText('Confirmation modal')).toBeDefined();
    });

    describe('when clicking on Cancel button', () => {
      it('unlink modal window should be closed', () => {
        const {
          container,
          getByText,
          queryByText,
        } = renderProfileLabel(profileLabelProps({
          allowUnlink: false,
          allowDelete: true,
          record: null,
        }));
        const deleteButton = container.querySelector('[data-test-profile-delete="true"]');

        fireEvent.click(deleteButton);

        const cancel = getByText('Cancel');

        fireEvent.click(cancel);

        expect(queryByText('Confirmation modal')).toBeNull();
      });
    });

    describe('when clicking on Confirm button', () => {
      it('unlink modal window should be closed', () => {
        const {
          container,
          queryByText,
        } = renderProfileLabel(profileLabelProps({
          allowUnlink: false,
          allowDelete: true,
          record: null,
        }));
        const deleteButton = container.querySelector('[data-test-profile-delete="true"]');

        fireEvent.click(deleteButton);

        const deleteModalButton = container.querySelector('#confirmButton');

        fireEvent.click(deleteModalButton);

        expect(queryByText('Confirmation modal')).toBeNull();
      });
    });
  });
});