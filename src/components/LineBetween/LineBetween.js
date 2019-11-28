import React, {
  Fragment,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';

import { getElement } from './utils';
import { Line } from './Line';

const anchorTextValues = {
  x: {
    left: 0,
    center: 0.5,
    right: 1,
  },
  y: {
    top: 0,
    center: 0.5,
    bottom: 1,
  },
};
const ORIENTATIONS = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
};
const zIndex = -1;

export const LineBetween = props => {
  const {
    from,
    to,
    container,
    fromAnchor,
    toAnchor,
    fromAnchorOffset = '',
    toAnchorOffset = '',
    orientation = ORIENTATIONS.VERTICAL,
  } = props;
  const [fromElement, setFromElement] = useState();
  const [toElement, setToElement] = useState();

  useEffect(() => {
    setFromElement(getElement(from, container));
    setToElement(getElement(to, container));
  }, [container, from, to]);

  if (!fromElement || !toElement) {
    return null;
  }

  const fromElementDimensions = fromElement.getBoundingClientRect();
  const toElementDimensions = toElement.getBoundingClientRect();

  const parseAnchorText = (value, axis) => anchorTextValues[axis][value];

  const parsePixelValue = value => {
    const pixelValueRegExp = /^-?\d*(\.\d+)?px$/; // matches `12px`, `.5px`, `12.57px`, `-0.4px`
    const valid = pixelValueRegExp.test(value);

    return valid ? Number.parseFloat(value) : 0;
  };

  const parseAnchorOffset = anchorOffset => {
    const [x, y] = anchorOffset.split(' ');

    return {
      x: parsePixelValue(x),
      y: parsePixelValue(y),
    };
  };

  const parseAnchorPercent = value => {
    const percentValueRegExp = /^\d*(\.\d+)?%$/; // matches `20%`, `12.5%`
    const valid = percentValueRegExp.test(value);

    if (!valid) {
      return null;
    }

    return Number.parseFloat(value) / 100;
  };

  const getAnchorValue = (anchorPart, axis) => {
    const textValue = parseAnchorText(anchorPart, axis);

    if (!isNil(textValue)) {
      return textValue;
    }
    const percentValue = parseAnchorPercent(anchorPart);

    if (!isNil(percentValue)) {
      return percentValue;
    }

    return 0.5; // default value
  };

  const parseAnchor = anchor => {
    const anchorValues = anchor.split(' ');
    const [x, y] = anchorValues;

    if (anchorValues.length === 1) {
      return {
        x: getAnchorValue(x, 'x'),
        y: getAnchorValue(x, 'y'),
      };
    }

    return {
      x: getAnchorValue(x, 'x'),
      y: getAnchorValue(y, 'y'),
    };
  };

  const getCoordinates = () => {
    const fromAnchorCoordinates = parseAnchor(fromAnchor);
    const toAnchorCoordinates = parseAnchor(toAnchor);
    const fromAnchorOffsetValue = parseAnchorOffset(fromAnchorOffset);
    const toAnchorOffsetValue = parseAnchorOffset(toAnchorOffset);

    let offsetX = window.pageXOffset || document.documentElement.scrollLeft;
    let offsetY = window.pageYOffset || document.documentElement.scrollTop;

    const containerElement = getElement(container);

    if (containerElement) {
      const containerElementDimensions = containerElement.getBoundingClientRect();

      offsetX -= containerElementDimensions.left + (window.pageXOffset || document.documentElement.scrollLeft);
      offsetY -= containerElementDimensions.top + (window.pageYOffset || document.documentElement.scrollTop);
    }

    const x0 = fromElementDimensions.left + fromElementDimensions.width * fromAnchorCoordinates.x + offsetX + fromAnchorOffsetValue.x;
    const y0 = fromElementDimensions.top + fromElementDimensions.height * fromAnchorCoordinates.y + offsetY + fromAnchorOffsetValue.y;
    const x1 = toElementDimensions.left + toElementDimensions.width * toAnchorCoordinates.x + offsetX + toAnchorOffsetValue.x;
    const y1 = toElementDimensions.top + toElementDimensions.height * toAnchorCoordinates.y + offsetY + toAnchorOffsetValue.y;

    return {
      x0,
      y0,
      x1,
      y1,
    };
  };

  const coords = getCoordinates();

  const dy = coords.y1 - coords.y0;
  const dx = coords.x1 - coords.x0;

  if (dy === 0 || dx === 0) {
    return (
      <Line
        {...props}
        x0={coords.x0}
        y0={coords.y0}
        x1={coords.x1}
        y1={coords.y1}
        zIndex={zIndex}
      />
    );
  }

  if (orientation === ORIENTATIONS.HORIZONTAL) {
    return (
      <Fragment>
        <Line
          {...props}
          x0={coords.x0}
          y0={coords.y0}
          x1={coords.x0}
          y1={coords.y1}
          zIndex={zIndex}
        />
        <Line
          {...props}
          x0={coords.x0}
          y0={coords.y1}
          x1={coords.x1}
          y1={coords.y1}
          zIndex={zIndex}
        />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Line
        {...props}
        x0={coords.x0}
        y0={coords.y0}
        x1={coords.x1}
        y1={coords.y0}
        zIndex={zIndex}
      />
      <Line
        {...props}
        x0={coords.x1}
        y0={coords.y0}
        x1={coords.x1}
        y1={coords.y1}
        zIndex={zIndex}
      />
    </Fragment>
  );
};

LineBetween.propTypes = {
  from: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Element)]).isRequired,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Element)]).isRequired,
  container: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Element)]),
  fromAnchor: PropTypes.string,
  toAnchor: PropTypes.string,
  fromAnchorOffset: PropTypes.string,
  toAnchorOffset: PropTypes.string,
  orientation: PropTypes.oneOf([ORIENTATIONS.HORIZONTAL, ORIENTATIONS.VERTICAL]),
  borderColor: PropTypes.string,
  borderStyle: PropTypes.string,
  borderWidth: PropTypes.number,
  className: PropTypes.string,
  zIndex: PropTypes.number,
};
