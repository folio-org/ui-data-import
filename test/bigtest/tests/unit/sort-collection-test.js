import { expect } from 'chai';
import {
  describe,
  it,
} from '@bigtest/mocha';

import { sortCollection } from '../../../../src/utils';
import {
  convertDate,
  DATE_TYPES,
} from '../../../../src/components/Jobs/utils';

const statuses = {
  FIRST_STATUS: 'FIRST_STATUS',
  SECOND_STATUS: 'SECOND_STATUS',
  THIRD_STATUS: 'THIRD_STATUS',
};

const collectionUnsorted = [
  {
    status: statuses.FIRST_STATUS,
    number: 3,
    date: '2018-10-20T23:31:45.000',
  },
  {
    status: statuses.FIRST_STATUS,
    number: 1,
    date: '2018-11-20T13:59:17.000',
  },
  {
    status: statuses.SECOND_STATUS,
    number: 3,
    date: '2018-12-20T12:57:44.000',
  },
  {
    status: statuses.THIRD_STATUS,
    number: 2,
    date: '2018-12-20T11:58:44.000',
  },
  {
    status: statuses.THIRD_STATUS,
    number: 3,
    date: '2017-12-20T11:57:44.000',
  },
  {
    status: statuses.SECOND_STATUS,
    number: 2,
    date: '2018-11-21T14:22:23.000',
  },
  {
    status: statuses.THIRD_STATUS,
    number: 2,
    date: '2007-12-20T11:57:44.000',
  },
  {
    status: statuses.FIRST_STATUS,
    number: 1,
    date: '2018-11-26T12:37:14.000',
  },
];

const collectionSorted = [
  {
    status: statuses.FIRST_STATUS,
    number: 3,
    date: '2018-10-20T23:31:45.000',
  },
  {
    status: statuses.FIRST_STATUS,
    number: 1,
    date: '2018-11-26T12:37:14.000',
  },
  {
    status: statuses.FIRST_STATUS,
    number: 1,
    date: '2018-11-20T13:59:17.000',
  },
  {
    status: statuses.SECOND_STATUS,
    number: 3,
    date: '2018-12-20T12:57:44.000',
  },
  {
    status: statuses.SECOND_STATUS,
    number: 2,
    date: '2018-11-21T14:22:23.000',
  },
  {
    status: statuses.THIRD_STATUS,
    number: 3,
    date: '2017-12-20T11:57:44.000',
  },
  {
    status: statuses.THIRD_STATUS,
    number: 2,
    date: '2018-12-20T11:58:44.000',
  },
  {
    status: statuses.THIRD_STATUS,
    number: 2,
    date: '2007-12-20T11:57:44.000',
  },
];

describe('sortCollection', () => {
  describe('throws error if', () => {
    it('there is no property in collection object', () => {
      const propertyName = 'number';
      const invalidCollection = [
        { number: 134 },
        { name: 'Name' },
        { number: 754 },
      ];

      expect(() => sortCollection(invalidCollection, [propertyName])).to.throw(`${propertyName} does not exist`);
    });

    it('invalid collection argument', () => {
      const invalidArgument = {};

      expect(() => sortCollection(invalidArgument)).to.throw('collection parameter must be an array');
    });

    describe('iteratees argument', () => {
      it('is not an array', () => {
        const iteratees = {};

        expect(() => sortCollection([], iteratees)).to.throw('iteratees.map is not a function');
      });

      it('has invalid values', () => {
        const iteratees = [6];

        expect(() => sortCollection([], iteratees)).to.throw('6 is not valid value');
      });
    });
  });
});

it('works with empty input', () => {
  expect(sortCollection()).to.deep.equal([]);
});

it('sorts correctly', () => {
  const sortByDates = (
    { date: dateA },
    { date: dateB },
  ) => {
    return convertDate(dateB, DATE_TYPES.number) - convertDate(dateA, DATE_TYPES.number);
  };
  const sortingOptions = [
    {
      propertyName: 'status',
      sequence: [statuses.FIRST_STATUS, statuses.SECOND_STATUS, statuses.THIRD_STATUS],
    },
    '-number',
    sortByDates,
  ];

  expect(sortCollection(collectionUnsorted, sortingOptions)).to.deep.equal(collectionSorted);
});
