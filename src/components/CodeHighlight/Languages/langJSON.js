/**
 * Language definition file for JSON
 *
 * @param {string|object} code A code to highlight
 * @param {object} themeModule A CSS module object to take styles from
 * @returns {string} A code string marked up for highlighting
 */
export const langJSON = (code, themeModule) => {
  const codeString = typeof code === 'string' ? code : JSON.stringify(code, null, 2);
  const json = codeString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Declare a RE to find and mark all the tokens we are going to wrap with token spans in replace() method below:
  const re = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;

  return json.replace(re, match => {
    let tokenClass = 'number';

    if (/^"/.test(match)) {
      tokenClass = /:$/.test(match) ? 'key' : 'string';
    } else if (/true|false/.test(match)) {
      tokenClass = 'boolean';
    } else if (/null/.test(match)) {
      tokenClass = 'null';
    }

    return `<span class="${themeModule[tokenClass]}">${match}</span>`;
  });
};
