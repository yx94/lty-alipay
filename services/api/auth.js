/**
 * 认证相关 API
 */

import { request } from '../request.js'

/**
 * 登录接口
 * @param {Object} params 登录参数 { authCode, platform }
 * @returns {Promise<Object>} 直接返回后端接口的数据，不做转换
 */
export function requestLogin(params) {
  return request({
    url: '/user/login/phone',
    method: 'POST',
    data: params
  })
}

/**
 * 验证token有效性
 * @returns {Promise<Boolean>}
 */
// export async function validateToken() {
//   try {
//     const result = await request({
//       url: '/auth/validate', // TODO: 修改为实际的验证接口地址
//       method: 'GET'
//     })
//     return result.success || result.code === 0
//   } catch (error) {
//     console.error('验证token失败:', error)
//     return false
//   }
// }

