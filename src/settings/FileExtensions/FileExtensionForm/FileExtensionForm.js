import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, touch, change, untouch } from 'redux-form';

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

import validators from './validators';

import css from '../FileExtensions.css';

const formName = 'fileExtensionForm';

class FileExtensionForm extends React.Component {
  static propTypes = {
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    initialValues: PropTypes.object,
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

  formatMultiSelect = ({ option, searchTerm }) => {
    if (option) {
      return <OptionSegment searchTerm={searchTerm}>{option}</OptionSegment>;
    }

    return null;
  };

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

  renderActionMenu = menu => {
    const { onCancel } = this.props;

    const { onToggle } = menu;
    const handleClick = () => {
      onCancel();
      onToggle();
    };

    return (
      <Button
        data-test-cancel-form-action
        buttonStyle="dropdownItem"
        onClick={handleClick}
      >
        <Icon icon="times-circle">
          <FormattedMessage id="ui-data-import.cancel" />
        </Icon>
      </Button>
    );
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
            <Field
              label={<FormattedMessage id="ui-data-import.description" />}
              name="description"
              component={TextArea}
            />
            <Field
              label={<FormattedMessage id="ui-data-import.settings.fileExtension.title" />}
              name="extension"
              required
              component={TextField}
              validate={validators.fileExtension}
            />
            <div>
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
            <Field
              label={<FormattedMessage id="ui-data-import.settings.fileExtension.dataTypes" />}
              name="dataTypes"
              component={MultiSelection}
              dataOptions={this.dataTypes}
              itemToString={option => option}
              required={this.state.dataTypesRequired}
              disabled={!this.state.dataTypesRequired}
              validationEnabled
              validate={validators.dataTypes}
              filter={this.filterMultiSelect}
              formatter={this.formatMultiSelect}
              onBlur={this.handleMultiSelectBlur}
            />
          </div>
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: formName,
  navigationCheck: true,
  enableReinitialize: true,
})(FileExtensionForm);
