import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';
import '../../../../../test/jest/__mock__';

import { IncomingSectionStatic } from './IncomingSectionStatic';

const incomingSectionStaticWithText = {
  staticValueDetails: {
    staticValueType: 'TEXT',
    text: 'test text',
  },
};
const incomingSectionStaticWithoutText = {
  staticValueDetails: {
    staticValueType: 'TEXT',
    text: '',
  },
};
const incomingSectionStaticWithNumber = {
  staticValueDetails: {
    staticValueType: 'NUMBER',
    number: 'test text',
  },
};
const incomingSectionStaticWithoutNumber = {
  staticValueDetails: {
    staticValueType: 'NUMBER',
    number: '',
  },
};
const incomingSectionStaticWithDate = {
  staticValueDetails: {
    staticValueType: 'EXACT_DATE',
    exactDate: '12/31/2010',
  },
};
const incomingSectionStaticWithoutDate = {
  staticValueDetails: {
    staticValueType: 'EXACT_DATE',
    exactDate: '',
  },
};
const incomingSectionStaticWithDateRange = {
  staticValueDetails: {
    staticValueType: 'DATE_RANGE',
    fromDate: '12/31/2010',
    toDate: '12/31/2011',
  },
};
const incomingSectionStaticWithoutDateRange = {
  staticValueDetails: {
    staticValueType: 'DATE_RANGE',
    fromDate: '',
    toDate: '',
  },
};
const emptyIncomingSectionStatic = { staticValueDetails: null };

const renderIncomingSectionStatic = ({ staticValueDetails }) => {
  const component = (
    <IncomingSectionStatic
      staticValueDetails={staticValueDetails}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('IncomingSectionStatic view component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderIncomingSectionStatic(incomingSectionStaticWithText);

    await runAxeTest({ rootNode: container });
  });

  describe('when there is no value', () => {
    it('should be rendered empty', () => {
      const { queryByText } = renderIncomingSectionStatic(emptyIncomingSectionStatic);
      const valueElement = queryByText('test text');

      expect(valueElement).toBeNull();
    });
  });

  describe('when value equals to TEXT', () => {
    describe('and there is a filled text field', () => {
      it('should be rendered TEXT static value type', () => {
        const { getByText } = renderIncomingSectionStatic(incomingSectionStaticWithText);

        expect(getByText('test text')).toBeInTheDocument();
      });
    });

    describe('and the text field is not filled', () => {
      it('should be rendered with empty TEXT static value type', () => {
        const { getByText } = renderIncomingSectionStatic(incomingSectionStaticWithoutText);

        expect(getByText('-')).toBeInTheDocument();
      });
    });
  });

  describe('when value equals to NUMBER', () => {
    describe('and there is a filled number field', () => {
      it('should be rendered NUMBER static value type', () => {
        const { getByText } = renderIncomingSectionStatic(incomingSectionStaticWithNumber);

        expect(getByText('test text')).toBeInTheDocument();
      });
    });

    describe('and the number field is not filled', () => {
      it('should be rendered with empty NUMBER static value type', () => {
        const { getByText } = renderIncomingSectionStatic(incomingSectionStaticWithoutNumber);

        expect(getByText('-')).toBeInTheDocument();
      });
    });
  });

  describe('when value equals to EXACT_DATE', () => {
    describe('and there is a filled date field', () => {
      it('should be rendered EXACT_DATE static value type', () => {
        const { queryByText } = renderIncomingSectionStatic(incomingSectionStaticWithDate);

        expect(queryByText('12/30/2010')).toBeDefined();
      });
    });

    describe('and the date field is not filled', () => {
      it('should be rendered with empty EXACT_DATE static value type', () => {
        const { getByText } = renderIncomingSectionStatic(incomingSectionStaticWithoutDate);

        expect(getByText('-')).toBeInTheDocument();
      });
    });
  });

  describe('when value equals to DATE_RANGE', () => {
    describe('and there is a filled date range field', () => {
      it('should be rendered DATE_RANGE static value type', () => {
        const { queryByText } = renderIncomingSectionStatic(incomingSectionStaticWithDateRange);

        expect(queryByText('12/30/2010')).toBeDefined();
        expect(queryByText('12/30/2011')).toBeDefined();
      });
    });

    describe('and the date range field is not filled', () => {
      it('should be rendered with empty DATE_RANGE static value type', () => {
        const { getAllByText } = renderIncomingSectionStatic(incomingSectionStaticWithoutDateRange);

        expect(getAllByText('-').length).toBe(2);
      });
    });
  });
});
