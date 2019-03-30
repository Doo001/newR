import axios from 'axios'
import config from '../../../config'
import {showAlert} from "../widgets/alert";
import Q from "../quantum";

const baseURl = `http://${config[process.env.NODE_ENV].proxy['<%SUBJECT%>']['host']}:${config[process.env.NODE_ENV].proxy['<%SUBJECT%>']['port']}`;
axios.defaults.baseURL = baseURl;
axios.defaults.headers.common['Content-Type'] = 'application/json; charset=UTF-8';
axios.interceptors.request.use(function (config) {
  config.withCredentials = true;
  config.headers.common['authorization'] = localStorage.getItem('token') || "";
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {

  if (response.data.status == -1) {
    localStorage.clear()
    window.location.href = '/auth/login'
    return Promise.reject()
  }
  if (response.data.status == 1) {
    return response.data.data
  }
  if (response.data.status == 0) {
    Q.alert(response.data.message , 'danger');
    return Promise.reject()
  }
  if (response.data.status == -3) {
    //账号被冻结
    showAlert(response.data.message, 'danger')
    window.location.href = '/login';
    return Promise.reject()
  }
  return Promise.reject(new Error(response.data.status))

}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});
export default axios