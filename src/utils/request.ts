/*
 * @Author: 刘兴
 * @Date: 2023-06-04 22:08:50
 * @LastEditors: 刘兴
 * @LastEditTime: 2023-06-04 22:09:09
 * @FilePath: /saas/src/utils/request.ts
 * @Description: 请求
 *
 * Copyright (c) 2023 by 刘兴, All Rights Reserved.
 */
import axios, { AxiosInstance } from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const baseURL = import.meta.env.VITE_APP_BaseURL;

class Axios {
  private service: AxiosInstance;
  // 创建实例
  constructor() {
    this.service = axios.create({
      baseURL: baseURL,
      timeout: 5000,
    });
    // 调用拦截器
    this.interceptors();
  }
  // 拦截器
  private interceptors() {
    // 请求拦截
    this.service.interceptors.request.use(
      function (config) {
        // 开启进度条
        NProgress.start();

        const Authorization = localStorage.getItem("Authorization");
        if (Authorization) {
          config.headers["Authorization"] = Authorization;
        }
        config.headers["Content-Type"] = "application/json;charset=UTF-8";
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    // 响应拦截
    this.service.interceptors.response.use(
      function (response) {
        // 关闭进度条
        NProgress.done();
        return Promise.resolve(response.data);
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  // 封装请求
  private request(url: string, method: string, data: any = {}) {
    return this.service({
      url,
      method,
      params: method == "get" ? data : "",
      data: method == "post" ? JSON.stringify(data) : "",
    });
  }

  // 封装get方法
  public get(url: string, data: any) {
    return this.request(url, "get", data);
  }
  // 封装post方法
  public post(url: string, data: any) {
    return this.request(url, "post", data);
  }
}

// 新建
let service = new Axios();

// 导出
export default service;
