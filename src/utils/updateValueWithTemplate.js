import { isEmpty } from 'lodash';

export const updateValueWithTemplate = (option, template) => {
  const findPattern = /\*\*(\w+)\*\*/g;

  let updatedString = template;
  const match = template.match(findPattern);

  if (!isEmpty(match)) {
    match.forEach(key => {
      const currentKey = key.replace(/\*\*/g, '');
      const replacePattern = new RegExp(`\\*\\*${currentKey}\\*\\*`, 'g');
      const templateHasOption = !isEmpty(template.match(currentKey));

      if (templateHasOption) {
        updatedString = updatedString.replace(replacePattern, option[currentKey]);
      }
    });
  }

  return updatedString;
};
