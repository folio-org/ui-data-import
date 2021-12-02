import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { generateSettingsLabel } from '../generateSettingsLabel';

describe('generateSettingsLabel function', () => {
  it('generates settings label with given label id', () => {
    const labelId = 'jobProfiles.title';
    const iconKey = 'jobProfiles';
    const LabelComponent = generateSettingsLabel(labelId, iconKey);

    const { getByText } = renderWithIntl(LabelComponent, translationsProperties);

    expect(getByText('Job profiles')).toBeInTheDocument();
  });
});
