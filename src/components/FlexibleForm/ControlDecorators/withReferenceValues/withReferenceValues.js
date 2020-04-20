import React, {
  memo,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import {
  createOkapiHeaders,
  createUrl,
  isFormattedMessage,
  isTranslationId,
} from '../../../../utils';

import { OptionsList } from '../partials';

import styles from './withReferenceValues.css';

export const withReferenceValues = memo(props => {
  const {
    id,
    input,
    WrappedComponent,
    wrapperLabel,
    wrapperSourceLink,
    wrapperSourcePath,
    wrapperExplicitInsert,
    okapi,
    ...rest
  } = props;

  const [hasLoaded, setHasLoaded] = useState(false);
  const [dataOptions, setDataOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(input?.value || '');
  const [wrapperValue, setWrapperValue] = useState(null);

  const fetchList = async () => {
    try {
      const response = await fetch(
        createUrl(`${okapi.url}${wrapperSourceLink}`, null, false),
        { headers: { ...createOkapiHeaders(okapi) } },
      );
      const body = await response.json();
      const curDataOptions = get(body, wrapperSourcePath, []);

      setDataOptions(curDataOptions);
      setHasLoaded(true);
    } catch (e) {
      console.log('Error: ', e); // eslint-disable-line no-console
      setHasLoaded(false);
    }
  };

  const handleChange = e => {
    setCurrentValue(e.target ? e.target.value : e);
    input.onChange(e);
  };

  useLayoutEffect(() => {
    let setCancel = false;

    if (!setCancel) {
      fetchList().then();
    }

    return () => {
      setCancel = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    let newValue = '';

    if (wrapperValue) {
      if (wrapperExplicitInsert || !currentValue) {
        newValue = `"${wrapperValue}"`;
      } else {
        newValue = `${currentValue} "${wrapperValue}"`;
      }
    }

    if (newValue) {
      setCurrentValue(newValue);
      handleChange(newValue);
    }
  }, [wrapperValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const needsTranslation = wrapperLabel && !isFormattedMessage(wrapperLabel) && isTranslationId(wrapperLabel);
  const currentInput = useRef(input);

  const {
    onBlur,
    onDragStart,
    onDrop,
    onFocus,
  } = input;

  return (
    <div className={styles.decorator}>
      <WrappedComponent
        value={currentValue}
        inputRef={currentInput}
        onBlur={onBlur}
        onChange={handleChange}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onFocus={onFocus}
        loading={!hasLoaded}
        {...rest}
      />
      {needsTranslation ? (
        <FormattedMessage id={wrapperLabel}>
          {localized => (
            <OptionsList
              id={id}
              label={localized}
              dataOptions={dataOptions}
              optionValue="id"
              optionLabel="name"
              className={styles['options-dropdown']}
              disabled={!hasLoaded}
              onSelect={setWrapperValue}
            />
          )}
        </FormattedMessage>
      ) : (
        <OptionsList
          id={id}
          label={wrapperLabel}
          dataOptions={dataOptions}
          optionValue="id"
          optionLabel="name"
          className={styles['options-dropdown']}
          disabled={!hasLoaded}
          onSelect={setWrapperValue}
        />
      )}
    </div>
  );
});

withReferenceValues.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  WrappedComponent: PropTypes.oneOfType([React.Component, PropTypes.func]).isRequired,
  okapi: PropTypes.shape({ url: PropTypes.string }).isRequired,
  wrapperSourceLink: PropTypes.string.isRequired,
  wrapperSourcePath: PropTypes.string.isRequired,
  wrapperExplicitInsert: PropTypes.bool,
  id: PropTypes.string,
  wrapperLabel: PropTypes.oneOfType([PropTypes.string, Node]),
};

withReferenceValues.defaultProps = {
  id: null,
  wrapperLabel: 'ui-data-import.settings.mappingProfiles.map.wrapper.acceptedValues',
  wrapperExplicitInsert: false,
};
