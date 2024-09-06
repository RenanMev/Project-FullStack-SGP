export const isAuthenticated = () => {
  return localStorage.getItem('user') !== null && localStorage.getItem('sessionToken') !== null;
};