<template>
	<view>
		<!-- {{ info }} -->
		<!-- share弹窗 -->
		<view class="share" :class="shareClass" @tap="hideShare" @click="show">
			<view class="mask"></view>
			<view class="layer">
				<view class="h1">分享至</view>
				<view class="list">
					<view class="box" data-sharetype="weixin" data-sharescene="WXSceneSession" @click="appOAuthShare">
						<image src="/static/img/share/wx.png"></image>
						<view class="title">
							微信好友
						</view>
					</view>
					<view class="box" data-sharetype="weixin" data-sharescene="WXSenceTimeline" @click="appOAuthShare">
						<image src="/static/img/share/pyq.png"></image>
						<view class="title">
							朋友圈
						</view>
					</view>
					<view class="box" data-sharetype="qq" @click="appOAuthShare">
						<image src="/static/img/share/qq.png"></image>
						<view class="title">
							QQ
						</view>
					</view>
					<view class="box" data-sharetype="sinaweibo" @click="appOAuthShare">
						<image src="/static/img/login/sina.png"></image>
						<view class="title">
							微博
						</view>
					</view>
					<view class="box" @click="copyUrl">
						<image src="/static/img/share/copy.png"></image>
						<view class="title">
							复制链接
						</view>
					</view>
					<view class="box" v-if="info.businessId" @click="shareToFAQ">
						<image src="/static/img/share/yd.png"></image>
						<view class="title">
							分享到源点
						</view>
					</view>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	import Config from '@/api/apiUrl.js'
	import { Api_AddShare } from "@/api/share.js";
	import { Api_SaveScore } from "@/api/points.js";
	import * as utils from "@/utils/index.js";
	export default {
		props: {
			info: {
			    type: Object,
			    default: function(e) {
			        return {
						// title: '标题',(必填)
						// summary: '描述内容',
						// imageUrl: '图片地址', (可不传)
						// href: '路由地址',（如果有参数，用 &参数名=参数值 拼接一下，例：/pages/user-center/user-center&id=111&name=222）
						// type: '5', // 分享类型  分享类型  0:资讯 1:专栏文章 2:信用百科 3:著作 4:提问 5:回答 6:专家 7:想法'   (必填)
						// businessId: '1' // 当前业务主键id(必填)
					}
			    }
			}
		},
		data() {
			return {
				shareClass: ''
			}
		},
		methods: {
			// 分享
			share(){
				this.shareClass = 'show';
			},
			hideShare(){
			    this.$emit('click');
				this.shareClass = 'hide';
				setTimeout(() => {
					this.shareClass = 'none';
				}, 150);
			},
			// 微信、QQ、微博的分享
			appOAuthShare (e) {
				var me = this;
				// 1 获取用户的分享类型
				var shareType = e.currentTarget.dataset.sharetype;
				var scene = e.currentTarget.dataset.sharescene;
				if (!scene) {
					scene = null;
				}
				var type = 0;
				const platform = uni.getSystemInfoSync().platform;
				if (shareType == 'qq' && platform == 'android') {
					type = 2;
				}
				// 链接
				var href;
				if (this.info.type === 0) {
                    href = Config.shareNewsUrl;
				} else if (this.info.type === 1) {
                    href = Config.shareTopicUrl;
				} else if (this.info.type === 2) {
                    href = Config.shareEntryUrl;
                } else if (this.info.type === 3) {
                    href = Config.shareBookDetailUrl;
                } else {
                    href = Config.shareUrl;
				}

				if (this.info.href) {
					href +=	this.info.href;
				}
				if (this.info.type) {
					href +=	'&type=' + this.info.type;
				}
				// 标题
				if (!this.info.title) {
					this.info.title = '源点信用';
				}
				/*if (this.info.title.length > 15) {
					this.info.title = this.info.title.substr(0, 12) + '...';
				}
				// 描述
				if (this.info.summary && this.info.summary.length > 30) {
					this.info.summary = this.info.summary.substr(0, 27) + '...';
				}*/
				// 图标
				if (!this.info.imageUrl) {
					this.info.imageUrl = '/static/img/res/icons/share.png';
				}
				if (shareType == 'sinaweibo') {
					this.info.imageUrl = null;
				}
				// 2 授权分享，弹出分享窗口
				uni.share({
					provider: shareType,
					scene: scene,
					type: type,
					href: href,
					title:  this.info.title,
					summary: this.info.summary ? this.info.summary : '',
					imageUrl: this.info.imageUrl,
					success: function (res) {

					    // 判断用户是否登录
                        utils.getUserInfo(true).then(user => {
                            if (user.userId) {
                                if (me.info.businessId) {
                                    // 转发成功保存积分
                                    Api_SaveScore({type: '5'}).then(data => {
                                        if (data.statusCode === 1) {
                                            setTimeout((e) => {
                                                utils.showScore(data.data.score);
                                            }, 1000);
                                        }
                                    });
                                }
                            }
                        });

						me.hideShare();
					},
					fail: function (err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
			},
			copyUrl() {
				var me = this;
				// 链接
                var href;
                if (this.info.type === 0) {
                    href = Config.shareNewsUrl;
                } else if (this.info.type === 1) {
                    href = Config.shareTopicUrl;
                } else if (this.info.type === 2) {
                    href = Config.shareEntryUrl;
                } else if (this.info.type === 3) {
                    href = Config.shareBookDetailUrl;
                } else {
                    href = Config.shareUrl;
                }

                if (this.info.href) {
					href +=	this.info.href;
				}
				if (this.info.type) {
					href +=	'&type=' + this.info.type;
				}
				uni.setClipboardData({
				    data: href,
				    success: function () {
						uni.showToast({
							icon:'none',
							title: '复制成功',
							duration: 2000
						});
						me.hideShare();
				    }
				});
			},
			// 分享至大家谈，保存到分享表
			shareToFAQ() {
				var me = this;
				var type = this.info.type;
				var businessId = this.info.businessId;
				Api_AddShare({shareType: type, businessId: businessId}).then(res => {
					if (res.statusCode == '1') {
						uni.showToast({
							icon:'none',
							title: '转发成功',
							duration: 2000
						});
					} else if (res.statusCode == '2') {
						uni.showToast({
							icon:'none',
							title: '同一内容不可转发多次',
							duration: 2000
						});
					}
					me.hideShare();
				});
			},
		}
	}
</script>

<style scoped lang="scss">

@keyframes showPopup {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
@keyframes hidePopup {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}
@keyframes showLayer {
	0% {
		transform: translateY(0);
	}
	100% {
		transform: translateY(-100%);
	}
}
@keyframes hideLayer {
	0% {
		transform: translateY(-100%);
	}
	100% {
		transform: translateY(0);
	}
}

.icon {
	font-size: 26rpx;
}
.popup {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 20;
	display: none;
	.mask{
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 21;
		background-color: rgba(0, 0, 0, 0.6);
	}
	.layer {
		position: fixed;
		z-index: 22;
		bottom: -70%;
		width: 92%;
		padding: 0 4%;
		height: 70%;
		border-radius: 20rpx 20rpx 0 0;
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;
		align-content: space-between;
		.content {
			width: 100%;
			padding: 20rpx 0;
		}
		.btn {
			width: 100%;
			height: 100rpx;
			.button {
				width: 100%;
				height: 80rpx;
				border-radius: 40rpx;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #f47952;
				font-size: 28rpx;
			}
		}
	}

	&.show {
		display: block;
		.mask{
			animation: showPopup 0.2s linear both;
		}
		.layer {
			animation: showLayer 0.2s linear both;
		}
	}
	&.hide {
		display: block;
		.mask{
			animation: hidePopup 0.2s linear both;
		}

		.layer {
			animation: hideLayer 0.2s linear both;
		}
	}
	&.none {
		display: none;
	}
	&.service {
		.row {
			margin: 30rpx 0;
			.title {
				font-size: 30rpx;
				margin: 10rpx 0;
			}
			.description {
				font-size: 28rpx;
				color: #999;
			}
		}
	}
	&.spec {
		.title {
			font-size: 30rpx;
			margin: 30rpx 0;
		}
		.sp {
			display: flex;
			view {
				font-size: 28rpx;
				padding: 5rpx 20rpx;
				border-radius: 8rpx;
				margin: 0 30rpx 20rpx 0;
				background-color: #f6f6f6;
				&.on {
					padding: 3rpx 18rpx;
					border: solid 1rpx #f47925;
				}
			}
		}
		.length{
			margin-top: 30rpx;
			border-top: solid 1rpx #aaa;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 20rpx;
			.text{
				font-size: 30rpx;
			}
			.number{
				display: flex;
				justify-content: center;
				align-items: center;
				.input{
					width: 80rpx;
					height: 60rpx;
					margin: 0 10rpx;
					background-color: #f3f3f3;
					display: flex;
					justify-content: center;
					align-items: center;
					text-align: center;
					input{
						width: 80rpx;
						height: 60rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;
						font-size: 26rpx;
					}
				}

				.sub ,.add{
					width: 60rpx;
					height: 60rpx;
					background-color: #f3f3f3;
					border-radius: 5rpx;
					.icon{
						font-size: 30rpx;
						width: 60rpx;
						height: 60rpx;
						display: flex;
						justify-content: center;
						align-items: center;

					}
				}
			}
		}

	}
}

.share{
	display: none;
	&.show {
		display: block;
		.mask{
			animation: showPopup 0.15s linear both;
		}
		.layer {
			animation: showLayer 0.15s linear both;
		}
	}
	&.hide {
		display: block;
		.mask{
			animation: hidePopup 0.15s linear both;
		}

		.layer {
			animation: hideLayer 0.15s linear both;
		}
	}
	&.none {
		display: none;
	}
	.mask{
		background-color: rgba(0,0,0,.5);
		position: fixed;
		width: 100%;
		height: 100%;
		top:0;
		left: 0;
		right: 0;
		z-index: 998;
	}
	.layer{
		width: 92%;
		position: fixed;
		z-index: 999;
		padding: 0 4%;
		top: 100%;
		left: 0;
		right: 0;
		background-color: #ffffff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		.list{
			width: 100%;
			display: flex;
			padding:10rpx 0 30rpx 0;
			flex-wrap: wrap;
			.box{
				width: 33%;
				height: 140rpx;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				image{
					width: 50rpx;
					height: 50rpx;
				}
				.title{
					margin-top: 17rpx;
				}
			}
		}
		.btn{
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			border-top: solid 1rpx #666666;
		}
		.h1{
			width: 100%;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			border-bottom: 1rpx solid #fafafa;
		}
	}
}
</style>
