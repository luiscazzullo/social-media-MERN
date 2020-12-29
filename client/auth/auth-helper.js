import { signout } from './api-auth';
const auth = {
  authenticate(jwt, cb) {
    if(typeof window !== 'undefined') {
      localStorage.setItem('token', JSON.stringify(jwt));
    }
    cb();
  },
  isAuthenticated() {
    if(typeof window === 'undefined') {
      return false
    }
    if(localStorage.getItem('token')) {
      return JSON.parse(localStorage.getItem('token'));
    } else {
      return false
    }
  },
  clearJWT(cb) {
    if(typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
    cb();
    signout().then(data => {
      document.cookie = 't=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    })
  }
}

export default auth;