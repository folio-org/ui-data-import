import '../../../test/jest/__mock__';

import { createOptionsList } from '../createOptionsList';
import { ITEM_STATUS_OPTIONS } from '../constants';

describe('createOptionsList', () => {
  it('creates options list', () => {
    // "formattedMessage" function comes from "react-intl" package but here it is a dummy function
    const formatMessage = jest.fn().mockImplementation(() => 'formattedLabel');
    const array = ITEM_STATUS_OPTIONS;
    const customLabel = '';

    expect(createOptionsList(array, formatMessage, customLabel).length).toBe(array.length);
    createOptionsList(array, formatMessage, customLabel).forEach((option, index) => {
      expect(option.value).toBe(array[index].value);
      expect(option.label).toBe(formatMessage());
    });
  });
});
