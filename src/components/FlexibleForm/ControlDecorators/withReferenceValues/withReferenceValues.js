import React, {
  useState,
  useEffect,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  createOkapiHeaders,
  createUrl,
  isFormattedMessage,
  isTranslationId,
} from '../../../../utils';

import { Preloader } from '../../../Preloader';

import { OptionsList } from '../partials';

export const withReferenceValues = WrappedComponent => props => {
  console.log('Wrapped props: ', props);
  const {
    id,
    wrapperLabel,
    wrapperSourceLink,
    okapi,
    ...rest
  } = props;

  const [hasLoaded, setHasLoaded] = useState(false);
  const [dataOptions, setDataOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(null /* value */);
  const [wrapperValue, setWrapperValue] = useEffect(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        createUrl(`${okapi.url}${wrapperSourceLink}`, null, false),
        { headers: { ...createOkapiHeaders(okapi) } },
      );
      const body = await response.json();

      setDataOptions(body);
      setHasLoaded(true);
    } catch (e) {
      setHasLoaded(false);
    }
  };

  useEffect(() => {
    let setCancel = false;

    /*
    if (!setCancel) {
      fetchData();
    }
    */

    return () => {
      setCancel = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const newValue = `${currentValue} ${wrapperValue}`;

    setCurrentValue(newValue);
  }, [wrapperValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const needsTranslation = wrapperLabel && !isFormattedMessage(wrapperLabel) && isTranslationId(wrapperLabel);

  return (
    <div>
      {hasLoaded ? (
        <>
          <WrappedComponent
            value={currentValue}
            {...rest}
          />
          {needsTranslation ? (
            <FormattedMessage id={wrapperLabel}>
              {localized => (
                <OptionsList
                  id={id}
                  label={localized}
                  dataOptions={dataOptions}
                  onSelect={setWrapperValue}
                />
              )}
            </FormattedMessage>
          ) : (
            <OptionsList
              id={id}
              label={wrapperLabel}
              dataOptions={dataOptions}
              onSelect={setWrapperValue}
            />
          )}
        </>
      ) : <Preloader />};
    </div>
  );
};
