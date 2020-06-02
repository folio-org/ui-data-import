import { isEmpty } from 'lodash';

export const updateValueWithTemplate = (option, template) => {
  const findPattern = /(?<=\*\*)(\w+)(?=\*\*)/g;
  const replacePattern = /\*\*(\w+)\*\*/;

  let updatedString = template;
  const match = template.match(findPattern);

  if (!isEmpty(match)) {
    match.forEach(key => {
      updatedString = updatedString.replace(replacePattern, option[key]);
    });
  }

  return updatedString;
};
