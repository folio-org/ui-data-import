const requestConfiguration = 'data-import/splitStatus';

export function getStorageConfiguration(ky) {
  return ky.get(requestConfiguration).json();
}
