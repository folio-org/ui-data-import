import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import {
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import {
  MARCFieldProtection,
  DISABLED_FOR_PROTECTING_FIELDS,
  DISABLED_FOR_SUBFIELD_AND_INDICATORS_FIELDS,
} from './MARCFieldProtection';

const resources = {
  values: { records: [{
    id: '2d706874-8a10-4d3e-a190-33c301d157e3',
    field: '001',
    indicator1: '',
    indicator2: '',
    subfield: '',
    data: '*',
    source: 'SYSTEM',
    override: false,
    metadata: {
      createdDate: '2020-08-13T14:44:00.000+00:00',
      createdByUserId: '00000000-0000-0000-0000-000000000000',
      createdByUsername: 'System',
      updatedDate: '2020-08-13T14:44:00.000+00:00',
      updatedByUserId: '00000000-0000-0000-0000-000000000000',
      updatedByUsername: 'System',
    },
  }, {
    id: '82d0b904-f8b0-4cc2-b238-7d8cddef7b7e',
    field: '999',
    indicator1: 'f',
    indicator2: 'f',
    subfield: '*',
    data: '*',
    source: 'SYSTEM',
    override: false,
    metadata: {
      createdDate: '2020-08-13T14:44:00.000+00:00',
      createdByUserId: '00000000-0000-0000-0000-000000000000',
      createdByUsername: 'System',
      updatedDate: '2020-08-13T14:44:00.000+00:00',
      updatedByUserId: '00000000-0000-0000-0000-000000000000',
      updatedByUsername: 'System',
    },
  }, {
    id: '82d0b904-f8b0-4cc2-b238-7d8cddef7b7e',
    field: '*',
    indicator1: '/',
    indicator2: '/',
    subfield: '*',
    data: '',
    source: 'SYSTEM',
    override: false,
    metadata: {
      createdDate: '2020-08-13T14:44:00.000+00:00',
      createdByUserId: '00000000-0000-0000-0000-000000000000',
      createdByUsername: 'System',
      updatedDate: '2020-08-13T14:44:00.000+00:00',
      updatedByUserId: '00000000-0000-0000-0000-000000000000',
      updatedByUsername: 'System',
    },
  },
  ] },
};
const stripesCustomProps = {
  okapi: { url: 'https://folio-testing-okapi.dev.folio.org' },
  logger: { log: noop },
  hasPerm: noop,
  connect: Component => props => (
    <Component
      {...props}
      mutator={{}}
      resources={resources}
    />
  ),
};

const renderMarcFieldProtection = () => {
  const component = () => (
    <Router>
      <MARCFieldProtection stripes={stripesCustomProps} />
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('MARCFieldProtection component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderMarcFieldProtection();

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered', () => {
    const { getByText } = renderMarcFieldProtection();

    expect(getByText('The following MARC fields are protected from updates when new copies of MARC records are imported')).toBeDefined();
  });

  it('display protected by the system fields', () => {
    const { getByText } = renderMarcFieldProtection();

    expect(getByText('001')).toBeDefined();
    expect(getByText('999')).toBeDefined();
  });

  describe('validation', () => {
    describe('when field value is empty', () => {
      it('validation error should appear', () => {
        const {
          getByText,
          getByPlaceholderText,
        } = renderMarcFieldProtection();

        fireEvent.click(getByText('+ New'));

        const field = getByPlaceholderText('field');

        fireEvent.change(field, { target: { value: '' } });
        fireEvent.blur(field);

        expect(getByText('Please fill this in to continue')).toBeDefined();
      });
    });

    describe('when field value is one of: Leader, LDR, 001, 002, 003, 004, 005, 009', () => {
      DISABLED_FOR_PROTECTING_FIELDS.forEach(protectedField => {
        it('should disallow to protect it', () => {
          const {
            getByText,
            getByPlaceholderText,
          } = renderMarcFieldProtection();

          fireEvent.click(getByText('+ New'));

          const field = getByPlaceholderText('field');

          fireEvent.change(field, { target: { value: protectedField } });
          fireEvent.blur(field);

          expect(screen.getByText('Please enter * or other numeric value')).toBeDefined();
        });
      });
    });

    describe('when field value is one of: 006, 007, 008', () => {
      DISABLED_FOR_SUBFIELD_AND_INDICATORS_FIELDS.forEach(protectedField => {
        it('disallow asterisk to be entered into data field', () => {
          const {
            getByText,
            getByPlaceholderText,
          } = renderMarcFieldProtection();

          fireEvent.click(getByText('+ New'));

          const field = getByPlaceholderText('field');
          const data = getByPlaceholderText('data');

          fireEvent.change(field, { target: { value: protectedField } });
          fireEvent.change(data, { target: { value: '*' } });
          fireEvent.blur(data);

          expect(getByText('Please enter other value')).toBeDefined();
        });

        it('indicators and subfield fields should be greyed out', () => {
          const {
            getByText,
            getByPlaceholderText,
          } = renderMarcFieldProtection();

          fireEvent.click(getByText('+ New'));

          const field = getByPlaceholderText('field');
          const indicator1 = getByPlaceholderText('indicator1');
          const indicator2 = getByPlaceholderText('indicator2');
          const subfield = getByPlaceholderText('subfield');

          fireEvent.change(field, { target: { value: protectedField } });
          fireEvent.blur(field);

          expect(indicator1).toBeDisabled();
          expect(indicator2).toBeDisabled();
          expect(subfield).toBeDisabled();
        });
      });
    });

    describe('when field value is from 010 through 998', () => {
      it('should require single characters in Ind 1, Ind 2, Subfield fields', () => {
        const {
          getByText,
          getAllByText,
          getByPlaceholderText,
        } = renderMarcFieldProtection();

        fireEvent.click(getByText('+ New'));

        const field = getByPlaceholderText('field');
        const indicator1 = getByPlaceholderText('indicator1');
        const indicator2 = getByPlaceholderText('indicator2');
        const subfield = getByPlaceholderText('subfield');

        fireEvent.change(field, { target: { value: '010' } });
        fireEvent.change(indicator1, { target: { value: '' } });
        fireEvent.change(indicator2, { target: { value: '' } });
        fireEvent.change(subfield, { target: { value: '' } });
        fireEvent.blur(indicator1);
        fireEvent.blur(indicator2);
        fireEvent.blur(subfield);

        expect(getAllByText('Please enter * or alphanumeric value').length).toEqual(3);
      });
    });

    describe('when field value is 999', () => {
      it('should disallow value "f" to be entered to indicators', () => {
        const {
          getByText,
          getAllByText,
          getByPlaceholderText,
        } = renderMarcFieldProtection();

        fireEvent.click(getByText('+ New'));

        const field = getByPlaceholderText('field');
        const indicator1 = getByPlaceholderText('indicator1');
        const indicator2 = getByPlaceholderText('indicator2');

        fireEvent.change(field, { target: { value: '999' } });
        fireEvent.change(indicator1, { target: { value: 'f' } });
        fireEvent.change(indicator2, { target: { value: 'f' } });

        fireEvent.blur(indicator1);
        fireEvent.blur(indicator2);

        expect(getAllByText('Please enter other value').length).toEqual(2);
      });

      it('should disallow asterisk to be entered to both indicators', () => {
        const {
          getByText,
          getAllByText,
          getByPlaceholderText,
        } = renderMarcFieldProtection();

        fireEvent.click(getByText('+ New'));

        const field = getByPlaceholderText('field');
        const indicator1 = getByPlaceholderText('indicator1');
        const indicator2 = getByPlaceholderText('indicator2');

        fireEvent.change(field, { target: { value: '999' } });
        fireEvent.change(indicator1, { target: { value: '*' } });
        fireEvent.change(indicator2, { target: { value: '*' } });

        fireEvent.blur(indicator1);
        fireEvent.blur(indicator2);

        expect(getAllByText('Please enter other value').length).toEqual(2);
      });

      it('should allow asterisk to be entered to one of the indicators', () => {
        const {
          getByText,
          queryAllByText,
          getByPlaceholderText,
        } = renderMarcFieldProtection();

        fireEvent.click(getByText('+ New'));

        const field = getByPlaceholderText('field');
        const indicator1 = getByPlaceholderText('indicator1');
        const indicator2 = getByPlaceholderText('indicator2');

        fireEvent.change(field, { target: { value: '999' } });
        fireEvent.change(indicator1, { target: { value: 'a' } });
        fireEvent.change(indicator2, { target: { value: '*' } });

        fireEvent.blur(indicator1);
        fireEvent.blur(indicator2);

        expect(queryAllByText('Please enter other value').length).toEqual(0);
      });
    });
  });
});
