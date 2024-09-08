export const isAuthenticated = () => {
  return localStorage.getItem('user') !== null && localStorage.getItem('sessionToken') !== null;
};

export const LogoutIsAcout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('sessionToken');
};
