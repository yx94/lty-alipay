/**
 * 支付宝小程序登录适配器
 */

import {
	requestLogin
} from '@/services/api/index.js'

class AlipayLogin {
	constructor() {
		// 可选的登录函数，用于注入模拟数据或自定义登录逻辑
		this.customLoginFn = null
	}

	/**
	 * 设置自定义登录函数（用于模拟数据等）
	 * @param {Function} fn 登录函数
	 */
	setCustomLoginFn(fn) {
		this.customLoginFn = fn
	}

	/**
	 * 静默登录
	 * @param {String} params 登录参数 目前是手机号获取的加密数据 { encryptedData, sign }
	 * @returns {Promise<Object>}
	 */
	async silentLogin(params) {
		try {
			// console.log('获取授权码')
			// 1. 获取授权码
			const authCode = await this.getAuthCode()
			
			if (!authCode) {
				return {
					success: false,
					message: '获取授权码失败'
				}
			}

			// 2. 检查是否有有效的token
			const token = uni.getStorageSync('token')
			const userInfo = uni.getStorageSync('userInfo')
			if (token && userInfo) {
				// 可以在这里验证token是否过期
				return {
					success: true,
					message: '已登录',
					data: {
						token,
						userInfo,
						toPhoneLogin: false
					}
				}
			}
			// console.log('调用登录接口')

			// 3. 调用登录接口（优先使用自定义登录函数，如模拟数据）
			let loginResult
			if (this.customLoginFn) {
				loginResult = await this.customLoginFn({
					authCode:authCode
				})
			} else {
				// 调用真实的后端接口
				loginResult = await requestLogin({
					phone:params,
				})
			}
			console.log('loginResult',loginResult)

			// 4. 处理登录结果
			// 假设后端返回格式: { code: 200, data: { token: '', userInfo: {} }, msg: '' }
			// 或者模拟数据格式: { code: 200, data: { token: '' } }
			const isSuccess = loginResult.code === 200 || loginResult.success === true

			if (isSuccess) {
			  // 提取数据
			  const resultData = loginResult.data || loginResult
			  const token = resultData.token
			  const userInfo = resultData.userInfo || resultData
			  userInfo.role = userInfo.userType

			  // 5. 保存登录信息
			  if (token) {
			    uni.setStorageSync('token', token)
			  }
			  if (userInfo) {
			    uni.setStorageSync('userInfo', userInfo)
			  }
			  uni.setStorageSync('authCode', authCode)

			  return {
			    success: true,
			    message: '登录成功',
			    data: {
			      token,
			      userInfo
			    }
			  }
			} else {
			  return {
			    success: false,
			    message: loginResult.message || '登录失败'
			  }
			}
		} catch (error) {
			console.error('支付宝登录失败:', error)
			return {
				success: false,
				message: error.message || '登录失败',
				error
			}
		}
	}

	/**
	 * 获取授权码
	 * @returns {Promise<String>}
	 */
	getAuthCode() {
		return new Promise((resolve, reject) => {
			// 支付宝小程序获取授权码
			my.getAuthCode({
				scopes: 'auth_base', // 静默授权
				success: (res) => {
					console.log('获取授权码成功:', res.authCode)
					resolve(res.authCode)
				},
				fail: (err) => {
					console.error('获取授权码失败:', err)
					reject(new Error(err.errorMessage || '获取授权码失败'))
				}
			})
		})
	}

	/**
	 * 检查登录状态
	 * @returns {Promise<Boolean>}
	 */
	async checkLoginStatus() {
		try {
			const token = uni.getStorageSync('token')
			const userInfo = uni.getStorageSync('userInfo')

			if (!token || !userInfo) {
				return false
			}

			// 可以在这里调用后端接口验证token有效性
			// 这里简化处理，直接返回true
			return true
		} catch (error) {
			console.error('检查登录状态失败:', error)
			return false
		}
	}

	/**
	 * 获取用户信息
	 * @returns {Promise<Object>}
	 */
	async getUserInfo() {
		try {
			const userInfo = uni.getStorageSync('userInfo')
			return userInfo || null
		} catch (error) {
			console.error('获取用户信息失败:', error)
			return null
		}
	}

	/**
	 * 退出登录
	 */
	logout() {
		try {
			uni.removeStorageSync('token')
			uni.removeStorageSync('userInfo')
			uni.removeStorageSync('authCode')
		} catch (error) {
			console.error('退出登录失败:', error)
		}
	}
}

export default AlipayLogin