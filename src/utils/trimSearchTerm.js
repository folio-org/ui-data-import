/**
 * Remove whitespaces and '*' symbols from both sides of a string
 *
 * @param {string} searchTerm
 * @return {string} Trimmed string
 */
export const trimSearchTerm = searchTerm => {
  return (searchTerm || '').trim().replace(/^(\*+)/, '').replace(/(\*+)$/, '');
};
