import '../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import {
  augmentParam,
  checkDate,
  getOptionLabel,
  handleProfileSave,
} from '../formUtils';

describe('augmentParam function', () => {
  it('extends given string with augment value', () => {
    const givenValue = 'test,string';
    const splitter = ',';
    const augmentValue = '-';
    const expected = 'test-string';

    expect(augmentParam(givenValue, splitter, augmentValue)).toBe(expected);
  });

  it('when given value is an empty value, returns given value', () => {
    const emptyValue = '';
    const splitter = ',';
    const augmentValue = '-';

    expect(augmentParam(emptyValue, splitter, augmentValue)).toBe(emptyValue);
  });
});

describe('getOptionLabel function', () => {
  it('finds and returns formatted option label from options array', () => {
    const options = [{
      value: 'option1',
      label: 'option1',
    }, {
      value: 'option2',
      label: 'option2',
    }];
    const label = 'option2';
    const sectionNamespace = 'ui-';

    expect(getOptionLabel(options, label, sectionNamespace)).toBe(label);
  });

  it('returns undefined when cannot find option label', () => {
    const options = [{
      value: 'option1',
      label: 'option1',
    }];
    const label = 'option2';
    const sectionNamespace = 'ui-';

    expect(getOptionLabel(options, label, sectionNamespace)).toBeUndefined();
  });
});

describe('checkDate function', () => {
  it('when dataType is "date", returns formatted message', () => {
    const dataType = 'date';
    const value = '2021-11-23T14:48:00.000Z';

    const MessageComponent = checkDate(dataType, value);

    const { getByText } = renderWithIntl(MessageComponent);

    expect(getByText('11/23/2021')).toBeInTheDocument();
  });

  it('when dataType is not "date", returns given value', () => {
    const dataType = 'string';
    const value = '2011-10-05T14:48:00.000Z';

    expect(checkDate(dataType, value)).toBe(value);
  });
});

describe('handleProfileSave function', () => {
  it('saves profile successfully', async () => {
    const handleSubmit = jest.fn().mockResolvedValueOnce({ id: 'testRecordId' });
    const resetForm = jest.fn();
    const transitionToParams = jest.fn();
    const path = 'https://test.com';
    const event = 'testEvent';

    const saveFunction = handleProfileSave(handleSubmit, resetForm, transitionToParams, path);

    await saveFunction(event);

    expect(handleSubmit).toHaveBeenLastCalledWith(event);
    expect(resetForm).toHaveBeenCalled();
    expect(transitionToParams).toHaveBeenLastCalledWith({
      _path: `${path}/view/testRecordId`,
      layer: null,
    });
  });
});
