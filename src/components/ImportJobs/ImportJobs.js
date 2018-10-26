import React from 'react';
import { FormattedMessage } from 'react-intl';

import FileUpload from './components/FileUpload';

class ImportJobs extends React.Component {
  render() {
    return (
      <FileUpload
        title={<FormattedMessage id="ui-data-import.uploadTitle" />}
        uploadBtnText={<FormattedMessage id="ui-data-import.uploadBtnText" />}
      />
    );
  }
}

export default ImportJobs;
