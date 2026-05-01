export const crops = [
  {
    id: 'oil-palm',
    name: 'Oil Palm',
    branding: 'Okomu Oil',
    primaryColor: '#1A7A4A',
    logo: 'https://okomuoil.com/wp-content/uploads/2021/04/cropped-Okomu-Oil-Logo-1-1.png',
    modules: ['dashboard', 'geospatial', 'workers', 'plots', 'approvals', 'payments', 'yield', 'personnel'],
    endpoint: 'http://ec2-98-91-17-63.compute-1.amazonaws.com/api_v1'
  },
  {
    id: 'cashew',
    name: 'Cashew',
    branding: 'CashewIntelytics',
    primaryColor: '#D35400', // Burnt Orange
    logo: 'https://cdn-icons-png.flaticon.com/512/1041/1041383.png',
    modules: ['dashboard', 'geospatial', 'workers', 'yield'],
    endpoint: 'http://api.cashewintelytics.com/api_v1'
  },
  {
    id: 'sugarcane',
    name: 'SugarCane',
    branding: 'CaneIntelytics',
    primaryColor: '#27AE60', // Emerald Green
    logo: 'https://cdn-icons-png.flaticon.com/512/2413/2413158.png',
    modules: ['dashboard', 'workers', 'logistics', 'payments'],
    endpoint: 'http://api.caneintelytics.com/api_v1'
  }
];
