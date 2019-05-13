export const htmlDecode = input => {
  return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent;
};
