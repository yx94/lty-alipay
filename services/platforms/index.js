/**
 * 平台登录适配器工厂
 */

import AlipayLogin from './alipay.js'
// import WeixinLogin from './weixin.js'
// import BaiduLogin from './baidu.js'

const platformMap = {
  alipay: AlipayLogin,
  // weixin: WeixinLogin,
  // baidu: BaiduLogin,
}

/**
 * 获取平台登录适配器
 * @param {String} platform 平台名称
 * @returns {Object} 平台登录适配器实例
 */
export function getPlatformLogin(platform) {
  const LoginAdapter = platformMap[platform]
  if (!LoginAdapter) {
    throw new Error(`不支持的平台: ${platform}`)
  }
  return new LoginAdapter()
}

/**
 * 获取当前平台名称
 * @returns {String}
 */
export function getCurrentPlatform() {
  // #ifdef MP-ALIPAY
  return 'alipay'
  // #endif
  
  // #ifdef MP-WEIXIN
  // return 'weixin'
  // #endif
  
  // #ifdef MP-BAIDU
  // return 'baidu'
  // #endif
  
  return 'unknown'
}

