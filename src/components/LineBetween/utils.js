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

/** @param {Element} parentElement */
export const usePortal = parentElement => {
  const [rootElem] = useState(document.createElement('div'));
  const targetRef = useRef(rootElem);

  useEffect(() => {
    const targetElement = targetRef.current;

    parentElement.appendChild(targetElement);

    return () => targetElement.remove();
  }, [parentElement]);

  return targetRef.current;
};
