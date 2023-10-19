/*
 * suppress "test was not wrapped in act" output from testing-library
 * because, we know, TL, we know. we're gonna file a ticket to fix it
 * but Jira is down today.
 */
const og = console.error;
console.error = (m, ...av) => {
  if (m.indexOf('inside a test was not wrapped in act') === -1) {
    og(m, ...av);
  }
};
