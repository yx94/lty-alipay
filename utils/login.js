/**
 * 登录服务统一入口
 * 支持多平台扩展
 */

import { getPlatformLogin } from '@/services/platforms/index.js'

class LoginService {
  constructor() {
    this.platformLogin = null
    this.isLogging = false // 防止重复登录
    this.init()
  }

  /**
   * 初始化登录服务
   */
  init() {
    // #ifdef MP-ALIPAY
    this.platformLogin = getPlatformLogin('alipay')
    // #endif
    
    // #ifdef MP-WEIXIN
    // this.platformLogin = getPlatformLogin('weixin')
    // #endif
    
    // #ifdef MP-BAIDU
    // this.platformLogin = getPlatformLogin('baidu')
    // #endif
    
    // 其他平台可以在这里扩展
  }

  /**
   * 设置自定义登录函数（用于模拟数据等）
   * @param {Function} fn 登录函数
   */
  setCustomLoginFn(fn) {
    if (this.platformLogin && this.platformLogin.setCustomLoginFn) {
      this.platformLogin.setCustomLoginFn(fn)
    }
  }

  /**
   * 静默登录
   * @param {String} params 登录参数
   * @returns {Promise<Object>} 登录结果
   */
  async silentLogin(params) {
    if (!this.platformLogin) {
      console.warn('当前平台不支持登录')
      return {
        success: false,
        message: '当前平台不支持登录'
      }
    }

    // 防止重复登录
    if (this.isLogging) {
      console.warn('登录正在进行中，请勿重复调用')
      return {
        success: false,
        message: '登录正在进行中'
      }
    }

    try {
      this.isLogging = true
      const result = await this.platformLogin.silentLogin(params)
      return result
    } catch (error) {
      console.error('登录失败:', error)
      return {
        success: false,
        message: error.message || '登录失败',
        error
      }
    } finally {
      this.isLogging = false
    }
  }

  /**
   * 检查登录状态
   * @returns {Promise<Boolean>}
   */
  async checkLoginStatus() {
    if (!this.platformLogin) {
      return false
    }
    return await this.platformLogin.checkLoginStatus()
  }

  /**
   * 获取用户信息
   * @returns {Promise<Object>}
   */
  async getUserInfo() {
    if (!this.platformLogin) {
      return null
    }
    return await this.platformLogin.getUserInfo()
  }

  /**
   * 退出登录
   */
  logout() {
    if (this.platformLogin) {
      this.platformLogin.logout()
    }
    // 清除本地存储的用户信息
    try {
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('token')
      uni.removeStorageSync('authCode')
    } catch (error) {
      console.error('清除登录信息失败:', error)
    }
  }
}

// 导出单例
export default new LoginService()

