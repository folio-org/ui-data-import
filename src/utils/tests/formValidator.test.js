import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import {
  validateAcceptedValues,
  validateFileExtension,
  validateMarcIndicatorField,
  validateMarcTagField,
  validateMARCWithDate,
  validateMoveField,
  validateRepeatableActionsField,
  validateSubfieldField,
} from '../formValidators';

describe('validateFileExtension function', () => {
  it('when extension is invalid, returns appropriate message', () => {
    const value = 'invalid';

    const MessageComponent = validateFileExtension(value);

    const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

    expect(getByText('Please enter a valid file extension (e.g. .marc)')).toBeInTheDocument();
  });

  it('otherwise, returns undefined', () => {
    const value = '.marc';

    expect(validateFileExtension(value)).toBeUndefined();
  });
});

describe('validateRepeatableActionsField', () => {
  it('when no field is added, returns appropriate message', () => {
    const value = 'Add these to existing';
    const hasFields = false;

    const MessageComponent = validateRepeatableActionsField(value, hasFields);

    const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

    expect(getByText('One or more values must be added before the profile can be saved.')).toBeInTheDocument();
  });

  it('when no action is chosen, returns appropriate message', () => {
    const value = '';
    const hasFields = true;

    const MessageComponent = validateRepeatableActionsField(value, hasFields);

    const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

    expect(getByText('Action must be selected before the profile can be saved')).toBeInTheDocument();
  });

  it('otherwise, returns undefined', () => {
    const value = 'Add these to existing';
    const hasFields = true;

    expect(validateRepeatableActionsField(value, hasFields)).toBeUndefined();
  });
});

describe('validateAcceptedValues function', () => {
  it('when given value is not valid, returns appropriate message', () => {
    const acceptedValues = [{ key: 'value' }];
    const valueKey = 'key';
    const value = '"test"';

    const MessageComponent = validateAcceptedValues(acceptedValues, valueKey)(value);

    const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

    expect(getByText('Please correct the syntax to continue')).toBeInTheDocument();
  });

  it('otherwise, returns undefined', () => {
    const acceptedValues = [{ key: 'value' }];
    const valueKey = 'key';
    const value = '"value"';

    expect(validateAcceptedValues(acceptedValues, valueKey)(value)).toBeUndefined();
  });
});

describe('validateMarcTagField function', () => {
  it('when given value is invalid, returns appropriate message', () => {
    const indicator1 = 'f';
    const indicator2 = 'f';
    const value = '999';

    const MessageComponent = validateMarcTagField(indicator1, indicator2)(value);

    const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

    expect(getByText('This field cannot be updated')).toBeInTheDocument();
  });

  it('otherwise, returns undefined', () => {
    const indicator1 = '';
    const indicator2 = '';
    const value = '910';

    expect(validateMarcTagField(indicator1, indicator2)(value)).toBeUndefined();
  });
});

describe('validateMarcIndicatorField function', () => {
  it('when given value is invalid, returns appropriate message', () => {
    const field = '999';
    const indicator1 = 'f';
    const indicator2 = 'f';

    const MessageComponent = validateMarcIndicatorField(field, indicator1, indicator2);

    const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

    expect(getByText('This field cannot be updated')).toBeInTheDocument();
  });

  it('otherwise, returns undefined', () => {
    const field = '910';
    const indicator1 = 'a';
    const indicator2 = 'a';

    expect(validateMarcIndicatorField(field, indicator1, indicator2)).toBeUndefined();
  });
});

describe('validateSubfieldField function', () => {
  it('when given field or value is invalid, returns appropriate message', () => {
    const field = '910';
    const value = '';

    const MessageComponent = validateSubfieldField(field)(value);

    const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

    expect(getByText('Please enter a value')).toBeInTheDocument();
  });

  it('when given value and field are valid, returns undefined', () => {
    const field = '006';
    const value = '';

    const actual = validateSubfieldField(field)(value);

    expect(actual).toBeUndefined();
  });
});

describe('validateMoveField function', () => {
  it('when given field is equal to new field, returns appropriate message', () => {
    const field = '990';
    const fieldToMove = '990';

    const MessageComponent = validateMoveField(field)(fieldToMove);

    const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

    expect(getByText('Please choose a different field')).toBeInTheDocument();
  });

  it('otherwise, returns undefined', () => {
    const field = '900';
    const fieldToMove = '910';

    expect(validateMoveField(field)(fieldToMove)).toBeUndefined();
  });
});

describe('validateMARCWithDate function', () => {
  it('when given date value is invalid, returns correct message', () => {
    const value = '2021-11-23';

    const MessageComponent = validateMARCWithDate(value, true);

    const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

    expect(getByText('Please correct the syntax to continue')).toBeInTheDocument();
  });
});
