/* global Nightmare, describe, it, before, after */

module.exports.test = (uiTestCtx) => {
  describe('Module test: ui-data-import:', function () {
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('Login > navigate to app > verify message > logout', () => {
      before((done) => {
        login(nightmare, config, done);
      });
      after((done) => {
        logout(nightmare, config, done);
      });
      it('should open app and see stripes-new-app-greeting', (done) => {
        nightmare
          .wait('#clickable-data-import-module')
          .click('#clickable-data-import-module')
          .wait('#data-import-module-display')
          .wait('#stripes-new-app-greeting')
          .then(() => { done(); })
          .catch(done);
      });
    });

    describe('Login > navigate to app settings > verify message > logout', () => {
      before((done) => {
        login(nightmare, config, done);
      });
      after((done) => {
        logout(nightmare, config, done);
      });
      it('should open app settings and see stripes-new-app-settings-message', (done) => {
        nightmare
          .wait(config.select.settings)
          .click(config.select.settings)
          .wait('a[href="/settings/data-import"]')
          .click('a[href="/settings/data-import"]')
          .wait('a[href="/settings/data-import/general"]')
          .click('a[href="/settings/data-import/general"]')
          .wait('#stripes-new-app-settings-message')
          .then(() => { done(); })
          .catch(done);
      });
    });
  });
};
