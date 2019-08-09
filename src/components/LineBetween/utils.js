import {
  useState,
  useEffect,
  useRef,
} from 'react';

/** @param {string | Element} selector */
export const getElement = selector => {
  if (selector instanceof Element) {
    return selector;
  }

  try {
    return document.querySelector(selector);
  } catch (error) {
    return null;
  }
};

/** @param {Element} parentElem */
export const usePortal = parentElem => {
  const [rootElem] = useState(document.createElement('div'));
  const targetRef = useRef(rootElem);

  useEffect(() => {
    parentElem.appendChild(targetRef.current);

    return () => targetRef.current.remove();
  }, []);

  return targetRef.current;
};
