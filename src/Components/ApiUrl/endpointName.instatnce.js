import axios from 'axios';
import {getUrl} from "../../Utils/Common"

axios.defaults.baseURL = localStorage.getItem('url');

export const instance = axios.create({
    baseURL: getUrl()
})