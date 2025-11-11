<script>
	import loginService from '@/utils/login.js'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 设置模拟登录函数
			this.setupMockLogin()
			// 执行静默登录
			// this.initLogin()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		data() {
			return {
				// 是否使用模拟数据（开发时设为 true，生产环境设为 false）
				useMockData: true
			}
		},
		methods: {
			/**
			 * 设置模拟登录函数
			 */
			setupMockLogin() {
				if (this.useMockData) {
					// 注入模拟登录函数
					loginService.setCustomLoginFn(this.mockLogin)
				}
			},
			
			/**
			 * 模拟登录接口返回数据
			 * @param {Object} params 登录参数 { authCode, platform }
			 * @returns {Promise<Object>}
			 */
			async mockLogin(params) {
				console.log('使用模拟登录数据, params:', params)
				
				// 模拟网络延迟
				await new Promise(resolve => setTimeout(resolve, 500))
				
				// 模拟登录成功返回数据
				// 根据实际后端返回格式调整
				return {
					success: true,
					code: 0,
					message: '登录成功',
					data: {
						token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJhcHBfdXNlcjoxMSIsInJuU3RyIjoiWXNXVlE0VUZZS3BETVQ1WWo5TzU5T1VCZWRXOHZJSVgifQ.mNo2f2LMnMOdbeFELXEYAL2c8uYLnANQse2FxUVzax8',
						userInfo: {
							userId: 'mock_user_123',
							nickName: '测试用户',
							avatar: 'https://via.placeholder.com/100',
							openId: params.authCode + '_openid',
							userType:'employee',
							role: 'employee', // 角色：employee(员工) 或 manager(驻场经理)
							// role: 'manager', 
							// 其他用户信息字段...
						}
					}
				}
				
				// 如果需要模拟登录失败，可以返回：
				// return {
				//   success: false,
				//   code: -1,
				//   message: '登录失败，授权码无效'
				// }
			},
			
			/**
			 * 初始化登录
			 */
			async initLogin() {
				try {
					console.log('开始静默登录...')
					const result = await loginService.silentLogin()
					
					if (result.success) {
						console.log('静默登录成功:', result.data)
						// 触发全局事件，通知其他页面登录成功
						uni.$emit('loginSuccess', result.data)
					} else {
						console.warn('静默登录失败:', result.message)
						// 处理登录失败的情况
						uni.$emit('loginFail', result)
					}
				} catch (error) {
					console.error('登录异常:', error)
					uni.$emit('loginError', error)
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
