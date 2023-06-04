/*
 * @Author: 刘兴
 * @Date: 2023-06-04 21:55:56
 * @LastEditors: 刘兴
 * @LastEditTime: 2023-06-04 22:22:21
 * @FilePath: /saas/src/router/index.ts
 * @Description:
 *
 * Copyright (c) 2023 by 刘兴, All Rights Reserved.
 */
import {
  createRouter,
  createWebHashHistory,
  // createWebHistory,
} from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
// import BasicLayout from "../layouts/BasicLayout.vue";
import Index from "../views/Index.vue";
// 定义路由
const routes = [
  {
    path: "/",
    name: "index",
    meta: { title: "学生成绩分析" },
    component: Index,
  },
];

// 创建路由
const router = createRouter({
  // 这里使用History模式，如需使用hash模式，改为createWebHashHistory()
  // import.meta.env.VITE_APP_PATH as string)
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  // history: createWebHistory(),
  routes,
});

// 获取系统标题
const title = import.meta.env.VITE_APP_TITLE;

// 进度条配置
NProgress.configure({ showSpinner: false });

// 前置路由守卫
router.beforeEach((to, from, next) => {
  console.log(from.fullPath);
  // 动态修改title
  document.title = to.meta.title + "｜" + title;
  // 开启进度条
  NProgress.start();
  next();
});

// 后置路由守卫
router.afterEach(() => {
  // 关闭进度条
  NProgress.done();
});

// 导出路由
export default router;
