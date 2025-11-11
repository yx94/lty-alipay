<template>
	<view class="home-container">
		<!-- 用户信息区域 -->
		<view class="user-section">
			<view class="user-card">
				<view class="avatar-wrapper">
					<image class="avatar" :src="userInfo.avatar || '/static/logo.png'" mode="aspectFill"></image>
					<view class="avatar-border"></view>
				</view>
				<text class="nickname">{{ userInfo.userName || '用户' }}</text>
				<view class="role-badge">
					<text class="role-text">{{ roleName }}</text>
				</view>
			</view>
		</view>

		<!-- 功能菜单区域 -->
		<view class="menu-section">
			<view class="section-header">
				<text class="section-title">功能菜单</text>
				<view class="title-line"></view>
			</view>
			<view class="menu-grid">
				<view 
					class="menu-item" 
					:class="{ 'menu-item-disabled': !menu.enabled }"
					v-for="(menu, index) in menuList" 
					:key="index"
					@click="navigateToMenu(menu)"
				>
					<view class="menu-icon-wrapper">
						<text class="menu-icon">{{ menu.icon }}</text>
					</view>
					<text class="menu-name">{{ menu.name }}</text>
					<view v-if="!menu.enabled" class="menu-status">
						<text class="status-text">未开放</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 退出登录 -->
		<view class="logout-section">
			<view class="logout-btn" @click="handleLogout">
				<text class="logout-text">退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import loginService from '@/utils/login.js'
	import { getMenuList, getRoleName, ROLE } from '@/utils/permission.js'

	export default {
		data() {
			return {
				userInfo: {},
				menuList: []
			}
		},
		computed: {
			roleName() {
				return getRoleName(this.userInfo.role)
			}
		},
		onLoad() {
			this.loadUserInfo()
			this.loadMenuList()
		},
		onShow() {
			// 每次显示页面时刷新用户信息
			// this.loadUserInfo()
		},
		methods: {
			/**
			 * 加载用户信息
			 */
			async loadUserInfo() {
				const userInfo = await loginService.getUserInfo()
				console.log('home',userInfo)
				if (userInfo) {
					this.userInfo = userInfo
				} else {
					// 如果没有用户信息，跳转到登录页
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}
			},

			/**
			 * 加载菜单列表
			 */
			loadMenuList() {
				const userInfo = uni.getStorageSync('userInfo')
				if (userInfo && userInfo.role) {
					this.menuList = getMenuList(userInfo.role)
				}
			},

			/**
			 * 跳转到功能页面
			 */
			navigateToMenu(menu) {
				// 检查功能是否开放
				if (!menu.enabled) {
					uni.showToast({
						title: '该功能还未开放',
						icon: 'none',
						duration: 2000
					})
					return
				}
				
				if (menu.path) {
					uni.navigateTo({
						url: menu.path,
						fail: (err) => {
							console.error('跳转失败:', err)
							uni.showToast({
								title: '页面跳转失败',
								icon: 'none'
							})
						}
					})
				}
			},

			/**
			 * 退出登录
			 */
			handleLogout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							loginService.logout()
							uni.reLaunch({
								url: '/pages/index/index'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home-container {
		min-height: 100vh;
		background: $bg-gradient;
		padding-bottom: 40rpx;
	}

	/* 用户信息区域 */
	.user-section {
		padding: 60rpx 32rpx 40rpx;
	}

	.user-card {
		background: $bg-card-opacity;
		border-radius: 24rpx;
		padding: 50rpx 40rpx 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: $shadow-card-large;
		backdrop-filter: blur(10rpx);
	}

	.avatar-wrapper {
		position: relative;
		margin-bottom: 32rpx;
	}

	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background-color: #f5f5f5;
		position: relative;
		z-index: 2;
	}

	.avatar-border {
		position: absolute;
		top: -4rpx;
		left: -4rpx;
		width: 128rpx;
		height: 128rpx;
		border-radius: 50%;
		background: $gradient-primary;
		z-index: 1;
		opacity: $opacity-border;
	}

	.nickname {
		font-size: 36rpx;
		font-weight: 600;
		color: $text-primary;
		margin-bottom: 16rpx;
		letter-spacing: 0.5rpx;
		text-align: center;
	}

	.role-badge {
		display: inline-block;
		padding: 8rpx 24rpx;
		background: $gradient-primary;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(74, 158, 255, 0.2);
	}

	.role-text {
		font-size: 24rpx;
		color: $text-white;
		font-weight: 500;
		letter-spacing: 0.5rpx;
	}

	/* 功能菜单区域 */
	.menu-section {
		padding: 0 32rpx;
		margin-top: 20rpx;
	}

	.section-header {
		margin-bottom: 32rpx;
		position: relative;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: $text-primary;
		letter-spacing: 0.5rpx;
		display: inline-block;
		position: relative;
		padding-left: 16rpx;
	}

	.section-title::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 6rpx;
		height: 28rpx;
		background: $gradient-primary;
		border-radius: 3rpx;
	}

	.title-line {
		width: 60rpx;
		height: 2rpx;
		background: linear-gradient(90deg, $color-primary 0%, transparent 100%);
		margin-top: 12rpx;
		margin-left: 16rpx;
	}

	.menu-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24rpx;
	}

	.menu-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 36rpx 20rpx 32rpx;
		background: $bg-card;
		border-radius: 20rpx;
		position: relative;
		box-shadow: $shadow-card;
		transition: all 0.3s ease;
		backdrop-filter: blur(10rpx);
		border: 1rpx solid $border-color-light;
	}

	.menu-item:active {
		transform: translateY(-4rpx);
		box-shadow: 0 8rpx 28rpx rgba(74, 158, 255, 0.15);
		background: rgba(255, 255, 255, 1);
	}

	.menu-item-disabled {
		background: $bg-disabled;
		border-color: rgba(240, 240, 240, 0.5);
		opacity: $opacity-disabled;
	}

	.menu-item-disabled:active {
		transform: none;
		box-shadow: $shadow-card;
	}

	.menu-icon-wrapper {
		width: 88rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, rgba(107, 182, 255, 0.1) 0%, rgba(74, 158, 255, 0.1) 100%);
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		transition: all 0.3s ease;
	}

	.menu-item:active .menu-icon-wrapper {
		background: linear-gradient(135deg, rgba(107, 182, 255, 0.2) 0%, rgba(74, 158, 255, 0.2) 100%);
		transform: scale(1.05);
	}

	.menu-icon {
		font-size: 48rpx;
		line-height: 1;
	}

	.menu-item-disabled .menu-icon-wrapper {
		background: rgba(240, 240, 240, 0.5);
	}

	.menu-name {
		font-size: 26rpx;
		color: $text-primary;
		font-weight: 500;
		text-align: center;
		letter-spacing: 0.3rpx;
		line-height: 1.4;
	}

	.menu-item-disabled .menu-name {
		color: $text-tertiary;
	}

	.menu-status {
		position: absolute;
		top: 12rpx;
		right: 12rpx;
	}

	.status-text {
		font-size: 20rpx;
		color: $text-tertiary;
		padding: 4rpx 10rpx;
		background: rgba(240, 240, 240, 0.8);
		border-radius: 8rpx;
		font-weight: 400;
	}

	/* 退出登录 */
	.logout-section {
		padding: 60rpx 32rpx 40rpx;
		margin-top: 20rpx;
	}

	.logout-btn {
		background: $bg-card;
		border-radius: 20rpx;
		padding: 28rpx 0;
		text-align: center;
		box-shadow: $shadow-card;
		backdrop-filter: blur(10rpx);
		border: 1rpx solid $border-color-light;
		transition: all 0.3s ease;
	}

	.logout-btn:active {
		transform: translateY(-2rpx);
		box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.08);
		background: rgba(255, 255, 255, 1);
	}

	.logout-text {
		font-size: 28rpx;
		color: $text-secondary;
		font-weight: 500;
		letter-spacing: 0.5rpx;
	}
</style>

