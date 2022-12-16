jest.mock('@folio/stripes/data-transfer-components', () => ({
  ...jest.requireActual('@folio/stripes/data-transfer-components'),
}), { virtual: true });
