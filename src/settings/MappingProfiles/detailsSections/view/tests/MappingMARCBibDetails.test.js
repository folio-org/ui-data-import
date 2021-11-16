import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../../test/jest/helpers';

import { MappingMARCBibDetails } from '../MappingMARCBibDetails';
import { FIELD_MAPPINGS_FOR_MARC } from '../../../../../utils';

const marcMappingDetailsProp = [];
const mappingMarcFieldProtectionFieldsProp = [];
const marcFieldProtectionFieldsProp = [];

const renderMappingMARCBibDetails = ({
  marcMappingOption,
  marcMappingDetails,
}) => {
  const component = (
    <MappingMARCBibDetails
      marcMappingDetails={marcMappingDetails || marcMappingDetailsProp}
      marcMappingOption={marcMappingOption || FIELD_MAPPINGS_FOR_MARC.UPDATES}
      mappingMarcFieldProtectionFields={mappingMarcFieldProtectionFieldsProp}
      marcFieldProtectionFields={marcFieldProtectionFieldsProp}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('<MARCBibDetails>', () => {
  it('should have correct sections', () => {
    const { getByRole } = renderMappingMARCBibDetails({});

    // eslint-disable-next-line no-irregular-whitespace
    expect(getByRole('button', { name: /icon field mapping · marc bibliographic · updates/i })).toBeInTheDocument();
    // eslint-disable-next-line no-irregular-whitespace
    expect(getByRole('button', { name: /icon field mapping · marc bibliographic · override protected fields/i })).toBeInTheDocument();
  });

  it('"Updates" section is expanded by default', () => {
    const { getByRole } = renderMappingMARCBibDetails({});

    // eslint-disable-next-line no-irregular-whitespace
    expect(getByRole('button', { name: /field mapping · marc bibliographic · updates/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('"Override protected fields" section is not expanded by default', () => {
    const { getByRole } = renderMappingMARCBibDetails({});

    // eslint-disable-next-line no-irregular-whitespace
    expect(getByRole('button', { name: /field mapping · marc bibliographic · override protected fields/i }))
      .toHaveAttribute('aria-expanded', 'false');
  });

  describe('When there is mapping details', () => {
    it('should render contents as table', () => {
      const { getByText } = renderMappingMARCBibDetails({
        marcMappingDetails: [{
          field: {
            field: 'testField',
            indicator1: 'testIndicator1',
            indicator2: 'testIndicator2',
            subfields: [{ subfield: 'testSubfield' }],
          },
          order: 0,
        }],
      });

      expect(getByText('Field')).toBeInTheDocument();
      expect(getByText('In.1')).toBeInTheDocument();
      expect(getByText('In.2')).toBeInTheDocument();
      expect(getByText('Subfield')).toBeInTheDocument();

      expect(getByText('testField')).toBeInTheDocument();
      expect(getByText('testIndicator1')).toBeInTheDocument();
      expect(getByText('testIndicator2')).toBeInTheDocument();
      expect(getByText('testSubfield')).toBeInTheDocument();
    });
  });

  describe('when mapping option is "MODIFY"', () => {
    it('should render correct fields', () => {
      const { getByText } = renderMappingMARCBibDetails({
        marcMappingOption: FIELD_MAPPINGS_FOR_MARC.MODIFICATIONS,
        marcMappingDetails: [{
          action: 'ADD',
          field: {
            field: 'testField',
            indicator1: 'testIndicator1',
            indicator2: 'testIndicator2',
            subfields: [{
              data: { text: 'testData' },
              subaction: 'ADD_SUBFIELD',
              subfield: 'testSubfield',
            }],
          },
          order: 0,
        }],
      });

      expect(getByText('Field')).toBeInTheDocument();
      expect(getByText('In.1')).toBeInTheDocument();
      expect(getByText('In.2')).toBeInTheDocument();
      expect(getByText('Subfield')).toBeInTheDocument();
      expect(getByText('Subaction')).toBeInTheDocument();
      expect(getByText('Data')).toBeInTheDocument();
      expect(getByText('Position')).toBeInTheDocument();

      expect(getByText('testField')).toBeInTheDocument();
      expect(getByText('testIndicator1')).toBeInTheDocument();
      expect(getByText('testIndicator2')).toBeInTheDocument();
      expect(getByText('testSubfield')).toBeInTheDocument();
      expect(getByText('Add subfield')).toBeInTheDocument();
      expect(getByText('testData')).toBeInTheDocument();
    });
  });
});
