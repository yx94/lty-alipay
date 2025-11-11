<template>
	<view class="container">
		<view class="form-container">
			<!-- <view class="form-item">
				<text class="label">选择员工</text>
				<picker mode="selector" :range="employeeList" range-key="name" @change="onEmployeeChange">
					<view class="picker-view">{{ selectedEmployee.name || '请选择员工' }}</view>
				</picker>
			</view> -->
			<view class="form-item">
				<text class="label">身份证人像面</text>
				<view class="upload-area" @click="chooseFront()">
					<image v-if="images.front" :src="images.front" class="uploaded-image"></image>
					<view v-else class="upload-placeholder">
						<image src="/static/font.png" mode="widthFix"></image>
						<!-- <text>点击上传</text> -->
					</view>
				</view>
				<text class="tips">* 点击上传身份证人像面</text>
			</view>
			<view class="form-item">
				<text class="label">身份证国徽面</text>
				<view class="upload-area" @click="chooseBack()">
					<image v-if="images.back" :src="images.back" class="uploaded-image"></image>
					<view v-else class="upload-placeholder">
						<image src="/static/back.png" mode="widthFix"></image>
					</view>
				</view>
				<text class="tips">* 点击上传身份证国徽面</text>
			</view>
		</view>
		<button class="submit-btn" @click="handleSubmit">提交</button>
	</view>
</template>

<script>
	import {
		updateIdCardPhoto
	} from '@/services/api/index.js'
	import {uploadFile} from '@/services/api/index.js'
	export default {
		data() {
			return {
				employeeList: [{
						id: 1,
						name: '张三'
					},
					{
						id: 2,
						name: '李四'
					}
				],
				formData:{
					idCard: '', //身份证号
					idCardPortrait:'', //身份证人像面
					idCardEmblem:'',  //身份证国徽面
				},
				
				selectedEmployee: {},
				images: {
					front: '',
					back: ''
				}
			}
		},
		methods: {
			onEmployeeChange(e) {
				this.selectedEmployee = this.employeeList[e.detail.value]
			},
			//上传身份证正面
			chooseFront() {
				const {
					IDCardTypes
				} = requirePlugin('ocr')
				this.chooseImage(IDCardTypes.FRONT).then(res => {
					if (res.data.name.data !== undefined) {
						// 执行代码
						uploadFile(res.image).then(imgres=>{
							this.images.front = res.image
							this.formData.idCard = res.data.num.data // 身份证号码
							this.formData.idCardEmblem = imgres.url
							console.log('imgres',imgres)
						})
						
					} else {
						uni.showToast({
							title: '请上传正确的身份证照片',
							icon: 'none'
						})
					}
				})
			},
			// 上传身份证背面
			chooseBack() {
				const {
					IDCardTypes
				} = requirePlugin('ocr')
				this.chooseImage(IDCardTypes.BACK).then(res => {
					if (res.data.issue.data !== undefined) {
						// 执行代码
						uploadFile(res.image).then(imgres=>{
							this.images.back = res.image
							this.formData.idCardPortrait = imgres.url
						})
					} else {
						uni.showToast({
							title: '请上传正确的身份证照片',
							icon: 'none'
						})
					}

				})
			},
			chooseImage(type) {
				const {
					readIDCard
				} = requirePlugin('ocr')
				return new Promise((resolve, reject) => {
					readIDCard({
							bizId: 'idCard',
							type: type
						})
						.then(res => {
							if (res.error) {
								console.log('error', res)
								uni.showToast({
									title: '请上传正确的身份证照片',
									icon: 'none'
								})
								reject(res)
							} else {
								console.log('112', res)
								resolve(res)
							}
						})
						.catch(err => {
							uni.showToast({
								title: 'readIDCard err' + err,
								icon: 'none'
							})
							console.log('readIDCard err', err)
						})
				})
			},
			async handleSubmit() {
				if (!this.images.front || !this.images.back) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					mask:true,
					title:'正在提交。。。'
				})
				
				// 调用真实的后端接口
				let result = await updateIdCardPhoto(this.formData)
				uni.showToast({
					title: '提交成功',
					icon: 'success'
				})
				uni.hideLoading()
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
				// console.log('result updateIdCardPhoto', result)				
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

	.picker-view {
		height: 80rpx;
		line-height: 80rpx;
		background-color: $bg-input;
		border-radius: 12rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: $text-primary;
	}
	
	.upload-area {
		width: 100%;
		height: 400rpx;
		border: 2rpx dashed $border-color-dashed;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: $bg-input-light;
	}

	.uploaded-image {
		width: 100%;
		height: 100%;
		border-radius: 12rpx;
	}

	.upload-placeholder {
		color: $text-tertiary;
		font-size: 28rpx;
		width: 100%;
		height: 100%;
		border-radius: 12rpx;
		overflow: hidden;
		&>image{
			width: 100%;
			height: 100%;
			border-radius: 12rpx;
		}
	}
	
	.tips{
		font-size: 20rpx;
		line-height: 40rpx;
		color: $text-tertiary;
		// font-weight: 500;
		display: block;
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
</style>