import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  touch,
  change,
  untouch,
} from 'redux-form';
import { identity } from 'lodash';

import {
  Pane,
  PaneMenu,
  Icon,
  IconButton,
  Button,
  Headline,
  TextArea,
  TextField,
  Checkbox,
  MultiSelection,
  OptionSegment,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import { validators } from './validators';

import css from './FileExtensionForm.css';

const formName = 'fileExtensionForm';

@stripesForm({
  form: formName,
  navigationCheck: true,
  enableReinitialize: true,
})
export class FileExtensionForm extends Component {
  static propTypes = {
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.closeButton = React.createRef();
    this.dataTypes = [
      'MARC',
      'Delimited',
      'EDIFACT',
    ];

    this.state = { dataTypesRequired: true };
  }

  componentDidMount() {
    this.closeButton.current.focus();
  }

  filterMultiSelect = (filterText, list) => {
    const filterRegExp = new RegExp(`^${filterText}`, 'i');
    const renderedItems = filterText ? list.filter(item => item.search(filterRegExp) !== -1) : list;
    const exactMatch = filterText ? (renderedItems.filter(item => item === filterText).length === 1) : false;

    return { renderedItems, exactMatch };
  };

  formatMultiSelect = ({ option, searchTerm }) => <OptionSegment searchTerm={searchTerm}>{option}</OptionSegment>;

  getAddFirstMenu() {
    const { onCancel } = this.props;

    return (
      <PaneMenu>
        <FormattedMessage id="ui-data-import.close">
          {ariaLabel => (
            <IconButton
              id="clickable-close-file-extension-dialog"
              ariaLabel={ariaLabel}
              icon="times"
              ref={this.closeButton}
              onClick={onCancel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  getLastMenu(isEditMode) {
    const {
      pristine,
      submitting,
    } = this.props;

    const action = isEditMode ? 'save' : 'create';
    const btnMessageIdEnding = action === 'create' ? 'settings.fileExtension.create' : action;

    return (
      <PaneMenu>
        <Button
          id={`${action}-file-extension`}
          type="submit"
          disabled={pristine || submitting}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          <FormattedMessage id={`ui-data-import.${btnMessageIdEnding}`} />
        </Button>
      </PaneMenu>
    );
  }

  renderActionMenu = menu => (
    <Button
      data-test-cancel-form-action
      buttonStyle="dropdownItem"
      onClick={() => this.handleCancel(menu)}
    >
      <Icon icon="times-circle">
        <FormattedMessage id="ui-data-import.cancel" />
      </Icon>
    </Button>
  );

  handleCancel = menu => {
    const { onCancel } = this.props;

    menu.onToggle();
    onCancel();
  };

  importBlockedChange = (meta, value) => {
    const { dispatch } = this.props;

    if (value) {
      dispatch(change(formName, 'dataTypes', []));
      dispatch(untouch(formName, 'dataTypes'));
    }

    this.setState({ dataTypesRequired: !value });
  };

  handleMultiSelectBlur = e => {
    e.preventDefault();

    const { dispatch } = this.props;

    dispatch(touch(formName, 'dataTypes'));
  };

  render() {
    const {
      initialValues,
      handleSubmit,
    } = this.props;

    const { dataTypesRequired } = this.state;

    const isEditMode = Boolean(initialValues.id);
    const paneTitle = !isEditMode
      ? <FormattedMessage id="ui-data-import.settings.fileExtension.newMapping" />
      : 'Edit';

    const headLine = !isEditMode
      ? <FormattedMessage id="ui-data-import.settings.fileExtension.newMapping" />
      : 'Extension';

    return (
      <form
        id="form-file-extension"
        data-test-file-extension-form
        className={css.form}
        onSubmit={handleSubmit}
      >
        <Pane
          defaultWidth="100%"
          firstMenu={this.getAddFirstMenu()}
          lastMenu={this.getLastMenu(isEditMode)}
          paneTitle={paneTitle}
          actionMenu={this.renderActionMenu}
        >
          <div className={css.formContent}>
            <Headline
              size="xx-large"
              tag="h2"
              data-test-header-title
            >
              {headLine}
            </Headline>
            <div data-test-description-field>
              <Field
                label={<FormattedMessage id="ui-data-import.description" />}
                name="description"
                component={TextArea}
              />
            </div>
            <div data-test-extension-field>
              <Field
                label={<FormattedMessage id="ui-data-import.settings.fileExtension.title" />}
                name="extension"
                required
                component={TextField}
                validate={validators.fileExtension}
              />
            </div>
            <div data-test-blocked-field>
              <p className={css.checkBoxLabel}>
                <FormattedMessage id="ui-data-import.settings.fileExtension.blockImport" />
              </p>
              <Field
                label={<FormattedMessage id="ui-data-import.settings.fileExtension.blockImport" />}
                name="importBlocked"
                type="checkbox"
                component={Checkbox}
                onChange={this.importBlockedChange}
              />
            </div>
            <div data-test-types-field>
              <Field
                label={<FormattedMessage id="ui-data-import.settings.fileExtension.dataTypes" />}
                name="dataTypes"
                component={MultiSelection}
                dataOptions={this.dataTypes}
                required={dataTypesRequired}
                disabled={!dataTypesRequired}
                validationEnabled
                itemToString={identity}
                validate={validators.dataTypes}
                filter={this.filterMultiSelect}
                formatter={this.formatMultiSelect}
                onBlur={this.handleMultiSelectBlur}
              />
            </div>
          </div>
        </Pane>
      </form>
    );
  }
}
