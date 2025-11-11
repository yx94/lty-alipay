<template>
	<view class="login-container">
		<view class="content-wrapper">
			<view class="logo-wrapper">
				<image class="logo" src="/static/logo.jpg" mode="aspectFill"></image>
			</view>
			<text class="title">领头羊人力</text>
			<view v-if="isLogOn" class="loading-wrapper">
				<view class="loading-spinner"></view>
				<text class="loading-text">正在登录...</text>
			</view>
			<button v-else 
			class="submit-btn"
			open-type="getAuthorize"
			scope='phoneNumber'
			   @getAuthorize="getPhoneNumber"
			   @error="handleAuthError"
				> 手机号码一键登录</button>
		</view>
	</view>
</template>

<script>
	import loginService from '@/utils/login.js'

	export default {
		data() {
			return {
				loading: false,
				isLogOn: true,
			}
		},
		onLoad() {
			this.checkLogin()
		},
		methods: {
			/**
			 * 手机号登录
			 */
			getPhoneNumber(res) {
				// 调用支付宝获取手机号接口
				let that = this
				my.getPhoneNumber({
					success: function(res) {
						console.log('获取手机号成功', res.response);
						// 可以在这里处理获取到的手机号，例如发送到服务器进行绑定等操作
						let response = JSON.parse(res.response)
						let params = {}
						params.encryptedData = response.response
						params.sign = response.sign
						that.doLogin(JSON.stringify(params))
					},
					fail: function(err) {
						console.log('获取手机号失败', err);
						// 处理失败情况，例如提示用户重新授权等
					},
				})
			},
			handleAuthError(err){
				console.log('err',err)
			},
			/**
			 * 检查登录状态
			 */
			async checkLogin() {
				const token = uni.getStorageSync('token')
				const userInfo = uni.getStorageSync('userInfo')

				if (token && userInfo) {
					this.isLogOn = true
					// 已登录，直接跳转到主页
					uni.reLaunch({
						url: '/pages/home/home'
					})
					return
				}

				// 未登录，执行静默登录+手机号登录
				this.isLogOn = false
				// this.doLogin()
			},

			/**
			 * 执行登录
			 */
			async doLogin(params) {
				this.loading = true
				try {
					//登录
					const result = await loginService.silentLogin(params)

					if (result.success) {
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						})
						// 跳转到主页
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/home/home'
							})
						}, 500)
					} else {
						uni.showToast({
							title: result.message || '登录失败',
							icon: 'none'
						})
					}
				} catch (error) {
					console.error('登录异常:', error)
					uni.showToast({
						title: '登录失败，请重试',
						icon: 'none'
					})
				} finally {
					this.loading = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: $bg-gradient;
	}

	.content-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0 40rpx;
	}

	.logo-wrapper {
		margin-bottom: 48rpx;
		animation: fadeInDown 0.6s ease-out;
	}

	.logo {
		width: 160rpx;
		height: 160rpx;
		border-radius: 16%;
		background-color: $bg-card-opacity;
		box-shadow: $shadow-logo;
	}

	.title {
		font-size: 40rpx;
		color: $text-primary;
		font-weight: 600;
		margin-bottom: 80rpx;
		letter-spacing: 1rpx;
		animation: fadeInUp 0.6s ease-out 0.2s both;
	}

	.loading-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		animation: fadeInUp 0.6s ease-out 0.4s both;
	}

	.loading-spinner {
		width: 48rpx;
		height: 48rpx;
		border: 4rpx solid rgba(107, 182, 255, 0.2);
		border-top-color: $color-primary;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin-bottom: 24rpx;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.loading-text {
		font-size: 26rpx;
		color: $text-secondary;
		font-weight: 400;
		letter-spacing: 0.5rpx;
	}

	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-30rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.submit-btn {
		width: 400rpx;
		height: 88rpx;
		line-height: 88rpx;
		background: $gradient-primary;
		color: $text-white;
		border-radius: 44rpx;
		font-size: 32rpx;
		font-weight: 500;
		border: none;
		box-shadow: $shadow-button-primary;
	}
</style>