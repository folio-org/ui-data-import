const endpointsToMock = [
  {
    url: '/instance-statuses',
    responseKey: 'instanceStatuses',
  },
  {
    url: '/statistical-codes',
    responseKey: 'statisticalCodes',
  },
  {
    url: '/nature-of-content-terms',
    responseKey: 'natureOfContentTerms',
  },
  {
    url: '/electronic-access-relationships',
    responseKey: 'electronicAccessRelationships',
  },
  {
    url: '/instance-relationship-types',
    responseKey: 'instanceRelationshipTypes',
  },
  {
    url: '/holdings-types',
    responseKey: 'holdingsTypes',
  },
  {
    url: '/locations',
    responseKey: 'locations',
  },
  {
    url: '/call-number-types',
    responseKey: 'callNumberTypes',
  },
  {
    url: '/ill-policies',
    responseKey: 'illPolicies',
  },
  {
    url: '/holdings-note-types',
    responseKey: 'holdingsNoteTypes',
  },
  {
    url: '/material-types',
    responseKey: 'mtypes',
  },
  {
    url: '/item-damaged-statuses',
    responseKey: 'itemDamageStatuses',
  },
  {
    url: '/item-note-types',
    responseKey: 'itemNoteTypes',
  },
  {
    url: '/loan-types',
    responseKey: 'loantypes',
  },
];

export default server => {
  endpointsToMock.forEach(endpoint => server.get(
    endpoint.url,
    {
      [endpoint.responseKey]: [
        {
          id: '1',
          statisticalCodeTypeId: '1',
          code: 'ASER',
          name: 'name 1',
        },
        {
          id: '2',
          statisticalCodeTypeId: '2',
          code: 'ASER',
          name: 'name 2',
        },
      ],
      totalRecords: 2,
    },
  ));

  server.get('/statistical-code-types', {
    statisticalCodeTypes: [
      {
        id: '1',
        name: 'statistical 1'
      },
      {
        id: '2',
        name: 'statistical 2'
      },
    ]
  })
  
  };
