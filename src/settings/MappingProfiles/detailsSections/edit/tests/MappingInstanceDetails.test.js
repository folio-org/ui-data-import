import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { MappingInstanceDetails } from '../MappingInstanceDetails';
import {
  onAdd,
  onRemove,
} from '../../utils';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  onAdd: jest.fn(),
  onRemove: jest.fn(),
}));

global.fetch = jest.fn();

const statisticalCodeIds = [{
  fields: [{
    acceptedValues: { testId: 'testValue' },
    enabled: true,
    name: 'statisticalCodeId',
    path: 'instance.statisticalCodeIds[]',
    value: '',
  }],
  order: 0,
  path: 'instance.statisticalCodeIds[]',
}];

const natureOfContentTermIds = [{
  fields: [{
    acceptedValues: { testId: 'testValue' },
    enabled: true,
    name: 'natureOfContentTermId',
    path: 'instance.natureOfContentTermIds[]',
    value: '',
  }],
  order: 0,
  path: 'instance.natureOfContentTermIds[]',
}];

const parentInstances = [{
  fields: [{
    enabled: true,
    name: 'superInstanceId',
    path: 'instance.parentInstances[].superInstanceId',
    value: '',
  }, {
    acceptedValues: {},
    enabled: true,
    name: 'instanceRelationshipTypeId',
    path: 'instance.parentInstances[].instanceRelationshipTypeId',
    value: '',
  }],
  order: 0,
  path: 'instance.parentInstances[]',
}];

const childInstances = [{
  fields: [{
    enabled: true,
    name: 'subInstanceId',
    path: 'instance.childInstances[].subInstanceId',
    value: '',
  }, {
    acceptedValues: { testId: 'testValue' },
    enabled: true,
    name: 'instanceRelationshipTypeId',
    path: 'instance.childInstances[].instanceRelationshipTypeId',
    value: '',
  }],
  order: 0,
  path: 'instance.childInstances[]',
}];

const alternativeTitles = [{
  fields: [{
    enabled: true,
    name: 'alternativeTitleTypeId',
    path: 'instance.alternativeTitles[].alternativeTitleTypeId',
    value: '',
  }, {
    enabled: true,
    name: 'alternativeTitle',
    path: 'instance.alternativeTitles[].alternativeTitle',
    value: '',
  }],
  order: 0,
  path: 'instance.alternativeTitles[]',
}];

const classifications = [{
  fields: [{
    enabled: false,
    name: 'classificationTypeId',
    path: 'instance.classifications[].classificationTypeId',
    value: '',
  }, {
    enabled: false,
    name: 'classificationNumber',
    path: 'instance.classifications[].classificationNumber',
    value: '',
  }],
  order: 0,
  path: 'instance.classifications[]',
}];

const contributors = [{
  fields: [{
    enabled: false,
    name: 'contributorName',
    path: 'instance.contributors[].name',
    value: '',
  }, {
    enabled: false,
    name: 'contributorNameTypeId',
    path: 'instance.contributors[].contributorNameTypeId',
    value: '',
  }, {
    enabled: false,
    name: 'contributorTypeId',
    path: 'instance.contributors[].contributorTypeId',
    value: '',
  }, {
    enabled: false,
    name: 'contributorTypeText',
    path: 'instance.contributors[].contributorTypeText',
    value: '',
  }, {
    enabled: false,
    name: 'primary',
    path: 'instance.contributors[].primary',
    value: '',
  }],
  order: 0,
  path: 'instance.contributors[]',
}];

const editions = [{
  fields: [{
    enabled: false,
    name: 'edition',
    path: 'instance.editions[]',
    value: '',
  }],
  order: 0,
  path: 'instance.editions[]',
}];

const identifiers = [{
  fields: [{
    enabled: false,
    name: 'identifierTypeId',
    path: 'instance.identifiers[].identifierTypeId',
    value: '',
  }, {
    enabled: false,
    name: 'value',
    path: 'instance.identifiers[].value',
    value: '',
  }],
  order: 0,
  path: 'instance.identifiers[]',
}];

const instanceFormatIds = [{
  fields: [{
    enabled: false,
    name: 'instanceFormatId',
    path: 'instance.instanceFormatIds[]',
    value: '',
  }],
  order: 0,
  path: 'instance.instanceFormatIds[]',
}];

const languages = [{
  fields: [{
    enabled: false,
    name: 'languageId',
    path: 'instance.languages[]',
    value: '',
  }],
  order: 0,
  path: 'instance.languages[]',
}];

const notes = [{
  fields: [{
    enabled: false,
    name: 'noteType',
    path: 'instance.notes[].instanceNoteTypeId',
    value: '',
  }, {
    enabled: false,
    name: 'note',
    path: 'instance.notes[].note',
    value: '',
  }, {
    enabled: false,
    name: 'staffOnly',
    path: 'instance.notes[].staffOnly',
    value: null,
  }],
  order: 0,
  path: 'instance.notes[]',
}];

const physicalDescriptions = [{
  fields: [{
    enabled: false,
    name: 'physicalDescription',
    path: 'instance.physicalDescriptions[]',
    value: '',
  }],
  order: 0,
  path: 'instance.physicalDescriptions[]',
}];

const precedingTitles = [{
  fields: [{
    enabled: true,
    name: 'precedingTitlesTitle',
    path: 'instance.precedingTitles[].title',
    value: '',
  }, {
    enabled: true,
    name: 'precedingTitlesHrid',
    path: 'instance.precedingTitles[].hrid',
    value: '',
  }, {
    enabled: true,
    name: 'precedingTitlesIsbn',
    path: 'instance.precedingTitles[].identifiers[].value',
    value: '',
  }, {
    enabled: true,
    name: 'precedingTitlesIssn',
    path: 'instance.precedingTitles[].identifiers[].value',
    value: '',
  }],
  order: 0,
  path: 'instance.precedingTitles[]',
}];

const publication = [{
  fields: [{
    enabled: false,
    name: 'publisher',
    path: 'instance.publication[].publisher',
    value: '',
  }, {
    enabled: false,
    name: 'role',
    path: 'instance.publication[].role',
    value: '',
  }, {
    enabled: false,
    name: 'place',
    path: 'instance.publication[].place',
    value: '',
  }, {
    enabled: false,
    name: 'dateOfPublication',
    path: 'instance.publication[].dateOfPublication',
    value: '',
  }],
  order: 0,
  path: 'instance.publication[]',
}];

const publicationFrequency = [{
  fields: [{
    enabled: false,
    name: 'publicationFrequency',
    path: 'instance.publicationFrequency[]',
    value: '',
  }],
  order: 0,
  path: 'instance.publicationFrequency[]',
}];

const publicationRange = [{
  fields: [{
    enabled: false,
    name: 'publicationRange',
    path: 'instance.publicationRange[]',
    value: '',
  }],
  order: 0,
  path: 'instance.publicationRange[]',
}];

const series = [{
  fields: [{
    enabled: false,
    name: 'source',
    path: 'instance.series[]',
    value: '',
  }],
  order: 0,
  path: 'instance.series[]',
}];

const subjects = [{
  fields: [{
    enabled: false,
    name: 'subject',
    path: 'instance.subjects[]',
    value: '',
  }],
  order: 0,
  path: 'instance.subjects[]',
}];

const succeedingTitles = [{
  fields: [{
    enabled: true,
    name: 'succeedingTitlesTitle',
    path: 'instance.succeedingTitles[].title',
    value: '',
  }, {
    enabled: true,
    name: 'succeedingTitlesHrid',
    path: 'instance.succeedingTitles[].hrid',
    value: '',
  }, {
    enabled: true,
    name: 'succeedingTitlesIsbn',
    path: 'instance.succeedingTitles[].identifiers[].value',
    value: '',
  }, {
    enabled: true,
    name: 'succeedingTitlesIssn',
    path: 'instance.succeedingTitles[].identifiers[].value',
    value: '',
  }],
  order: 0,
  path: 'instance.succeedingTitles[]',
}];

const defaultReferenceTables = {
  alternativeTitles,
  classifications,
  contributors,
  editions,
  identifiers,
  instanceFormatIds,
  languages,
  notes,
  physicalDescriptions,
  precedingTitles,
  publication,
  publicationFrequency,
  publicationRange,
  series,
  subjects,
  succeedingTitles,
};

const initialFieldsProp = {
  alternativeTitles: alternativeTitles[0],
  childInstances: childInstances[0],
  classifications: classifications[0],
  contributors: contributors[0],
  editions: editions[0],
  identifiers: identifiers[0],
  instanceFormatIds: instanceFormatIds[0],
  languages: languages[0],
  natureOfContentTermIds: natureOfContentTermIds[0],
  notes: notes[0],
  parentInstances: parentInstances[0],
  physicalDescriptions: physicalDescriptions[0],
  precedingTitles: precedingTitles[0],
  publication: publication[0],
  publicationFrequency: publicationFrequency[0],
  publicationRange: publicationRange[0],
  series: series[0],
  statisticalCodeIds: statisticalCodeIds[0],
  subjects: subjects[0],
  succeedingTitles: succeedingTitles[0],
};

const referenceTablesProp = {};
const setReferenceTablesMockProp = jest.fn();
const getRepeatableFieldActionProp = jest.fn(() => '');
const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderMappingInstanceDetails = ({ referenceTables }) => {
  const component = () => (
    <MappingInstanceDetails
      initialFields={initialFieldsProp}
      referenceTables={referenceTables || referenceTablesProp}
      setReferenceTables={setReferenceTablesMockProp}
      getRepeatableFieldAction={getRepeatableFieldActionProp}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('<MappingInstanceDetails>', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    global.fetch.mockClear();
    onAdd.mockClear();
    onRemove.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('should have correct sections', async () => {
    const {
      findByRole,
      getByRole,
    } = renderMappingInstanceDetails({});

    expect(await findByRole('button', { name: /administrative data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /title data/i })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /identifier/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /contributor/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', { name: /descriptive data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /instance notes/i })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /electronic access/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /subject/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /classification/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /instance relationship \(analytics and bound-with\)/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /related instances/i,
      expanded: true,
    })).toBeInTheDocument();
  });

  describe('"Statistical codes" field', () => {
    it('User can add statistical code info', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingInstanceDetails({
        referenceTables: {
          statisticalCodeIds,
          ...defaultReferenceTables,
        },
      });

      const button = await findByRole('button', { name: /add statistical code/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('statisticalCodeIds');
      expect(getByText('Statistical code')).toBeInTheDocument();
    });

    it('User can delete statistical code info', async () => {
      const { findByRole } = renderMappingInstanceDetails({
        referenceTables: {
          ...defaultReferenceTables,
          statisticalCodeIds,
        },
      });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(statisticalCodeIds);
    });
  });

  describe('"Nature of content terms" field', () => {
    it('User can add nature of content term info', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingInstanceDetails({
        referenceTables: {
          ...defaultReferenceTables,
          natureOfContentTermIds,
        },
      });

      const button = await findByRole('button', { name: /add nature of content term/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('natureOfContentTermIds');
      expect(getByText('Nature of content term')).toBeInTheDocument();
    });

    it('User can delete nature of content term info', async () => {
      const { findByRole } = renderMappingInstanceDetails({
        referenceTables: {
          ...defaultReferenceTables,
          natureOfContentTermIds,
        },
      });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(natureOfContentTermIds);
    });
  });

  describe('Parent instances" field', () => {
    it('User can add parent instance', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingInstanceDetails({
        referenceTables: {
          ...defaultReferenceTables,
          parentInstances,
        },
      });

      const button = await findByRole('button', { name: /add parent instance/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('parentInstances');
      expect(getByText('Parent instance')).toBeInTheDocument();
      expect(getByText('Type of relation')).toBeInTheDocument();
    });

    it('User can delete parent instance', async () => {
      const { findByRole } = renderMappingInstanceDetails({
        referenceTables: {
          ...defaultReferenceTables,
          parentInstances,
        },
      });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(parentInstances);
    });
  });

  describe('Child instances" field', () => {
    it('User can add child instance', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingInstanceDetails({
        referenceTables: {
          ...defaultReferenceTables,
          childInstances,
        },
      });

      const button = await findByRole('button', { name: /add child instance/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('childInstances');
      expect(getByText('Child instance')).toBeInTheDocument();
      expect(getByText('Type of relation')).toBeInTheDocument();
    });

    it('User can delete child instance', async () => {
      const { findByRole } = renderMappingInstanceDetails({
        referenceTables: {
          ...defaultReferenceTables,
          childInstances,
        },
      });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(childInstances);
    });
  });
});
