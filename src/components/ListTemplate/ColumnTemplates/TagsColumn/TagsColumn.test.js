import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../test/jest/helpers';

import { TagsColumn } from './TagsColumn';

const recordWithTags = { tags: { tagList: ['test1, test2'] } };
const recordWithoutTags = { tags: { tagList: [] } };

const renderTagsColumn = record => {
  const component = (
    <TagsColumn record={record} />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('TagsColumn', () => {
  describe('when tagList is not empty', () => {
    it('tags should be rendered', () => {
      const { getByText } = renderTagsColumn(recordWithTags);

      expect(getByText('test1, test2')).toBeDefined();
    });
  });

  describe('when tagList is empty', () => {
    it('no value should be rendered', () => {
      const { getByText } = renderTagsColumn(recordWithoutTags);

      expect(getByText('-')).toBeDefined();
    });
  });
});
