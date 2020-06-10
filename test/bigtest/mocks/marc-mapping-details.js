export const marcMappingDetails = [
  {
    order: 0,
    action: 'DELETE',
    field: {
      field: '029',
      indicator1: '*',
      indicator2: '*',
      subfields: [
        { subfield: '*' },
      ],
    },
  },
  {
    order: 1,
    action: 'ADD',
    field: {
      field: '500',
      indicator1: ' ',
      indicator2: ' ',
      subfields: [
        {
          subfield: 'a',
          data: { text: 'Cataloged by John Doe' },
        },
      ],
    },
  },
  {
    order: 2,
    action: 'ADD',
    field: {
      field: '901',
      indicator1: ' ',
      indicator2: ' ',
      subfields: [
        {
          subfield: 'a',
          data: { text: 'Cataloged by John Doe' },
          subaction: 'ADD_SUBFIELD',
        },
        {
          subfield: 'b',
          data: { text: 'Input by Jane Deer' },
          subaction: 'ADD_SUBFIELD',
        },
        {
          subfield: 'c',
          data: { text: 'Reviewed by Susan Fawn' },
          subaction: 'ADD_SUBFIELD',
        },
      ],
    },
  },
  {
    order: 3,
    action: 'EDIT',
    field: {
      field: '856',
      indicator1: '4',
      indicator2: '1',
      subfields: [
        {
          subfield: 'u',
          data: { text: 'http://liproxy.smith.edu:2048/login?url=' },
          subaction: 'INSERT',
          position: 'BEFORE_STRING',
        },
      ],
    },
  },
  {
    order: 4,
    action: 'EDIT',
    field: {
      field: '856',
      indicator1: '*',
      indicator2: '*',
      subfields: [
        {
          subfield: '*',
          data: { text: 'chic_rbw' },
          subaction: 'REMOVE',
        },
      ],
    },
  },
  {
    order: 5,
    action: 'EDIT',
    field: {
      field: '856',
      indicator1: '*',
      indicator2: '*',
      subfields: [
        {
          subfield: '*',
          data: {
            find: 'http://',
            replaceWith: 'https://',
          },
          subaction: 'REPLACE',
        },
      ],
    },
  },
  {
    order: 6,
    action: 'MOVE',
    field: {
      field: '901',
      indicator1: ' ',
      indicator2: ' ',
      subfields: [
        {
          subfield: ' ',
          data: {
            marcField: {
              field: '991',
              indicator1: ' ',
              indicator2: ' ',
              subfield: ' ',
            },
          },
          subaction: 'CREATE_NEW_FIELD',
        },
      ],
    },
  },
  {
    order: 7,
    action: 'MOVE',
    field: {
      field: '903',
      indicator1: ' ',
      indicator2: ' ',
      subfields: [
        {
          subfield: 'a',
          data: {
            marcField: {
              field: '993',
              indicator1: ' ',
              indicator2: ' ',
              subfield: 'w',
            },
          },
          subaction: 'ADD_TO_EXISTING_FIELD',
        },
      ],
    },
  },
];
