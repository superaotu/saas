import request from "../utils/request";

/**
 * 登录
 * @param {Object} param
 * @returns
 */
export const login = (param: any) => {
  return request.post("/login", param);
};

/**
 * 获取课程信息
 * @param {Object} param
 * @returns
 */
export const getCourseList = (param: any) => {
  return request.get("/getAllCouse", param);
};

/**
 * 获取班级信息
 * @param {Object} param
 * @returns
 */
export const getClassList = (param: any) => {
  return request.get("/getAllClass", param);
};

/**
 * 获取所有活动信息
 * @param {Object} param
 * @returns
 */
export const getActiveList = (param: any) => {
  return request.post("/getActiveList", param);
};

/**
 * 获取学生所有分数
 * @param {Object} param
 * @returns
 */
export const getScoreList = (param: any) => {
  return request.get("/getAllScore", param);
};
