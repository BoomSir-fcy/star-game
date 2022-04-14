import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { storage } from 'config';
import eventBus from '../utils/eventBus';
import dispatchHttpErrorEvent from './httpErrorEvent';
import { isSuccess } from './util';

interface AxiosRequestConfigCustom extends AxiosRequestConfig {
  hideHttpError?: boolean;
  ignoreSSID?: boolean; // 是否忽略SSID
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
  // eslint-disable-next-line class-methods-use-this
  async request(configs: AxiosRequestConfigCustom) {
    let response;
    const SSID = localStorage.getItem(storage.SSID);

    try {
      response = await axios({
        ...configs,
        headers:
          SSID && !configs.ignoreSSID
            ? { ...configs.headers, SSID }
            : configs.headers,
      });
      dispatchHttpErrorEvent(response.data);
      return response.data;
    } catch (e: any) {
      if (e?.status === 403) {
        eventBus.dispatchEvent(new Event('unauthorized'));
      }
      return e;
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
    return isSuccess(res);
  }
}

export default new Http();
