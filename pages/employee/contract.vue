<template>
	<view class="container">
	<!-- 	<view class="form-container">
			<view class="form-item">
				<text class="label">签约人姓名</text>
				<input class="input" v-model="form.name" placeholder="请输入姓名" />
			</view>
			<view class="form-item">
				<text class="label">身份证号</text>
				<input class="input" v-model="form.idCard" placeholder="请输入身份证号" />
			</view>
			<view class="form-item">
				<text class="label">联系电话</text>
				<input class="input" v-model="form.phone" placeholder="请输入联系电话" type="number" />
			</view>
			<view class="form-item">
				<text class="label">签约日期</text>
				<picker mode="date" :value="form.date" @change="onDateChange">
					<view class="picker-view">{{ form.date || '请选择日期' }}</view>
				</picker>
			</view>
		</view>
		<button class="submit-btn" :disabled="loading" @click="handleSubmit">
			<text v-if="loading">签约中...</text>
			<text v-else>提交签约</text>
		</button> -->
	</view>
</template>

<script>
	import { createContractTask } from '@/services/api/index.js'
	
	export default {
		data() {
			return {
				loading: false,
				form: {
					name: '',
					idCard: '',
					phone: '',
					date: ''
				},
				// url:'alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D2021001152606348%26ap_framework_sceneId%3D1300%26page%3Dpages%2Ftrustlink-detail%2Findex%26query%3DturnPage%253Ddetail%2526signProduct%253De15ae900bffe416d927a05911e9cd632%2526signFrom%253Dfinsignweb%2526contextParams%253D2a75b7af'
				url:'https://ds.alipay.com/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D2021001152606348%26ap_framework_sceneId%3D1300%26page%3Dpages%2Ftrustlink-detail%2Findex%26query%3DturnPage%253Ddetail%2526signProduct%253De15ae900bffe416d927a05911e9cd632%2526signFrom%253Dfinsignweb%2526contextParams%253D2a75b7af'
			// scheme=alipays://platformapi/startapp?appId=2021001152606348&ap_framework_sceneId=1300&page=pages/trustlink-detail/index&query=turnPage%3Ddetail%26signProduct%3De15ae900bffe416d927a05911e9cd632%26signFrom%3Dfinsignweb%26contextParams%3D2a75b7af
			}
		},
		onLoad() {
			// 加载用户信息，自动填充姓名和电话
			this.loadUserInfo()
			console.log(this.url)
			my.ap.openURL({
			  "url": this.url,
			  "fail": (res) => {
				  console.log(res)
			    my.showToast({
			      content: '跳转失败'
			    });
			  }
			});
		},
		methods: {
			/**
			 * 加载用户信息
			 */
			loadUserInfo() {
				const userInfo = uni.getStorageSync('userInfo')
				if (userInfo) {
					if (userInfo.nickName) {
						this.form.name = userInfo.nickName
					}
					if (userInfo.phone) {
						this.form.phone = userInfo.phone
					}
				}
			},
			
			/**
			 * 日期选择变化
			 */
			onDateChange(e) {
				this.form.date = e.detail.value
			},
			
			/**
			 * 验证表单
			 */
			validateForm() {
				if (!this.form.name || !this.form.name.trim()) {
					uni.showToast({
						title: '请输入签约人姓名',
						icon: 'none'
					})
					return false
				}
				
				if (!this.form.idCard || !this.form.idCard.trim()) {
					uni.showToast({
						title: '请输入身份证号',
						icon: 'none'
					})
					return false
				}
				
				// 简单的身份证号验证
				const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
				if (!idCardReg.test(this.form.idCard.trim())) {
					uni.showToast({
						title: '请输入正确的身份证号',
						icon: 'none'
					})
					return false
				}
				
				if (!this.form.phone || !this.form.phone.trim()) {
					uni.showToast({
						title: '请输入联系电话',
						icon: 'none'
					})
					return false
				}
				
				const phoneReg = /^1[3-9]\d{9}$/
				if (!phoneReg.test(this.form.phone.trim())) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					})
					return false
				}
				
				if (!this.form.date) {
					uni.showToast({
						title: '请选择签约日期',
						icon: 'none'
					})
					return false
				}
				
				return true
			},
			
			/**
			 * 调用支付宝电子签约插件
			 */
			async callTrustSign(taskId) {
				return new Promise((resolve, reject) => {
					// #ifdef MP-ALIPAY
					// 支付宝小程序电子签约插件调用
					// 方式1: 优先使用 my.signContract（支付宝官方API）
					if (typeof my.signContract === 'function') {
						my.signContract({
							taskId: taskId,
							success: (res) => {
								console.log('签约成功:', res)
								resolve({
									success: true,
									data: res
								})
							},
							fail: (err) => {
								console.error('签约失败:', err)
								// 如果官方API失败，尝试使用插件
								this.tryPluginSign(taskId, resolve, reject)
							}
						})
					} else {
						// 如果官方API不存在，直接尝试插件
						this.tryPluginSign(taskId, resolve, reject)
					}
					// #endif
					
					// #ifndef MP-ALIPAY
					reject(new Error('当前平台不支持电子签约功能'))
					// #endif
				})
			},
			
			/**
			 * 尝试使用插件方式签约（备用方案）
			 */
			tryPluginSign(taskId, resolve, reject) {
				// #ifdef MP-ALIPAY
				try {
					// 方式2: 使用插件API（需要根据实际插件文档调整）
					const plugin = requirePlugin('signContract')
					if (plugin && typeof plugin.signContract === 'function') {
						plugin.signContract({
							taskId: taskId,
							success: (res) => {
								console.log('插件签约成功:', res)
								resolve({
									success: true,
									data: res
								})
							},
							fail: (err) => {
								console.error('插件签约失败:', err)
								reject(new Error(err.errorMessage || err.message || '签约失败'))
							}
						})
					} else {
						reject(new Error('电子签约插件未正确配置，请检查 manifest.json 中的插件配置'))
					}
				} catch (error) {
					console.error('调用插件失败:', error)
					reject(new Error('电子签约插件调用失败: ' + (error.message || '未知错误')))
				}
				// #endif
			},
			
			/**
			 * 提交签约
			 */
			async handleSubmit() {
				// 验证表单
				if (!this.validateForm()) {
					return
				}
				
				this.loading = true
				
				try {
					// 1. 调用后端接口创建签约任务
					const result = await createContractTask({
						name: this.form.name.trim(),
						idCard: this.form.idCard.trim(),
						phone: this.form.phone.trim(),
						date: this.form.date
					})
					
					// 处理返回结果
					const contractData = result.data || result
					const taskId = contractData.taskId
					
					if (!taskId) {
						throw new Error(result.message || '创建签约任务失败，未返回任务ID')
					}
					
					// 2. 调用支付宝信任签API
					const signResult = await this.callTrustSign(taskId)
					
					if (signResult.success) {
						uni.showToast({
							title: '签约成功',
							icon: 'success',
							duration: 2000
						})
						
						// 延迟返回上一页
						setTimeout(() => {
							uni.navigateBack()
						}, 2000)
					} else {
						throw new Error('签约失败')
					}
				} catch (error) {
					console.error('签约异常:', error)
					
					// 判断错误类型
					let errorMessage = '签约失败，请重试'
					if (error.message) {
						errorMessage = error.message
					} else if (error.errMsg) {
						errorMessage = error.errMsg
					}
					
					uni.showModal({
						title: '提示',
						content: errorMessage,
						showCancel: false,
						confirmText: '知道了'
					})
				} finally {
					this.loading = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background: $bg-gradient;
		padding: 32rpx;
	}
	.form-container {
		background: $bg-card;
		border-radius: 20rpx;
		padding: 40rpx 32rpx;
		margin-bottom: 32rpx;
		box-shadow: $shadow-card;
		backdrop-filter: blur(10rpx);
		border: 1rpx solid $border-color-light;
	}
	.form-item {
		margin-bottom: 40rpx;
	}
	.label {
		font-size: 28rpx;
		color: $text-primary;
		font-weight: 500;
		display: block;
		margin-bottom: 20rpx;
	}
	.input {
		width: 100%;
		height: 80rpx;
		background-color: $bg-input;
		border-radius: 12rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: $text-primary;
	}
	.picker-view {
		height: 80rpx;
		line-height: 80rpx;
		background-color: $bg-input;
		border-radius: 12rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: $text-primary;
	}
	.submit-btn {
		width: 100%;
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
	
	.submit-btn[disabled] {
		opacity: 0.6;
		background: rgba(107, 182, 255, 0.6);
	}
</style>

