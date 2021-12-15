<template>
	<view class="center">
		<view class="user-top">
			<image class="user-bg" src="/static/img/ucenter/user-top-bg.jpg"></image>
			<view class="user-top-box">
				<view class="logo" :hover-class="!login ? 'logo-hover' : ''">
					<image class="logo-img" :src="login ? uerInfo.headPicUrl :avatarUrl" @click="goLogin"></image>
					<view class="logo-title">
						<view class="flex flex-col">
							<view>
								<text class="uer-name" @click="goLogin">{{login ? uerInfo.username : '未登录'}}</text>
								<i v-if="login && uerInfo.isExpert == '1'" class="iconfont icon-jiangzhang"></i>
								<i v-if="login && uerInfo.isCompany == '1'" class="iconfont icon-jigou"></i>
								<text class="certification-ico" @click="goDetail('certification-process/index')" v-if="login && uerInfo.isCompany != '1' && uerInfo.isExpert != '1'">身份认证</text>
							</view>

							<text class="uer-desc">{{login ? (uerInfo.introduction ? uerInfo.introduction : '做个简单的自我介绍吧') : '登录源点，获得更多功能'}}</text>
						</view>
						<view v-if="login" style="color: #bdbdbd; font-size: 24rpx;" @click="goLogin">
							编辑资料<!-- <uni-icons type="arrowright" size="13 " color="#bdbdbd"></uni-icons> -->
						</view>
					</view>
				</view>

				<view class="top-other">
					<view class="top-other-block" @click="goDetail('points/points')">
						<image class="other-img" src="/static/img/ucenter/utop-ico1.png" mode="aspectFit"></image>
						<text class="other-tt">积分</text>
						<text class="other-num">{{bonusScore}}</text>
					</view>
					<view class="top-other-block" @click="goDetail('calendar/calendar')">
						<image class="other-img" src="/static/img/ucenter/utop-ico2.png" mode="aspectFit"></image>
						<text class="other-tt">签到</text>
						<text class="other-num">赚积分</text>
					</view>
					<view class="top-other-block" @click="goDetail('msg-box/msg-box')" style="position: relative;">
						<image class="other-img" src="/static/img/ucenter/utop-ico3.png" mode="aspectFit"></image>
						<text class="other-tt">消息</text>
						<text class="other-num">{{messageCount}}</text>
						<text class="other-num unread-count" v-show="unReadCount && unReadCount > 0">{{unReadCount}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 列表 -->
		<uni-list style="border-bottom: 10px solid #f7f7f7;">
			<uni-list-item class="list-item" title="我的创作" thumb="/static/img/ucenter/ico1.png" @click="goDetail('my-article/my-article')"></uni-list-item>
			<uni-list-item class="list-item" title="我的收藏" thumb="/static/img/ucenter/ico2.png" @click="goDetail('my-favorites/my-favorites')"></uni-list-item>
			<uni-list-item class="list-item" title="我的关注" thumb="/static/img/ucenter/ico3.png" @click="goDetail('my-focus/my-focus')"></uni-list-item>
			<uni-list-item class="list-item" title="浏览历史" thumb="/static/img/ucenter/ico4.png" @click="goDetail('view-history/view-history')"></uni-list-item>
		</uni-list>
		<uni-list>
			<uni-list-item class="list-item" title="邀请朋友" thumb="/static/img/ucenter/ico5.png" @click="goDetail('invite-friend/invite-friend')"></uni-list-item>
			<uni-list-item class="list-item" title="邀请码" thumb="/static/img/ucenter/ico7.png" @click="openPop()"></uni-list-item>
			<uni-list-item class="list-item" title="设置" thumb="/static/img/ucenter/ico6.png" @click="goDetail('setting/setting')"></uni-list-item>
		</uni-list>

		<!-- 输入邀请码的弹窗 -->
		<uni-popup ref="invitationTip" type="center" :mask-click="false">
			<view class="uni-tip">
				<text class="uni-tip-title">邀请码</text>
				<view class="uni-input-box">
					<textarea class="uni-input" row="1" v-model="invitationCode" maxlength="100" placeholder-style="color:#b6b6b6"
					 placeholder="请输入好友邀请码" />
				</view>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" style="color: #999999;" @click="buttonTip(false)">取消</text>
					<text class="uni-tip-button" @click="buttonTip(true)">确定</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	import store from "@/store";
	import websocket from '@/websocket/index.js';
	import * as utils from '@/utils/index.js';
	import { Api_GetInfo, Api_GetCheckIn } from '@/api/userCenter.js';
	import { Api_GetMessageCount } from '@/api/message.js';
	import { Api_GetBonusScore } from "@/api/points.js";
    import { Api_SaveInvitationCode } from '@/api/baseApi.js';
	export default {
		data() {
			return {
				login: false,
				avatarUrl: '/static/img/demo1.png',
				uerInfo: {},
				bonusScore: 0,
				checkInDays: 0,
				messageCount: 0,
                invitationCode: '',
				ws: null
			}
		},
		computed: {
			model: {
				get() {
					return this.value;
				},
				set(newVal) {
					this.$emit('input', newVal);
				}
			},
			...mapGetters([
				'unReadCount'
			])
		},
		onLoad(){
            this.getUserInfo();
		},
		onNavigationBarButtonTap(e) {
			console.log(e)
			console.log("点击扫码");
			if (this.login) {
				uni.scanCode({
					onlyFromCamera: true,
					scanType: ['qrCode'],
				    success: function (res) {
				        console.log('条码内容：' + res.result);
						uni.navigateTo({
						    url: res.result
						});
				    },
					fail:function(e){
						console.log('识别失败');
					}
				});
			} else {
                uni.showToast({
                    icon:'none',
                    title: '请先登录',
                    duration: 2000
                });
                setTimeout(function(){
                    uni.navigateTo({
                        url: '/pages/login/login'
                    });
                }, 1000);
			}
		},
		async onShow() {
			if (uni.getStorageSync('user-token')) {
				this.getUserInfo();
				this.getBonusScore();
				this.getMessageCount('');
				this.getMessageCount('0');
			} else {
				// 清除消息气泡
				uni.removeTabBarBadge({
					index: 3
				});
			}
		},
		methods: {
			goCertificatoin(){},
            buttonTip(flag) {
                if (flag) {
                    if (!this.invitationCode) {
                        uni.showToast({
                            icon:'none',
                            title: '请输入邀请码',
                            duration: 2000
                        });
                        return;
                    }

                    Api_SaveInvitationCode({invitationCode: this.invitationCode}).then(res => {
                        if (res.statusCode === 1) {
                            uni.setStorageSync('inputInvitationCode', true);
                            this.$refs['invitationTip'].close();
                            uni.showToast({
                                title: '邀请码输入正确',
                                duration: 2000
                            });
                        } else if (res.statusCode === 2){
                            uni.showToast({
                                title: '无效邀请码',
                                icon: "none",
                                duration: 2000
                            });
                        }
                    });
                } else {
                    this.$refs['invitationTip'].close();
                }
            },
			// 获取用户信息
			getUserInfo() {
				utils.getUserInfo(true).then(user => {
					if (user.userId) {
						this.login = true;
						this.uerInfo = user;
						console.info(this.uerInfo);
						if (user.userId) {
							websocket.dispatch('initWebsocket');
						}
					}
				});
			},
			// 获取可用积分
			getBonusScore() {
				Api_GetBonusScore({}).then(res => {
					if (res.statusCode == '1') {
						this.bonusScore = res.data;
					}
				});
			},
			// 获取消息数量
			getMessageCount(readStatus) {
				Api_GetMessageCount({readStatus: readStatus}).then(res => {
					if (res.statusCode == '1') {
						if (readStatus == '0') {
							this.unRead = res.data;
							this.$store.dispatch('saveUnReadCount', res.data);
						} else {
							this.messageCount = res.data;
						}
					}
				});
			},
			goLogin() {
				if (!this.login) {
					console.log('点击前往登录');
					uni.navigateTo({
						url: '/pages/login/login'
					});
				} else {
					// 跳转个人信息编辑页面
					uni.navigateTo({
						url: '/pages/user-center/user-info/user-info'
					});
				}
			},
            openPop() {
                if (uni.getStorageSync('inputInvitationCode')) {
                    uni.showToast({
                        title: '不可重复输入',
                        icon: "none",
                        duration: 2000
                    });
                } else {
                    this.$nextTick(() => {
                        this.$refs['invitationTip'].open();
                        this.invitationCode = '';
                    });
				}
            },
			goDetail(link) {

                if (!this.login) {
                    uni.showToast({
                        icon:'none',
                        title: '请先登录',
                        duration: 2000
                    });
                    setTimeout(function(){
                        uni.navigateTo({
                            url: '/pages/login/login'
                        });
                    }, 1000);
                } else {
                    uni.navigateTo({
                        url: link
                    });
                }
			}
		}
	}
</script>

<style scoped>
	.certification-ico {
		background-color: #ec4d37;
		color: #ffffff;
		font-size: 20rpx;
		border-radius: 5px;
		padding: 0 10rpx;
	}
	/deep/ .uni-list-item__container:after {
		height: 0;
	}
	/deep/ .uni-list-item__container {
		border: none;
	}

	/deep/ .uni-icons {
		font-size: 16px!important;
	}
	/deep/ .uni-list-item__content-title {
		font-size: 15px!important;
		color: #000!important;
	}

	.list-item {
		margin-bottom: -1px;
	}

	.user-top {
		position: relative;
		width: 750rpx;
		height: 525rpx;
	}

	.user-bg {
		position: absolute;
		width: 750rpx;
		height: 387rpx;
	}

	/* .user-top-info {
		width: 750rpx;
		height: 525rpx;
		justify-content: center;
		align-items: center;
	} */

	.user-top-box {
		position: absolute;
		left: 0;
		right: 0;
		width: 660rpx;
		height: 280rpx;
		padding: 35rpx 30rpx;
		margin: 0 auto;
		margin-top: 150rpx;
		background-color: #ffffff;
		box-shadow: 0 0 23rpx #f9eeee;
		border-radius: 30rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.logo {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-bottom: 43rpx;
		height: 105rpx;
	}

	.logo-hover {
		opacity: 0.8;
	}

	.logo-img {
		width: 105rpx;
		height: 105rpx;
		border-radius: 150rpx;
		border-width: 3rpx;
		border-style: solid;
		border-color: #ca0301;
	}

	.logo-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		margin-left: 20rpx;
	}

	.uer-name {
		font-size: 36rpx;
		color: #333333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 260rpx;
		display: inline-block;
	}

	.uer-desc {
		lines: 1;
		text-overflow: ellipsis;
		font-size: 24rpx;
		color: #999999;
	}

	.go-login-navigat-arrow {
		font-size: 38rpx;
		color: #FFFFFF;
	}

	.top-other {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		position: relative;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

	.top-other-block {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		width: 187rpx;
		align-items: center;
		text-align: center;
	}

	.other-img {
		width: 42rpx;
		height: 42rpx;
		justify-content: center;
		align-items: center;
	}

	.other-tt {
		font-size: 24rpx;
		color: #000000;
		margin-top: 5px;
		/* margin-bottom: 5rpx; */
	}

	.other-num {
		font-size: 20rpx;
		color: #999999;
	}

	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 300px;
		background-color: #fff;
		border-radius: 10px;
	}

	.uni-tip-title {
		margin-bottom: 10px;
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}

	.uni-tip-content {
		/* padding: 15px;
*/
		font-size: 14px;
		color: #666;
	}

	.uni-tip-group-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-top: 20px;
	}

	.uni-tip-button {
		flex: 1;
		text-align: center;
		font-size: 32rpx;
		color: #3b4144;
	}

	.uni-input-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		padding: 20rpx 0;
		/* flex-direction: row; */
		border-width: 2rpx;
		border-color: #e9e9eb;
		border-style: solid;
	}
	.uni-input {
		/* width: 518rpx; */
		font-size: 32rpx;
		height: 100rpx;
		line-height: 100rpx;
		/* padding-left: 30rpx; */
	}

	.unread-count {
		position: absolute;
		top: -20rpx;
		left: 100rpx;
		background-color: red;
		color: white;
		font-family: 'Helvetica Neue', Helvetica, sans-serif;
		font-size: 24rpx;
		display: inline-block;
		border-radius: 100px;
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
	}

	.icon-jigou,
	.icon-jiangzhang {
		padding-left: 5px;
		color: #D51E1E;
	}
</style>
