import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSessionStore = defineStore('session', () => {
  const isAuth = ref(!!localStorage.getItem('access_token'));

  const setAuth = (token: string) => {
    localStorage.setItem('access_token', token);
    isAuth.value = true;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    isAuth.value = false;
  };

  return { isAuth, setAuth, logout };
});
