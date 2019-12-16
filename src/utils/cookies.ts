import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => { return Cookies.get(sidebarStatusKey); }
export const setSidebarStatus = (sidebarStatus: string) =>{ return  Cookies.set(sidebarStatusKey, sidebarStatus); }

// User
const tokenKey = 'vue_typescript_admin_access_token';
export const getToken = () => Cookies.get(tokenKey);
export const setToken = (token: string) => Cookies.set(tokenKey, token);
export const removeToken = () => Cookies.remove(tokenKey);
