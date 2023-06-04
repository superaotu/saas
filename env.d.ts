/*
 * @Author: 刘兴
 * @Date: 2023-06-04 21:54:26
 * @LastEditors: 刘兴
 * @LastEditTime: 2023-06-04 21:54:37
 * @FilePath: /saas/env.d.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 刘兴, All Rights Reserved. 
 */
declare module "*.vue" {
    import type { DefineComponent } from "vue";
  
    const vueComponent: DefineComponent<{}, {}, any>;
  
    export default vueComponent;
  }
  