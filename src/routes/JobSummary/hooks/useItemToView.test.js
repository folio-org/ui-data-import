import { act, render } from '@testing-library/react';
import { useItemToView } from './useItemToView';

function setup(...args) {
  const returnVal = {};
  function TestComponent() {
    Object.assign(returnVal, useItemToView(...args));
    return null;
  }
  render(<TestComponent />);
  return returnVal;
}

describe('useItemToView hook', () => {
  const storageKey = '@folio/data-import/job-log/entries';
  let mockStorage = {};

  const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  beforeAll(() => {
    global.Storage.prototype.setItem = jest.fn((key, value) => {
      mockStorage[key] = value;
    });
    global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
    global.Storage.prototype.removeItem = jest.fn((key) => delete mockStorage[key]);
  });

  beforeEach(() => {
    mockStorage = {};
  });

  afterEach(() => {
    mockConsoleWarn.mockReset();
  });

  afterAll(() => {
    global.Storage.prototype.setItem.mockReset();
    global.Storage.prototype.getItem.mockReset();
  });

  it('"itemToView" should have initial value of null', () => {
    const { itemToView } = setup(storageKey);

    expect(itemToView).toBeNull();
    expect(global.Storage.prototype.getItem).toHaveBeenLastCalledWith(storageKey);
  });

  it('should allow to update value of "itemToView" in storage', () => {
    const itemToViewData = setup(storageKey);
    const storageValue = {
      selector: `[aria-rowindex="${0}"]`,
      localClientTop: 50
    };

    act(() => {
      itemToViewData.setItemToView(storageValue);
    });
    expect(itemToViewData.itemToView).toEqual(storageValue);
    expect(global.Storage.prototype.setItem).toHaveBeenLastCalledWith(storageKey, JSON.stringify(storageValue));
    expect(mockStorage[storageKey]).toEqual(JSON.stringify(storageValue));
  });

  it('should allow to delete "itemToView" from storage', () => {
    const itemToViewData = setup(storageKey);
    const storageValue = {
      selector: `[aria-rowindex="${1}"]`,
      localClientTop: 100
    };

    // save new item to storage
    act(() => {
      itemToViewData.setItemToView(storageValue);
    });
    expect(itemToViewData.itemToView).toEqual(storageValue);

    // remove the item from storage
    act(() => {
      itemToViewData.deleteItemToView();
    });
    expect(itemToViewData.itemToView).toBeNull();
    expect(global.Storage.prototype.removeItem).toHaveBeenLastCalledWith(storageKey);
    expect(mockStorage[storageKey]).toBeUndefined();
  });

  it('when there is error getting item, should handle correctly', () => {
    global.Storage.prototype.getItem.mockImplementationOnce(() => {
      throw new Error('Error getting item from localStorage');
    });
    setup(storageKey);

    expect(mockConsoleWarn).toHaveBeenLastCalledWith('Error getting item from localStorage');
  });

  it('when there is error setting item, should handle correctly', () => {
    global.Storage.prototype.setItem.mockImplementationOnce(() => {
      throw new Error('Error setting item from localStorage');
    });
    const itemToViewData = setup(storageKey);
    const storageValue = {
      selector: `[aria-rowindex="${0}"]`,
      localClientTop: 50
    };

    act(() => {
      itemToViewData.setItemToView(storageValue);
    });

    expect(mockConsoleWarn).toHaveBeenLastCalledWith('Error setting item from localStorage');
  });

  it('when there is error removing item, should handle correctly', () => {
    global.Storage.prototype.removeItem.mockImplementationOnce(() => {
      throw new Error('Error removing item from localStorage');
    });
    const itemToViewData = setup(storageKey);

    act(() => {
      itemToViewData.deleteItemToView();
    });

    expect(mockConsoleWarn).toHaveBeenLastCalledWith('Error removing item from localStorage');
  });
});
