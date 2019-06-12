import {
  interactor,
  scoped,
} from '@bigtest/interactor';

@interactor
class JobLogInteractor {
  entriesTotal = scoped('[class*=header__entries---]');
  errorsTotal = scoped('[class*=header__errors---]');
  logsPane = scoped('#logs-pane');
}

export const jobLog = new JobLogInteractor('#job-log-colorizer');
