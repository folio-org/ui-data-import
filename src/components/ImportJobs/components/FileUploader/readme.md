# `FileUploader`

Component is built on top of [ReactDropzone](https://react-dropzone.netlify.com) component. Provides drag-and-drop zone for file uploading. Note that uploading files to a server is out of scope of this component and should be implemented additionally on the client and server.

## Basic Usage

```javascript
<FileUploader
  title="Drop to start import"
  uploadBtnText="or choose files"
  isDropZoneActive={isDropZoneActive}
  onDrop={onDrop}
/>
```

## `onDrop` callback example

`onDrop` callback takes an array of accepted files as the first argument and an array of rejected files as the second argument. Files are being accepted or rejected based on `accept` property. Find more info about `accept` property [here](https://react-dropzone.netlify.com/#src).

Example of `onDrop` method that validates files based on their extensions with some custom logic.

```javascript
/**
  * @param  {Array<File>} acceptedFiles
  * @param  {Array<File>} rejectedFiles
  */
onDrop = (acceptedFiles, rejectedFiles) => {
  const isValidFileExtensions = this.validateFileExtensions(acceptedFiles);

  if (isValidFileExtensions) {
    this.setState({
      isDropZoneActive: false,
      redirect: true,
      acceptedFiles,
      rejectedFiles,
    });

    return;
  }

  this.setState({ isDropZoneActive: false });
  this.showModal();
};
```

## Using with `children` property

`FileUploader` component accepts `children` property that can be node, array of nodes or function.

### Example of using `children` property with a component

```javascript
<FileUploader
  title={titleText}
  uploadBtnText={uploadBtnText}
  isDropZoneActive={isDropZoneActive}
  onDrop={onDrop}
>
  <FormattedMessage id={id} />
</FileUploader>
```

Here `<FormattedMessage id={id} />` will be rendered below the title and upload button.

### Example of using `children` property with a function

```javascript
<FileUploader
  title={titleText}
  uploadBtnText={uploadBtnText}
  isDropZoneActive={isDropZoneActive}
  onDrop={onDrop}
>
  {openFileUploadDialogWindow => (
    <InvalidFilesModal
      isModalOpen={isModalOpen}
      onConfirmModal={hideModal}
      openFileUploadDialogWindow={openFileUploadDialogWindow}
    />
  )}
</FileUploader>
```

When using a function as `children` this function accepts `openFileUploadDialogWindow` as an argument and `FileUploader` renders the returned value.
`openFileUploadDialogWindow` is a function provided by the `ReactDropzone` component that opens a modal file upload window for manually selecting files from the OS file system.

## `FileUploader` props

`FileUploader` component is built on top of the `ReactDropzone` component. For this reason, he has both his own props and some of the `ReactDropzone` props.

### Own props

| Prop             | Type                   | Default | Required | Description                                  |
|------------------|------------------------|---------|----------|----------------------------------------------|
| title            | node                   |         | Yes      | Title of the component                       |
| uploadBtnText    | node                   |         | Yes      | Upload files button text                      |
| isDropZoneActive | bool                   |         | Yes      | Value specifying whether dropzone is active  |
| children         | node \| node[] \| func |         | No       |                                              |

### Props passed to `ReactDropzone`

| Prop                 | Type               | Default  | Required | Description                                                                                           |
|----------------------|--------------------|----------|----------|-------------------------------------------------------------------------------------------------------|
| onDrop               | func               |          | Yes      | `onDrop` callback that takes `acceptedFiles` and `rejectedFiles` as arguments                         |
| onDragEnter          | func               |          | No       | `onDragEnter` callback                                                                                |
| onDragLeave          | func               |          | No       | `onDragLeave` callback                                                                                |
| className            | string             |          | No       | `FileUploader` puts default styles in case the property is not passed                                 |
| style                | object             |          | No       | CSS styles to apply                                                                                   |
| acceptClassName      | string             |          | No       | `className` to apply when drop will be accepted                                                       |
| activeClassName      | string             |          | No       | `className` to apply when drag is active                                                              |
| rejectClassName      | string             |          | No       | `className` to apply when drop will be rejected                                                       |
| disabledClassName    | string             |          | No       | `className` to apply when dropzone is disabled                                                        |
| maxSize              | number             | Infinity  | No       | Maximum file size (in bytes)                                                                           |
| getDataTransferItems | func               |          | No       | Find info about `getDataTransferItems` [here](https://react-dropzone.netlify.com/#extending-dropzone) |
| accept               | string \| string[] |          | No       | Allow specific types of files                                                                           |

Find more info about `ReactDropzone` props by following this [link](https://react-dropzone.netlify.com/#proptypes).
