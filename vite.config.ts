/*
 * @Author: 刘兴
 * @Date: 2023-06-04 21:41:50
 * @LastEditors: 刘兴
 * @LastEditTime: 2023-06-04 21:53:07
 * @FilePath: /saas/vite.config.ts
 * @Description: Vite Config
 *
 * Copyright (c) 2023 by 刘兴, All Rights Reserved.
 */

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

/**
 * @description: 获取Vite环境
 * @param {*} mode
 * @param {*} target
 * @return {*}
 */
const getViteEnv = (mode, target) => {
  return loadEnv(mode, process.cwd())[target];
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    // base: "./",
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            //将环境变量 VITE_APP_TITLE 赋值给 title 方便 html页面使用 title 获取系统标题
            title: getViteEnv(mode, "VITE_APP_TITLE"),
          },
        },
      }),
      AutoImport({
        dts: "src/auto-imports.d.ts",
        imports: ["vue", "vue-router"],
      }),
      Components({
        dts: "src/components.d.ts",
        deep: true,
        dirs: ["src/components"],
        extensions: ["vue", "tsx"],
        resolvers: [AntDesignVueResolver()],
      }),
    ],
    // 解析配置
    resolve: {
      // 路径别名
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true, // 监听所有地址
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            // '@primary-color': '#eb2f96', // 全局主色
          },
        },
      },
    },
    envDir: resolve(__dirname, "./env"),
  };
});
