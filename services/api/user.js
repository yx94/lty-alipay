/**
 * 用户相关 API
 * 示例文件，可根据需要添加用户相关的接口
 */

import { request } from '../request.js'

/**
 * 身份证照片上传
 * @param {Object} {files array[file], form object{idCard string}}  
 * @returns {Promise<Object>}
 */
export function updateIdCardPhoto(params) {
  return request({
    url: '/user/idCardPhoto/upload',
    method: 'POST',
    data: params
  })
}

// /**
//  * 获取用户信息
//  * @param {String} userId 用户ID
//  * @returns {Promise<Object>}
//  */
// export function getUserInfo(userId) {
//   return request({
//     url: '/user/info',
//     method: 'GET',
//     data: { userId }
//   })
// }

// /**
//  * 更新用户信息
//  * @param {Object} userInfo 用户信息
//  * @returns {Promise<Object>}
//  */
// export function updateUserInfo(userInfo) {
//   return request({
//     url: '/user/update',
//     method: 'POST',
//     data: userInfo
//   })
// }

