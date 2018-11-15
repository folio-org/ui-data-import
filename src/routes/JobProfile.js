import React from 'react';

import UploadingDisplay from '../components/UplaodingDisplay';
import { Button, Icon, Pane, Paneset} from '@folio/stripes/components';


const JobProfile = props => {
  return (
      <Paneset>
          <Pane defaultWidth="20" paneTitle="Files">
              <Button
                  id="clickable-new-12"
                  href="#"
                  buttonStyle="primary paneHeaderNewButton"
                  marginBottom0
              >
                  Upload more files
              </Button>
              <UploadingDisplay />
          </Pane>

          <Pane
              defaultWidth="fill"
              paneTitle={<div>2nd Pane <Icon icon="down-caret" /></div>}
              paneSub="Job Profiles"
          >
          </Pane>
      </Paneset>

  );
};

export default JobProfile;
