import { interactor } from '@bigtest/interactor';

@interactor class LogsPaneInteractor {}

export default new LogsPaneInteractor('[data-test-logs-pane]');
