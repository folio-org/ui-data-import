import { fireEvent } from '@testing-library/react';

export const openEditShortcut = element => {
  fireEvent.keyDown(element, {
    key: 'Ctrl',
    code: 'CtrlLeft',
    which: 17,
    keyCode: 17,
  });

  fireEvent.keyDown(element, {
    key: 'Alt',
    code: 'AltLeft',
    which: 18,
    keyCode: 18,
    ctrlKey: true,
  });

  fireEvent.keyDown(element, {
    key: 'e',
    keyCode: 69,
    which: 69,
    altKey: true,
    ctrlKey: true,
  });
};

export const duplicateRecordShortcut = element => {
  fireEvent.keyDown(element, {
    key: 'Alt',
    code: 'AltLeft',
    which: 18,
    keyCode: 18,
  });

  fireEvent.keyDown(element, {
    key: 'c',
    keyCode: 67,
    which: 67,
    altKey: true,
  });
};
