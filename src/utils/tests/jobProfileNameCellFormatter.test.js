import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import '../../../test/jest/__mock__';

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

  return render(component);
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
});
