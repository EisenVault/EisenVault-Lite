import axios from 'axios';

// set the token and user from the local storage
  export const setUserLocal = (id, userId) => {
  localStorage.setItem('id', id);
  localStorage.setItem('userId', userId);
  }

// set the URL and user from the local storage
export const setUrl = (url) => {
  localStorage.setItem('url', url);
}

// return the user data from the Local storage
  export const getUser = () => {
    return localStorage.getItem('userId');
  }
   
  // return the URL from the Local storage
  export const getUrl = () => {
    return localStorage.getItem('url')
    // axios.defaults.baseURL = localStorage.getItem('url')
    
  }

  // return the token from the Local storage
  export const getToken = () => {
    return localStorage.getItem('id');
  }
   
  // remove the token and user from the Local storage
  export const removeUserLocal = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('userId');
  }