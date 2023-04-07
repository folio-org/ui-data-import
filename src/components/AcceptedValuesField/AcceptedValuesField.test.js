import React from 'react';
import { waitFor } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { AcceptedValuesField } from './AcceptedValuesField';

jest.mock('..', () => ({ withReferenceValues: () => <span>withReferenceValues</span> }));

const acceptedValuesListProp = [
  {
    label: 'option 1',
    name: 'option_1',
  }, {
    label: 'option 2',
    name: 'option_2',
  },
];

const okapiProps = {
  tenant: 'test tenant',
  token: 'test token',
  url: 'test url',
};

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

const renderAcceptedValuesField = ({
  acceptedValuesList,
  wrapperSources,
  wrapperSourcesFn,
  optionTemplate,
  isFormField,
}) => {
  const wrappedComponent = () => <input />;

  const component = () => (
    <AcceptedValuesField
      name="testField"
      component={wrappedComponent}
      acceptedValuesList={acceptedValuesList}
      wrapperSources={wrapperSources}
      wrapperSourcesFn={wrapperSourcesFn}
      optionLabel="name"
      optionValue="name"
      optionTemplate={optionTemplate}
      setAcceptedValues={() => {}}
      okapi={okapiProps}
      isFormField={isFormField}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

global.fetch = jest.fn();

describe('Accepted values field component', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderAcceptedValuesField({
      acceptedValuesList: acceptedValuesListProp,
      isFormField: true,
    });

    await runAxeTest({ rootNode: container });
  });

  describe('when a wrapped component is the form field component', () => {
    it('then the wrapped component should be rendered', async () => {
      const { findByText } = renderAcceptedValuesField({
        acceptedValuesList: acceptedValuesListProp,
        isFormField: true,
      });

      await waitFor(() => expect(findByText('withReferenceValues')).toBeDefined());
    });
  });

  describe('when a wrapped component is not the form field component', () => {
    it('then the wrapped component should be rendered', async () => {
      const { findByText } = renderAcceptedValuesField({
        acceptedValuesList: acceptedValuesListProp,
        isFormField: false,
      });

      await waitFor(() => expect(findByText('withReferenceValues')).toBeDefined());
    });
  });

  describe('when wrapper sources were provided without accepted values', () => {
    describe('and there is no option templates', () => {
      it('then the wrapped component should be rendered with options received from the server', async () => {
        global.fetch
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              statisticalCodes: [
                {
                  id: '1',
                  code: 'ASER',
                  name: 'Active serial',
                  statisticalCodeTypeId: '1',
                }, {
                  id: '2',
                  code: 'arch',
                  name: 'UC',
                  statisticalCodeTypeId: '2',
                },
              ],
            }),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              statisticalCodeTypes: [
                {
                  id: '1',
                  name: 'ARL',
                }, {
                  id: '2',
                  name: 'DISC',
                },
              ],
            }),
          });

        const wrapperSources = [{
          wrapperSourceLink: '/statistical-codes',
          wrapperSourcePath: 'statisticalCodes',
        }, {
          wrapperSourceLink: '/statistical-codes-types',
          wrapperSourcePath: 'statisticalCodeTypes',
        }];
        const { findByText } = renderAcceptedValuesField({ wrapperSources });

        await waitFor(() => expect(findByText('withReferenceValues')).toBeDefined());
      });
    });

    describe('and options template was provided', () => {
      it('then the wrapped component should be rendered with options generated by the template', async () => {
        global.fetch
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              statisticalCodes: [
                {
                  id: '1',
                  code: 'ASER',
                  name: 'Active serial',
                  statisticalCodeTypeId: '1',
                }, {
                  id: '2',
                  code: 'arch',
                  name: 'UC',
                  statisticalCodeTypeId: '2',
                },
              ],
            }),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              statisticalCodeTypes: [
                {
                  id: '1',
                  name: 'ARL',
                }, {
                  id: '2',
                  name: 'DISC',
                },
              ],
            }),
          });

        const wrapperSources = [{
          wrapperSourceLink: '/statistical-codes',
          wrapperSourcePath: 'statisticalCodes',
        }, {
          wrapperSourceLink: '/statistical-codes-types',
          wrapperSourcePath: 'statisticalCodeTypes',
        }];
        const { findByText } = renderAcceptedValuesField({
          wrapperSources,
          wrapperSourcesFn: 'statisticalCodeTypeName',
          optionTemplate: '**statisticalCodeTypeName**: **code** - **name**',
        });

        await waitFor(() => expect(findByText('withReferenceValues')).toBeDefined());
      });
    });

    describe('and the request is unsuccessful', () => {
      it('then the wrapped component should be rendered without values which should be received from the server', async () => {
        global.fetch
          .mockResolvedValueOnce({ ok: false })
          .mockResolvedValueOnce({ ok: false });

        const wrapperSources = [{
          wrapperSourceLink: '/statistical-codes',
          wrapperSourcePath: 'statisticalCodes',
        }, {
          wrapperSourceLink: '/statistical-codes-types',
          wrapperSourcePath: 'statisticalCodeTypes',
        }];
        const { findByText } = renderAcceptedValuesField({
          wrapperSources,
          wrapperSourcesFn: 'statisticalCodeTypeName',
          optionTemplate: '**statisticalCodeTypeName**: **code** - **name**',
        });

        await waitFor(() => expect(findByText('withReferenceValues')).toBeDefined());
        await waitFor(() => expect(mockConsoleError).toHaveBeenCalledTimes(2));
      });
    });
  });
});
