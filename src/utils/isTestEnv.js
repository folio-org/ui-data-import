/**
 * Finds out if execution context is in test environment or not
 *
 * @return {boolean}
 */
export const isTestEnv = () => process.env.NODE_ENV === 'test';
