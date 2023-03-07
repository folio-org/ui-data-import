import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { CodeHighlight } from './CodeHighlight';
import * as Languages from './Languages';

const { LANGUAGES } = Languages;

const renderCodeHighlight = ({
  usePre = false,
  language = LANGUAGES.RAW,
  code = 'test',
}) => {
  return render(
    <CodeHighlight
      code={code}
      usePre={usePre}
      language={language}
    />,
  );
};

const testItem = {
  id: 'testId',
  snapshotId: 'testSnapshotId',
  matchedId: 'testMatchedId',
  recordType: 'testRecordType',
  order: 0,
  deleted: false,
  parsedRecord: null,
};

describe('CodeHighlight component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderCodeHighlight({});
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should be rendered', () => {
    const { getByText } = renderCodeHighlight({});

    expect(getByText('test')).toBeDefined();
  });

  describe('when `usePre` prop is true', () => {
    it('then component should be wrapped in `pre` tag', () => {
      const { container } = renderCodeHighlight({ usePre: true });

      expect(container.firstChild.classList.contains('coy')).toBe(true);
    });
  });

  describe('when `language` prop is MARC', () => {
    it('then component should be rendered', () => {
      const { getByText } = renderCodeHighlight({ language: LANGUAGES.MRC });

      expect(getByText('test')).toBeDefined();
    });
  });

  describe('when `language` prop is JSON and code is in JSON format', () => {
    it('then component should be rendered', () => {
      const { getByText } = renderCodeHighlight({
        language: LANGUAGES.JSON,
        code: testItem,
      });

      expect(getByText('"testRecordType"')).toBeDefined();
    });
  });
});
