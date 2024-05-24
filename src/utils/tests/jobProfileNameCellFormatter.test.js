import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import '../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import { jobProfileNameCellFormatter } from '../jobProfileNameCellFormatter';

const history = createMemoryHistory();

const jobProfileRecord = {
  jobProfileInfo: {
    name: 'testJobProfileName',
    id: 'testJobProfileId',
  },
};

const renderJobProfileName = record => {
  const textLink = jobProfileNameCellFormatter(record);
  const component = <Router history={history}>{textLink}</Router>;

  return renderWithIntl(component, translationsProperties);
};

describe('jobProfileNameCellFormatter function', () => {
  it('should render a job profile name', () => {
    const { getByText } = renderJobProfileName(jobProfileRecord);

    expect(getByText('testJobProfileName')).toBeDefined();
  });

  it('should return a link to job profile view', () => {
    const { getByText } = renderJobProfileName(jobProfileRecord);

    expect(getByText(jobProfileRecord.jobProfileInfo.name).href)
      .toContain(`/settings/data-import/job-profiles/view/${jobProfileRecord.jobProfileInfo.id}`);
  });

  describe('when jobProfileInfo is empty', () => {
    it('should render an empty value', () => {
      const { getByText } = renderJobProfileName({});

      expect(getByText('-')).toBeInTheDocument();
    });
  });
});
