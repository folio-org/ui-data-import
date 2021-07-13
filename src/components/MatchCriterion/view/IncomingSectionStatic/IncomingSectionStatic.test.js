import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../test/jest/helpers';

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

describe('IncomingSectionStatic view', () => {
  it('should be rendered empty', () => {
    const { queryByText } = renderIncomingSectionStatic(emptyIncomingSectionStatic);

    expect(queryByText('test text')).toBeNull();
  });

  describe('when choose TEXT static value type', () => {
    it('should be rendered TEXT static value type', () => {
      const { getByText } = renderIncomingSectionStatic(incomingSectionStaticWithText);

      expect(getByText('test text')).toBeDefined();
    });

    it('should be rendered with empty TEXT static value type', () => {
      const { getByLabelText } = renderIncomingSectionStatic(incomingSectionStaticWithoutText);

      expect(getByLabelText('No value set')).toBeDefined();
    });
  });

  describe('when choose NUMBER static value type', () => {
    it('should be rendered NUMBER static value type', () => {
      const { getByText } = renderIncomingSectionStatic(incomingSectionStaticWithNumber);

      expect(getByText('test text')).toBeDefined();
    });

    it('should be rendered with empty NUMBER static value type', () => {
      const { getByLabelText } = renderIncomingSectionStatic(incomingSectionStaticWithoutNumber);

      expect(getByLabelText('No value set')).toBeDefined();
    });
  });

  describe('when choose EXACT_DATE static value type', () => {
    it('should be rendered EXACT_DATE static value type', () => {
      const { queryByText } = renderIncomingSectionStatic(incomingSectionStaticWithDate);

      expect(queryByText('12/30/2010')).toBeDefined();
    });

    it('should be rendered with empty EXACT_DATE static value type', () => {
      const { getByLabelText } = renderIncomingSectionStatic(incomingSectionStaticWithoutDate);

      expect(getByLabelText('No value set')).toBeDefined();
    });
  });

  describe('when choose DATE_RANGE static value type', () => {
    it('should be rendered DATE_RANGE static value type', () => {
      const { queryByText } = renderIncomingSectionStatic(incomingSectionStaticWithDateRange);

      expect(queryByText('12/30/2010')).toBeDefined();
      expect(queryByText('12/30/2011')).toBeDefined();
    });

    it('should be rendered with empty DATE_RANGE static value type', () => {
      const { getAllByLabelText } = renderIncomingSectionStatic(incomingSectionStaticWithoutDateRange);

      expect(getAllByLabelText('No value set')).toBeDefined();
    });
  });
});
