import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
//import { UserModule } from '@/store/modules/user';

const service = axios.create({
  baseURL: process.env.APP_BIZ_BASE_API,
  timeout: 5000
});

// Request interceptors
service.interceptors.request.use(
  (config) => {
    //agent 请求代理....
    //config.headers['X-Access-Token'] = UserModule.token
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => 
  {
    const res = response.data
    if ( res.code !== 20000) 
    {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      });
      return 
      {
        Promise.reject(new Error(res.message || 'Error'));
      }
    }
    else 
    {
      return response.data;
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
