/* istanbul ignore file */
import React from 'react';

import {
  Row,
  Col,
} from '@folio/stripes/components';

import css from './RecordPreview.css';

const RecordPreview = () => {
  return (
    <Row>
      <Col xs={12} sm={7}>
        <textarea className={css.recordPreviewEditor} rows="10" />
      </Col>
      <Col xs={12} sm={5}>
        <div className={css.recordPreviewErrors}>
          <div>
            <strong>ERROR 123412341</strong>
          </div>
          <p>Invalid Input</p>
          <div>
            <div className={css.recordPreviewError}>
              <div>”Maiin Library”</div>
              <div>is not valid input for</div>
              <div>
                the <strong>location</strong> field
              </div>
            </div>
            <div className={css.recordPreviewError}>
              <div>”1239”</div>
              <div>is not valid input for</div>
              <div>
                the <strong>ISBN</strong> field
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default RecordPreview;
