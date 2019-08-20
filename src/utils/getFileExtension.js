/** @param {File | { name: string }} file */
export const getFileExtension = file => {
  if (file && file.name) {
    const fileExtensionRegExp = /\.(\w+)$/;
    const [extension] = (file.name.match(fileExtensionRegExp) || []);

    return extension;
  }

  return null;
};
