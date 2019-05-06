import {
  interactor,
  scoped,
} from '@bigtest/interactor';

@interactor
class JobLogInteractor {
  total = scoped('#view-total-records-test');
  logJson = scoped('#job-log-json');
}

export const jobLog = new JobLogInteractor('#view-job-log-test');
