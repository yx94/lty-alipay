/**
 * 统一请求封装
 */

import loginService from '@/utils/login.js'

// TODO: 配置你的后端接口地址
let BASE_URL = 'http://192.168.8.112:8081'

/**
 * 统一请求方法
 * @param {Object} options 请求配置
 * @param {String} options.url 请求路径
 * @param {String} options.method 请求方法，默认 'GET'
 * @param {Object} options.data 请求数据，默认 {}
 * @param {Object} options.header 请求头，默认 {}
 * @returns {Promise<Object>}
 */
export function request(options) {
	return new Promise((resolve, reject) => {
		const {
			url,
			method = 'GET',
			data = {},
			header = {}
		} = options

		// 获取token
		const token = uni.getStorageSync('token')

		// 设置请求头
		const requestHeader = {
			'Content-Type': 'application/json',
			...header
		}

		// 如果有token，添加到请求头
		if (token) {
			requestHeader['Authorization'] = `Bearer ${token}`
		}

		uni.request({
			url: BASE_URL + url,
			method,
			data,
			header: requestHeader,
			success: (res) => {
				// 根据实际后端返回格式调整
				// console.log('request',res)
				if (res.statusCode === 200) {
					// 如果后端返回格式为 { code: 200, data: {}, msg: '' }
					if (res.data.code === 200 || res.data.success) {
						resolve(res.data)
					} else if (res.data.code.indexOf('1001') !== -1) {
						// token过期，清除登录信息
						uni.removeStorageSync('token')
						uni.removeStorageSync('userInfo')
						reject(new Error('登录已过期，请重新登录'))
						loginService.logout()
					} else {
						reject(new Error(res.data.msg || '请求失败'))
					}
				} else if (res.statusCode === 401) {
					// token过期，清除登录信息
					uni.removeStorageSync('token')
					uni.removeStorageSync('userInfo')
					reject(new Error('登录已过期，请重新登录'))
				} else {
					reject(new Error(`请求失败: ${res.statusCode}`))
				}
			},
			fail: (err) => {
				console.error('请求失败:', err)
				reject(new Error(err.errMsg || '网络请求失败'))
			}
		})
	})
}


/**
 * 统一上传方法
 * @param {Object} options 请求配置
 * @param {String} options.url 请求路径
 * @param {String} options.method 请求方法，默认 'GET'
 * @param {Object} options.data 请求数据，默认 {}
 * @param {Object} options.header 请求头，默认 {}
 * @returns {Promise<Object>}
 */

export function uploadFile(filePath, formData = {}) {
	if (!filePath) {
		uni.showToast({
			title: '请选择文件',
			icon: 'none'
		});
		return;
	}
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: BASE_URL+'/oss/upload', // 仅为示例，请传对应的 URL
			filePath: filePath,
			name: 'file', // 服务器接收的文件参数名
			formData: formData,
			//{ 这里可以添加其他需要一起上传的数据，如用户ID等
			// 'user': 'admin'},
			success: (uploadFileRes) => {
				let data = JSON.parse(uploadFileRes.data).data
				console.log('上传成功2', data);
				// uni.showToast({
				// 	title: '上传成功',
				// 	icon: 'success'
				// });
				resolve(data)
			},
			fail: (error) => {
				uni.showToast({
					title: '上传失败',
					icon: 'none'
				});
				console.error('上传失败', error);
				reject(new Error(error))
			}
		});
	})

}

/**
 * 设置基础URL
 * @param {String} url 基础URL
 */
export function setBaseUrl(url) {
	BASE_URL = url
}

/**
 * 获取基础URL
 * @returns {String}
 */
export function getBaseUrl() {
	return BASE_URL
}

export default request