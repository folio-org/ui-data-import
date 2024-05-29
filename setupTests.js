const originalError = console.error;
console.error = (...args) => {
  // console.log(args);
  const test1 = 'Support for defaultProps will be removed';
  const test2 = 'Warning: findDOMNode is deprecated';
  const stdtc = 'SearchForm';
  // console.log(args[0]);
  if (args?.[0]?.includes(test2) || args?.[1]?.includes(stdtc) || args?.[0]?.includes(test1)) {
    return;
  }
  originalError.call(console, ...args);
};
