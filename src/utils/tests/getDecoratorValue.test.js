import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { getDecoratorValue } from '../getDecoratorValue';
import { BOOLEAN_ACTIONS } from '../constants';

describe('getDecoratedValue function', () => {
  it('when action value is AS_IS, returns empty string', () => {
    expect(getDecoratorValue(BOOLEAN_ACTIONS.AS_IS)).toBe('');
  });

  it('when action value is ALL_TRUE, returns appropriate value', () => {
    const MessageComponent = getDecoratorValue(BOOLEAN_ACTIONS.ALL_TRUE);

    const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

    expect(getByText('Mark for all affected records')).toBeInTheDocument();
  });

  it('when action value is ALL_FALSE, returns appropriate value', () => {
    const MessageComponent = getDecoratorValue(BOOLEAN_ACTIONS.ALL_FALSE);

    const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

    expect(getByText('Unmark for all affected records')).toBeInTheDocument();
  });

  it('when action value is not valid action, returns value itself', () => {
    expect(getDecoratorValue('NOT_VALID')).toBe('NOT_VALID');
  });
});
