export const login = async (email, password) => {
  // Simulated authentication logic
  console.log('Authenticating:', email);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'user_001',
        name: 'Admin User',
        role: 'GLOBAL_ADMIN',
        portals: ['ffb', 'cashew', 'sugarcane', 'geospatial']
      });
    }, 1000);
  });
};

export const logout = () => {
  console.log('Logging out...');
  window.location.reload();
};
