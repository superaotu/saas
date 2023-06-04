import request from "../utils/request";

/**
 * @description: 登录 （已废弃）
 * @param {any} param
 * @return {*}
 */
export const login = (param: any) => {
  return request.post("/login", param);
};

/**
 * @description: 获取课程信息
 * @param {any} param
 * @return {*}
 */
export const getCourseList = (param: any) => {
  return request.get("/getAllCouse", param);
};

/**
 * @description: 获取班级信息
 * @param {any} param
 * @return {*}
 */
export const getClassList = (param: any) => {
  return request.get("/getAllClass", param);
};

/**
 * @description: 获取所有活动信息
 * @param {any} param
 * @return {*}
 */
export const getActiveList = (param: any) => {
  return request.post("/getActiveList", param);
};

/**
 * @description:获取学生所有分数
 * @param {any} param
 * @return {*}
 */
export const getScoreList = (param: any) => {
  return request.get("/getAllScore", param);
};

/**
 * @description: 获取分组分数
 * @param {any} param
 * @return {*}
 */
export const getGroupScoreList = (param: any) => {
  return request.get("/getGroupScore", param);
};
