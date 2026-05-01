export const crops = [
  {
    id: 'oil-palm',
    name: 'Oil Palm',
    branding: 'FarmIntelytics FFB',
    primaryColor: '#0F4C44', // FarmIntelytics Teal
    logo: 'https://cdn-icons-png.flaticon.com/512/3241/3241513.png',
    modules: ['dashboard', 'geospatial', 'workers', 'plots', 'approvals', 'payments', 'yield', 'personnel'],
    endpoint: 'http://ec2-98-91-17-63.compute-1.amazonaws.com/api_v1'
  },
  {
    id: 'cashew',
    name: 'Cashew',
    branding: 'CashewIntelytics',
    primaryColor: '#D35400', 
    logo: 'https://cdn-icons-png.flaticon.com/512/1041/1041383.png',
    modules: ['dashboard', 'geospatial', 'workers', 'yield'],
    endpoint: 'http://api.cashewintelytics.com/api_v1'
  },
  {
    id: 'sugarcane',
    name: 'SugarCane',
    branding: 'CaneIntelytics',
    primaryColor: '#16A34A', 
    logo: 'https://cdn-icons-png.flaticon.com/512/2413/2413158.png',
    modules: ['dashboard', 'workers', 'logistics', 'payments'],
    endpoint: 'http://api.caneintelytics.com/api_v1'
  }
];
