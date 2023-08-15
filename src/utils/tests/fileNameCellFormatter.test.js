import { Router } from 'react-router-dom';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';

import '../../../test/jest/__mock__';

import { fileNameCellFormatter } from '../fileNameCellFormatter';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  NoValue: () => <span>-</span>,
}));

const history = createMemoryHistory();
const location = { pathname: '', search: '' };

const renderFileName = record => {
  const textLink = fileNameCellFormatter(record, location);
  const component = <Router history={history}>{textLink}</Router>;

  return render(component);
};

describe('fileNameCellFormatter function', () => {
  it('should render a file name', () => {
    const record = {
      fileName: 'testFileName',
      id: 'testFileId',
    };
    const { getByText } = renderFileName(record);

    expect(getByText('testFileName')).toBeDefined();
  });

  it('should return a link to job summary', () => {
    const record = {
      fileName: 'testFileName',
      id: 'testFileId',
    };
    const { getByText } = renderFileName(record);

    expect(getByText(record.fileName).href).toContain(`/data-import/job-summary/${record.id}`);
  });

  it('should return a dash when there is no file name', () => {
    const record = {
      fileName: '',
      id: 'testFileId',
    };
    const { getByText } = renderFileName(record);

    expect(getByText('-')).toBeDefined();
  });
});
