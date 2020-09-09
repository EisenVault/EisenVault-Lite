import axios from 'axios';
import {getUrl} from "../../Utils/Common"

// export const instance = axios.create({
//     baseURL: process.env.REACT_APP_INSTANCE_URL
// })

axios.defaults.baseURL = localStorage.getItem('url');

export const instance = axios.create({
    baseURL: getUrl()
})