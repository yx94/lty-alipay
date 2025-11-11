<template>
	<view class="container">
		<view class="form-container">
			<view class="form-item">
				<text class="label">选择员工</text>
				<picker mode="selector" :range="employeeList" range-key="name" @change="onEmployeeChange">
					<view class="picker-view">{{ selectedEmployee.name || '请选择员工' }}</view>
				</picker>
			</view>
			<view class="form-item">
				<text class="label">补录信息</text>
				<textarea class="textarea" v-model="form.info" placeholder="请输入需要补录的信息" maxlength="500"></textarea>
			</view>
		</view>
		<button class="submit-btn" @click="handleSubmit">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				employeeList: [
					{ id: 1, name: '张三' },
					{ id: 2, name: '李四' }
				],
				selectedEmployee: {},
				form: {
					info: ''
				}
			}
		},
		methods: {
			onEmployeeChange(e) {
				this.selectedEmployee = this.employeeList[e.detail.value]
			},
			handleSubmit() {
				if (!this.selectedEmployee.id || !this.form.info) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					})
					return
				}
				uni.showToast({
					title: '提交成功',
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
	.picker-view {
		height: 80rpx;
		line-height: 80rpx;
		background-color: $bg-input;
		border-radius: 12rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: $text-primary;
	}
	.textarea {
		width: 100%;
		min-height: 300rpx;
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

