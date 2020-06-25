//入口文件
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';   //引入app根组件
import * as serviceWorker from './serviceWorker';   //加快react的运行速度
import axios from 'axios';
import qs from 'qs';
import url from "./libs/url.js";


import 'core-js/es'  
import 'react-app-polyfill/ie9'  
import 'react-app-polyfill/stable'


// axios配置
axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';           //配置请求头
axios.defaults.baseURL = 'https://wenjuan.y.zlxtbj.com';   //配置接口地址

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
  //在发送请求之前做某件事
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, (error) => {
  console.log("错误的传参")
  return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {   
  //对响应数据做些事   
  if(res.status===200){
    // Toast(res.data.msg)
    return Promise.resolve(res.data)
  }else{
    console.log("网络异常")
  }
  return res;
}, (error) => {
  console.log("网络异常")
  return Promise.reject(error);
});

 React.__proto__.$axios = axios;
 React.__proto__.$url = url;

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
