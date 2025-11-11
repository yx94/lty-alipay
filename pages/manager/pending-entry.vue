<template>
	<view class="container">
		<view class="list-container">
			<view class="list-item" v-for="(item, index) in list" :key="index" @click="handleDetail(item)">
				<view class="item-info">
					<text class="name">{{ item.name }}</text>
					<text class="date">入职日期：{{ item.entryDate }}</text>
				</view>
				<text class="arrow">></text>
			</view>
			<view v-if="list.length === 0" class="empty">
				<text>暂无待入职数据</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					{ id: 1, name: '张三', entryDate: '2024-01-15' },
					{ id: 2, name: '李四', entryDate: '2024-01-20' }
				]
			}
		},
		methods: {
			handleDetail(item) {
				uni.showToast({
					title: '查看详情',
					icon: 'none'
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
	.date {
		font-size: 28rpx;
		color: $text-secondary;
	}
	.arrow {
		font-size: 32rpx;
		color: #cccccc;
	}
	.empty {
		padding: 100rpx 0;
		text-align: center;
		color: $text-tertiary;
		font-size: 28rpx;
	}
</style>

