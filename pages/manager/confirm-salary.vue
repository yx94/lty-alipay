<template>
	<view class="container">
		<view class="list-container">
			<view class="list-item" v-for="(item, index) in list" :key="index">
				<view class="item-info">
					<text class="name">{{ item.name }}</text>
					<text class="salary">工资金额：¥{{ item.salary }}</text>
					<text class="month">月份：{{ item.month }}</text>
				</view>
				<button class="confirm-btn" @click="handleConfirm(item)">确认</button>
			</view>
			<view v-if="list.length === 0" class="empty">
				<text>暂无待确认工资</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					{ id: 1, name: '张三', salary: 5000, month: '2024-01' },
					{ id: 2, name: '李四', salary: 6000, month: '2024-01' }
				]
			}
		},
		methods: {
			handleConfirm(item) {
				uni.showModal({
					title: '确认',
					content: '确定要确认该员工工资吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '确认成功',
								icon: 'success'
							})
							this.list = this.list.filter(i => i.id !== item.id)
						}
					}
				})
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
	.list-container {
		background: $bg-card;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: $shadow-card;
		backdrop-filter: blur(10rpx);
		border: 1rpx solid $border-color-light;
	}
	.list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx;
		border-bottom: 1rpx solid $border-color;
	}
	.list-item:last-child {
		border-bottom: none;
	}
	.item-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.name {
		font-size: 32rpx;
		color: $text-primary;
		font-weight: 500;
		margin-bottom: 12rpx;
	}
	.salary {
		font-size: 28rpx;
		color: $text-highlight;
		font-weight: 500;
		margin-bottom: 12rpx;
	}
	.month {
		font-size: 28rpx;
		color: $text-tertiary;
	}
	.confirm-btn {
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: $gradient-primary;
		color: $text-white;
		border-radius: 30rpx;
		font-size: 28rpx;
		font-weight: 500;
		border: none;
		padding: 0;
		box-shadow: $shadow-button-small;
	}
	.empty {
		padding: 100rpx 0;
		text-align: center;
		color: $text-tertiary;
		font-size: 28rpx;
	}
</style>

