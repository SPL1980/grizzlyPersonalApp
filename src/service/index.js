import axios from 'axios';
import { isMock, hostList } from './mock';
import tools from 'util/tools';
import { Toast } from 'mint-ui';

const ENV = process.env;
let BASEURL = '';

// const TOKEN = tools.getStorage('token');
switch (ENV) {
  case 'development':
    BASEURL = 'test.mangotmall.com';
    break;
  default:
    BASEURL = '';
    break;
}
axios.defaults.baseURL = BASEURL;
axios.defaults.timeout = 20000;
axios.interceptors.request.use((config) => {
  // Do something with request
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  config.headers['MG_code'] = '5uwPulFblsIANI7BIP#a%bBo582#wOud3v%f0c1JgJRskqUTN7y4&TPUTgjkmhOjZI#oVc4Ph4Ar^ApQFy$ZlGl3T9MaIskgGWTVjqHxsP^8S^%gY#nAj9X4DV9x&b7O';
  config.headers['MG_key'] = '5b10fed636fcf';
  config.headers['MG_token'] = tools.getStorage('token') || '';
  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  // Do something with response
  return response;
}, function (error) {
  Toast({
    position: 'top',
    message: '网络错误，请稍后重试！！'
  });
  return Promise.reject(error);
});

function delEmptyAttr (arg) {
  let rObj = {};
  if (Array.isArray(arg) && arg.length === 0) {
    const params = Object.assign({}, arg);
    Object.keys(arg).forEach((key) => {
      if (
        arg[key] === '' ||
            arg[key] === null ||
            arg[key] === undefined ||
            (Array.isArray(arg[key]) && arg[key].length === 0) ||
            (typeof arg[key] === 'object' && arg[key].length === undefined)
      ) {
        delete params[key];
      }
    });
    rObj = params;
  }
  return rObj;
}

function request ({ host = '', version = '', url, params, method = 'post' }) {
  const mock = isMock({ host, version, url, params, method });
  if (ENV !== 'production' && mock.isMock === true) {
    return new Promise((resolve) => {
      resolve(mock.mock);
    });
  } else {
    const tk = new Date().getTime();
    return new Promise((resolve, reject) => {
      let data = params;
      if (method === 'get') {
        data = { params: { ...delEmptyAttr(params), '_': tk } };
      } else {
        url += '?_=' + tk;
      }

      axios[method](host === '' ? url : `http://${host}${url}`, data).then(
        response => {
          // TODO 这里做数据的验证
          resolve(response.data);
        }).catch(
        (error) => {
          return Promise.reject(error);
        });
    });
  }
}
export default {
  demo (params) {
    return request({
      host: hostList.test,
      url: '/api/index/ceshi',
      params,
      method: 'post'
    });
  },
  login (params) {
    return request({
      host: hostList.test,
      url: '/api/Userinfo/login',
      params
    });
  },
  logout () {
    return request({
      host: hostList.test,
      url: '/api/User/logout'
    });
  },
  registered (params) {
    return request({
      host: hostList.test,
      url: '/api/User/create',
      params
    });
  },
  getVerificationCode (params) {
    return request({
      host: hostList.test,
      url: '/api/sms/send_code',
      params
    });
  },
  checkStudent (params) {
    return request({
      host: hostList.test,
      url: '/api/student',
      params,
      method: 'get'
    });
  },
  getAreaByAreaId (areaId = '') {
    return request({
      host: hostList.test,
      url: '/api/Area',
      params: {
        areaId
      },
      method: 'get'
    });
  },
  getSchoolListByAreaId (areaId = '') {
    return request({
      host: hostList.test,
      url: '/api/school',
      params: {
        areaId
      },
      method: 'get'
    });
  },
  getSessionListBySchoolId (schoolId) {
    return request({
      host: hostList.test,
      url: '/api/session',
      params: {
        schoolId
      },
      method: 'get'
    });
  }
};
