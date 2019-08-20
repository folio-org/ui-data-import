/** @param {File | { name: string }} file */
export const getFileExtension = file => {
  if (file && file.name) {
    const fileExtensionRegExp = /\.(\w+)$/;
    const [extension = null] = (file.name.match(fileExtensionRegExp) || []);

    return extension && extension.toLowerCase();
  }

  return null;
};
