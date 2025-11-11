<template>
	<view class="container">
		<view class="form-container">
			<view class="form-item">
				<text class="label">借支金额</text>
				<input class="input" v-model="form.amount" placeholder="请输入借支金额" type="digit" />
			</view>
			<view class="form-item">
				<text class="label">借支原因</text>
				<textarea class="textarea" v-model="form.reason" placeholder="请输入借支原因" maxlength="200"></textarea>
			</view>
		</view>
		<button class="submit-btn" @click="handleSubmit">提交申请</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					amount: '',
					reason: ''
				}
			}
		},
		methods: {
			handleSubmit() {
				if (!this.form.amount || !this.form.reason) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					})
					return
				}
				uni.showToast({
					title: '申请提交成功',
					icon: 'success'
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
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
	.textarea {
		width: 100%;
		min-height: 200rpx;
		background-color: $bg-input;
		border-radius: 12rpx;
		padding: 24rpx;
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
</style>

