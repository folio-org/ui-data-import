import React from 'react';
import { render } from '@testing-library/react';
import '../../../test/jest/__mock__';

import { searchAndSortTemplate } from './searchAndSortTemplate';

jest.mock('./ColumnTemplates', () => ({ createActionLabel: () => <span>action label</span> }));

const intl = {
  formatMessage: () => 'test message',
  formatDate: () => '2021-03-31',
  formatTime: () => 'time',
};

const template = searchAndSortTemplate(intl);

const testRecord = {
  name: 'test name',
  description: 'test description',
  existingRecordType: 'INSTANCE',
  matchDetails: [
    {
      existingMatchExpression: {
        fields: [
          {
            label: 'field',
            value: 'instance.id',
          },
        ],
      },
    },
  ],
  extension: 'test extension',
  mapping: 'test mapping',
  importBlocked: false,
  tags: { tagList: ['tag1, tag2'] },
  userInfo: {
    firstName: 'firstName',
    lastName: 'lastName',
    userName: 'userName',
  },
  firstName: 'firstName',
  lastName: 'lastName',
  completedDate: '2021-03-31',
  jobProfileInfo: { name: 'test name' },
  progress: {
    current: 0,
    total: 0,
  },
  fileName: 'test name',
  id: 'testId1',
  dataTypes: '',
  metadata: { updatedDate: '2021-03-31' },
  status: 'COMMITTED',
  runBy: {
    firstName: 'firstName',
    lastName: 'lastName',
  },
};

describe('Search And Sort Template', () => {
  describe('when field is `name`', () => {
    it('then apropriate text should be rendered', () => {
      const { getByText } = render(template.name(testRecord));

      expect(getByText('test name')).toBeDefined();
    });
  });

  describe('when field is `description`', () => {
    it('then apropriate text should be rendered', () => {
      const { getByText } = render(template.description(testRecord));

      expect(getByText('test description')).toBeDefined();
    });
  });

  describe('when field is `match`', () => {
    afterEach(() => {
      document.dir = 'ltr';
    });

    describe('and direction is `LEFT_TO_RIGHT`', () => {
      it('then apropriate text should be rendered', () => {
        const { getByText } = render(template.match(testRecord));

        expect(getByText('Instance.id Instance test message')).toBeDefined();
      });

      describe('and fields `existingMatchExpression` is empty', () => {
        const testRecordWithotExistingMatchExpressionFields = {
          ...testRecord,
          matchDetails: [{ existingMatchExpression: { fields: [{}] } }],
        };

        it('then apropriate text should be rendered', () => {
          const { getByText } = render(template.match(testRecordWithotExistingMatchExpressionFields));

          expect(getByText('test message Instance undefined')).toBeDefined();
        });
      });
    });

    describe('and direction is `RIGHT_TO_LEFT`', () => {
      document.dir = 'rtl';

      it('then apropriate text should be rendered', () => {
        const { getByText } = render(template.match(testRecord));

        expect(getByText('test message Instance test message')).toBeDefined();
      });
    });
  });

  describe('when field is `extension`', () => {
    it('then apropriate text should be rendered', () => {
      const { getByText } = render(template.extension(testRecord));

      expect(getByText('test extension')).toBeDefined();
    });
  });

  describe('when field is `action`', () => {
    it('then apropriate text should be rendered', () => {
      const { getByText } = render(template.action(testRecord));

      expect(getByText('action label')).toBeDefined();
    });
  });

  describe('when field is `mapping`', () => {
    describe('and mapping exists in record', () => {
      it('then apropriate text should be rendered', () => {
        const { getByText } = render(template.mapping(testRecord));

        expect(getByText('test mapping')).toBeDefined();
      });
    });

    describe('and mapping do not exist in record', () => {
      const testRecorsWithotMapping = { ...testRecord };

      delete testRecorsWithotMapping.mapping;

      it('then text should not been rendered', () => {
        const { container } = render(template.mapping(testRecorsWithotMapping));

        expect(container.innerHTML).toHaveLength(0);
      });
    });
  });

  describe('when field is `folioRecord`', () => {
    it('then apropriate text should be rendered', () => {
      const { getByText } = render(template.folioRecord(testRecord));

      expect(getByText('test message')).toBeDefined();
    });
  });

  describe('when field is `dataTypes`', () => {
    describe('and `dataTypes` field in record  is empty', () => {
      it('then apropriate text should be rendered', () => {
        const { container } = render(template.dataTypes(testRecord));

        expect(container.innerHTML).toHaveLength(0);
      });
    });

    describe('and `dataTypes` field in record is array of types', () => {
      const testRecordWithDataTypes = {
        ...testRecord,
        dataTypes: ['test type'],
      };

      it('then apropriate text should be rendered', () => {
        const { getByText } = render(template.dataTypes(testRecordWithDataTypes));

        expect(getByText('test type')).toBeDefined();
      });
    });
  });

  describe('when field is `importBlocked`', () => {
    it('then apropriate text should be rendered', () => {
      const { getByText } = render(template.importBlocked(testRecord));

      expect(getByText('test message')).toBeDefined();
    });
  });

  describe('when field is `tags`', () => {
    describe('and tags exists in record', () => {
      it('then apropriate text should be rendered', () => {
        const { getByText } = render(template.tags(testRecord));

        expect(getByText('tag1, tag2')).toBeDefined();
      });
    });

    describe('and tags do not exist in record', () => {
      const testRecorsWithotTags = { ...testRecord };

      delete testRecorsWithotTags.tags;

      it('then text should not been rendered', () => {
        const { container } = render(template.tags(testRecorsWithotTags));

        expect(container.innerHTML).toHaveLength(0);
      });
    });
  });

  describe('when field is `updated`', () => {
    it('then apropriate text should be rendered', () => {
      const { getByText } = render(template.updated(testRecord));

      expect(getByText('2021-03-31')).toBeDefined();
    });
  });

  describe('when field is `updatedBy`', () => {
    it('then apropriate text should be rendered', () => {
      const { getByText } = render(template.updatedBy(testRecord));

      expect(getByText('firstName lastName (@userName)')).toBeDefined();
    });
  });

  describe('when field is `runBy`', () => {
    it('then apropriate text should be rendered', () => {
      const { getByText } = render(template.runBy(testRecord));

      expect(getByText('firstName lastName')).toBeDefined();
    });
  });

  describe('when field is `completedDate`', () => {
    it('then apropriate text should be rendered', () => {
      const { getByText } = render(template.completedDate(testRecord));

      expect(getByText('time')).toBeDefined();
    });
  });

  describe('when field is `jobProfileName`', () => {
    it('then apropriate text should be rendered', () => {
      const { getByText } = render(template.jobProfileName(testRecord));

      expect(getByText('test name')).toBeDefined();
    });
  });

  describe('when field is `totalRecords`', () => {
    it('then apropriate text should be rendered', () => {
      const { getByText } = render(template.totalRecords(testRecord));

      expect(getByText('0')).toBeDefined();
    });
  });

  describe('when field is `fileName`', () => {
    it('then apropriate text should be rendered', () => {
      const { getByText } = render(template.fileName(testRecord));

      expect(getByText('test name')).toBeDefined();
    });
  });
});
