import axios from 'axios';
import { parseCookies } from 'nookies';

const cookies = parseCookies();
export const nextApi = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: `Bearer ${cookies['ignews:token']}`
  }
});
