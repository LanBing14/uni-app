<template>
	<view class="">
		<view class="text-center">
			<view class="head-img">
				<image class="logo-img" :src="login ? userInfo.headPicUrl :avatarUrl"></image>
			</view>
			<view class="username">
				<text class="user-name">{{login ? userInfo.username : '用户名'}}</text>
			</view>
			
			<view>
				<text class="gray-color">此账号尝试登陆源点信用网站。</text>
			</view>
			
			<view>
				<text class="gray-color">如非本人操作，请点击右上角关闭按钮。</text>
			</view>
		</view>
		
		<button class="yd-btn yd-btn-type1" type="primary" @tap="makeSure">允许登录源点信用网站</button>
	</view>
</template>

<script>
	import { Api_SaveAuth } from '@/api/login.js';
	import * as utils from '@/utils/index.js';
	export default {
		data() {
			return {
				sessionId: '',
				login: false,
				avatarUrl: '/static/img/demo1.png',
				userInfo: {}
			}
		},
		onNavigationBarButtonTap(e) {
			console.log(e)
			uni.switchTab({
				url: '/pages/user-center/user-center'
			});
		},
		onLoad(options) {
			this.sessionId = options.sessionId;
			console.log(this.sessionId);
			
			// 获取用户信息
			utils.getUserInfo(true).then(user => {
				if (user.userId) {
					this.login = true;
				}
				this.userInfo = user;
			});
		},
		methods: {
			// 扫一扫
			makeSure() {  
				let token = 'Bearer ' + uni.getStorageSync('user-token');
				Api_SaveAuth({sessionId: this.sessionId}).then(res => {
				    if (res.statusCode === 1) {
				        uni.showToast({
				            title: '授权成功',
				            duration: 2000
				        });
						uni.switchTab({
							url: '/pages/user-center/user-center'
						});
				    }
				});
			}
		}
	}
</script>

<style>
</style>
<style scoped>
	.head-img {
		text-align: center;
		height: 140rpx;
		margin-top: 386rpx;
	}
	.logo-img {
		width: 140rpx;
		height: 140rpx;
		border-radius: 200rpx;
		margin: 0 auto;
	}
	.username {
		margin: 20rpx 0;
		font-weight: 400;
	}
	.user-name {
		font-size: 30rpx;
		color: #262626;
		line-height: 40rpx;
		lines: 1;
		text-overflow: ellipsis;
		width: 500rpx;
	}
	.gray-color {
		width: 100%;
		color: #999999;
		font-size: 28rpx;
		line-height: 40rpx;
	}
	.yd-btn {
		margin-top: 30rpx;
		font-size: 30rpx;
	}
</style>
