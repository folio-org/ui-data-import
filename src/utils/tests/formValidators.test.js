import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import {
  validateAcceptedValues,
  validateFileExtension,
  validateIntegers,
  validateMarcIndicatorField,
  validateMarcTagField,
  validateMARCWithDate,
  validateMARCWithElse,
  validateMoveField,
  validateQuotedStringOrMarcPath,
  validateRepeatableActionsField,
  validateSubfieldField,
} from '../formValidators';

describe('form validators', () => {
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

  describe('validateMARCWithElse function', () => {
    it('when the value is not wrapped in quotation marks, returns error', () => {
      const value = 'text';

      const MessageComponent = validateMARCWithElse(value);

      const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

      expect(getByText('Please correct the syntax to continue')).toBeInTheDocument();
    });

    it('when ###REMOVE### value is not allowed, returns error', () => {
      const value = '###REMOVE###';

      const MessageComponent = validateMARCWithElse(value, false);

      const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

      expect(getByText('Please correct the syntax to continue')).toBeInTheDocument();
    });

    it('when the value does not have subfield but it is required, returns error', () => {
      const value = '909';

      const MessageComponent = validateMARCWithElse(value, false, true);

      const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

      expect(getByText('Please correct the syntax to continue')).toBeInTheDocument();
    });

    it('when the value is correct, returns undefined', () => {
      const correctConditions = [
        validateMARCWithElse('910'),
        validateMARCWithElse('910$a'),
        validateMARCWithElse('910$a; else "text"; else 910'),
        validateMARCWithElse('910$a "text"'),
        validateMARCWithElse('"text"'),
        validateMARCWithElse('LDR'),
        validateMARCWithElse('LDR/7'),
        validateMARCWithElse('005/7-10'),
        validateMARCWithElse('###REMOVE###', true),
      ];

      correctConditions.forEach(result => expect(result).toBeUndefined());
    });
  });

  describe('validateQuotedStringOrMarcPath function', () => {
    it('when the value is not wrapped in quotation marks, returns error', () => {
      const value = 'text';

      const MessageComponent = validateQuotedStringOrMarcPath(value);

      const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

      expect(getByText('Non-MARC value must use quotation marks')).toBeInTheDocument();
    });

    it('when ###REMOVE### value is not allowed, returns error', () => {
      const value = '###REMOVE###';

      const MessageComponent = validateQuotedStringOrMarcPath(value, false);

      const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

      expect(getByText('Non-MARC value must use quotation marks')).toBeInTheDocument();
    });

    it('when the value does not have subfield but it is required, returns error', () => {
      const value = '909';

      const MessageComponent = validateQuotedStringOrMarcPath(value, false, true);

      const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

      expect(getByText('Non-MARC value must use quotation marks')).toBeInTheDocument();
    });

    it('when the value is correct, returns undefined', () => {
      const correctConditions = [
        validateQuotedStringOrMarcPath('910'),
        validateQuotedStringOrMarcPath('910$a'),
        validateQuotedStringOrMarcPath('910$a; else "text"; else 910'),
        validateQuotedStringOrMarcPath('910$a "text"'),
        validateQuotedStringOrMarcPath('"text"'),
        validateQuotedStringOrMarcPath('LDR'),
        validateQuotedStringOrMarcPath('LDR/7'),
        validateQuotedStringOrMarcPath('005/7-10'),
        validateQuotedStringOrMarcPath('###REMOVE###', true),
      ];

      correctConditions.forEach(result => expect(result).toBeUndefined());
    });
  });

  describe('validateIntegers function', () => {
    const validationErrorMessage = 'Please enter a whole number greater than 0 and less than 1000 to continue';

    it('when value is less than 1, returns correct message', () => {
      const value = '"0"';

      const MessageComponent = validateIntegers(value);

      const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

      expect(getByText(validationErrorMessage)).toBeInTheDocument();
    });

    it('when value is greater than 999, returns correct message', () => {
      const value = '"1000"';

      const MessageComponent = validateIntegers(value);

      const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

      expect(getByText(validationErrorMessage)).toBeInTheDocument();
    });

    it('when value is fractional number, returns correct message', () => {
      const value = '"2.5"';

      const MessageComponent = validateIntegers(value);

      const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

      expect(getByText(validationErrorMessage)).toBeInTheDocument();
    });

    it('when value is not a number, returns correct message', () => {
      const value = '"text"';

      const MessageComponent = validateIntegers(value);

      const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

      expect(getByText(validationErrorMessage)).toBeInTheDocument();
    });

    it('when value is not wrapped into quotes, returns correct message', () => {
      const value = '100';

      const MessageComponent = validateIntegers(value);

      const { getByText } = renderWithIntl(MessageComponent, translationsProperties);

      expect(getByText('Non-MARC value must use quotation marks')).toBeInTheDocument();
    });

    it('otherwise, returns undefined', () => {
      const value = '"100"';

      expect(validateIntegers(value)).toBeUndefined();
    });
  });
});
