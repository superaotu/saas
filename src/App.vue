<!--
 * @Author: 刘兴
 * @Date: 2023-05-21 21:07:25
 * @LastEditors: 刘兴
 * @LastEditTime: 2023-06-06 21:02:56
 * @FilePath: /saas/src/App.vue
 * @Description: 布局
 * 
 * Copyright (c) 2023 by 刘兴, All Rights Reserved. 
-->
<template>
  <!-- <div>
      <router-view></router-view>
    </div> -->
  <pro-layout
    :locale="locale"
    v-bind="layoutConfig"
    v-model:openKeys="state.openKeys"
    v-model:collapsed="state.collapsed"
    v-model:selectedKeys="state.selectedKeys"
  >
    <router-view />
    <GlobalFooter
      :links="[
        // { title: 'Link 1', href: '#' },
        {
          title: '@编程小兴',
          href: 'https://www.liuyingxing.com/reco/gzh.png',
        },
      ]"
      copyright="Copyright 2023 ScoreAnalysis All rights reserved."
    />
  </pro-layout>
</template>

<script setup lang="ts">
// @ts-ignore
import { GlobalFooter } from "@ant-design-vue/pro-layout";

const locale = (i18n: string) => i18n;
// const router = useRouter();

// const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));

const state = reactive({
  collapsed: false, // default value
  openKeys: ["/dashboard"],
  selectedKeys: ["/welcome"],
});
const layoutConfig = reactive({
  // layout: "topmenu",
  title: "学生成绩分析系统",
  logo: "/vite.svg",
  // logo: "false",
  contentWidth: "Fixed",
  theme: "light",
  primaryColor: "#1890ff",
  fixedHeader: true,
  fixSiderbar: false,
  hideHintAlert: false,
  hideCopyButton: false,
  navTheme: "dark",
  layout: "top",
  // splitMenus: false,
  // menuData,
});
</script>

<style>
body {
  height: 100%;
  width: 100%;
}
.ant-pro-global-footer {
  margin: 10px 0 10px 0;
  padding: 0 16px;
  text-align: center;
}
</style>
