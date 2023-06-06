/*
 * @Author: 刘兴
 * @Date: 2023-06-04 21:41:50
 * @LastEditors: 刘兴
 * @LastEditTime: 2023-06-06 22:13:58
 * @FilePath: /saas/src/main.ts
 * @Description:
 *
 * Copyright (c) 2023 by 刘兴, All Rights Reserved.
 */
import "@ant-design-vue/pro-layout/dist/style.less";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// @ts-ignore
import ProLayout, { PageContainer } from "@ant-design-vue/pro-layout";

const app = createApp(App);

app.use(router);
app.use(ProLayout);
app.use(PageContainer);
app.mount("#app");
