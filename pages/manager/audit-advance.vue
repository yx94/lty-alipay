<template>
	<view class="container">
		<view class="list-container">
			<view class="list-item" v-for="(item, index) in list" :key="index">
				<view class="item-info">
					<text class="name">{{ item.name }}</text>
					<text class="amount">借支金额：¥{{ item.amount }}</text>
					<text class="reason">原因：{{ item.reason }}</text>
				</view>
				<view class="action-btns">
					<button class="reject-btn" @click="handleAudit(item, 'reject')">拒绝</button>
					<button class="approve-btn" @click="handleAudit(item, 'approve')">通过</button>
				</view>
			</view>
			<view v-if="list.length === 0" class="empty">
				<text>暂无待审核借支</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					{ id: 1, name: '张三', amount: 1000, reason: '临时需要' },
					{ id: 2, name: '李四', amount: 2000, reason: '生活困难' }
				]
			}
		},
		methods: {
			handleAudit(item, action) {
				const actionText = action === 'approve' ? '通过' : '拒绝'
				uni.showModal({
					title: '确认',
					content: `确定要${actionText}该借支申请吗？`,
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: `${actionText}成功`,
								icon: 'success'
							})
							// 从列表中移除
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
		padding: 32rpx;
		border-bottom: 1rpx solid $border-color;
	}
	.list-item:last-child {
		border-bottom: none;
	}
	.item-info {
		margin-bottom: 24rpx;
	}
	.name {
		font-size: 32rpx;
		color: $text-primary;
		font-weight: 500;
		display: block;
		margin-bottom: 12rpx;
	}
	.amount {
		font-size: 28rpx;
		color: $text-highlight;
		font-weight: 500;
		display: block;
		margin-bottom: 12rpx;
	}
	.reason {
		font-size: 28rpx;
		color: $text-secondary;
		display: block;
	}
	.action-btns {
		display: flex;
		justify-content: flex-end;
	}
	.reject-btn {
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: $gradient-danger;
		color: $text-white;
		border-radius: 30rpx;
		font-size: 28rpx;
		font-weight: 500;
		border: none;
		padding: 0;
		margin-right: 20rpx;
		box-shadow: $shadow-button-danger-small;
	}
	.approve-btn {
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

