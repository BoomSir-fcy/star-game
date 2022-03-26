import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { storage } from 'config';
import eventBus from '../utils/eventBus';
import dispatchHttpErrorEvent from './httpErrorEvent';

interface AxiosRequestConfigCustom extends AxiosRequestConfig {
  hideHttpError?: boolean
}

const baseURL = process.env.REACT_APP_API_HOST;

axios.defaults.timeout = 30 * 1000;
// axios.defaults.withCredentials = false
// axios.defaults.headers.common['token'] = "";

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.get.Accept = 'application/json';

axios.interceptors.response.use(
  response => {
    if (response.data) {
      return response;
    }
    return Promise.reject(response);
  },
  error => {
    if (error.isAxiosError && !error.response && !error.config.hideHttpError) {
      eventBus.dispatchEvent(new Event('networkerror'));
    }
    return Promise.reject(error.response);
  },
);

export class Http {
  async request(configs: AxiosRequestConfigCustom) {
    let response;
    let SSID = localStorage.getItem(storage.SSID);

    try {
      response = await axios({
        ...configs,
        headers: { ...configs.headers, SSID },
      });

      dispatchHttpErrorEvent(response.data);
      return response.data;
    } catch (e: any) {
      if (e?.status === 403) {
        eventBus.dispatchEvent(new Event('unauthorized'));
      }
    }
  }

  async get(url: string, params?: any, option: AxiosRequestConfigCustom = {}) {
    const config: AxiosRequestConfigCustom = {
      method: 'GET',
      url,
      baseURL,
      params,
      ...option,
    };
    return this.request(config);
  }

  async post(url: string, data?: any, option: AxiosRequestConfigCustom = {}) {
    const config: AxiosRequestConfigCustom = {
      method: 'POST',
      url,
      data,
      baseURL,
      ...option,
    };
    return this.request(config);
  }

  static checkSuccess(res: Api.Error) {
    return res && res.code === 1;
  }
}

export default new Http();
