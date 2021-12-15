<template>
	<view class="content">
		<view class="scroll" scroll-y v-if="!loading">
			<view class="scroll-content">
				<view id="detail-intro" class="introduce-section">
					<text class="title">{{detailData.title}}</text>

					<user-focus v-show="userInfo.id" :userFocus="userInfo"></user-focus>

					<view class="introduce">
						<text v-if="detailData.releaseTime">{{detailData.releaseTime | getLocalTime}}</text>
						<text>{{detailData.browseCount}}阅读</text>
						<text v-if="!userInfo.expertName">{{detailData.author}}</text>
						<text>{{detailData.origin}}</text>
						<!-- <text>{{detailData.browseCount}}阅读</text> -->
						<!-- <view class="flex-row" v-if="detailData.tagList.length > 0" v-for="i in detailData.tagList" :key="i.contentId">
							<text v-if="i.tagName">{{i.tagName}}</text>
						</view> -->
					</view>
					<view class="subtitle" v-if="detailData.summary">
						<text class="sub-title">源点注：{{detailData.summary}}</text>
					</view>

					<view class="rich-text">
						<view v-html="detailData.text" class="rich-text-infos"></view>
						<view class="text1">特别声明：本文著作权归原作者及原出处所有，如有任何疑问请联系源点信用。</view>
						<view v-if="!detailData.readStatus" class="need-score">
							<text class="score-txt" @click="useScore">{{detailData.needScore}}积分 阅读全文</text>
							<image src="/static/img/index/double-arr.png" mode="aspectFill" class="double-arr"></image>
						</view>
					</view>
				</view>

				<!-- 评论 -->
				<view class="container">
					<yd-comment :value="ydCommentObj" :shareInfo="obj" :toolOptions="toolOptions" @dclick="scrollComment"></yd-comment>
				</view>
			</view>
		</view>

		<!-- 加载图标 -->
		<mixLoading class="mix-loading" v-if="loading"></mixLoading>

		<!-- 分享 -->
		<uni-share ref="change" :info="obj"></uni-share>

		<!-- 弹窗 -->
		<uni-popup type="center"></uni-popup>

	</view>
</template>

<script>
	import * as utils from "@/utils/index.js";
	import {
		Api_LikeCount
	} from '@/api/baseApi.js';
	import {
		Api_GoDetail,
		Api_UseScore
	} from '@/api/news.js';
	import {
		getLocalTime
	} from '@/common/js/util.js';

	import mixLoading from '@/components/mix-loading/mix-loading.vue';
	import userFocus from './user-focus.vue';
	import ydComment from '@/pages/yd-comment/comment.nvue';

	export default {
		components: {
			userFocus,
			mixLoading,
			ydComment
		},
		filters: {
			getLocalTime
		},
		data() {
			return {
				tabList: [{
					name: '评论',
					count: 0
				}],
				popInfo: {},
				loading: true,
				detailData: {},
				id: "",
				userInfo: {},
				obj: {},
				commentValue: '',
				login: false,
				uerInfo: {},
				commentList: [],
				ydCommentObj: {
					id: '',
					userId: '',
					type: 2
				},
				toolOptions: {
					placeholder: '有话要说,不吐不快',
					comment: true,
					like: true,
					share: true,
					commentCount: 0,
					likeCount: 0
				},
				ctype : 0
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.ydCommentObj.id = this.id;
			this.ctype = options.ctype ? 1 : 0;
			if (this.ctype === 1) {
				this.toolOptions.placeholder = '发表观点,同频交流'
			}
			this.loadNewsDetail();
		},
		onShow() {
			if (uni.getStorageSync('user-token')) {
				this.getUserInfo();
			}
		},
		onNavigationBarButtonTap(e) {
			this.$refs.change.share();
		},
		methods: {
			// 发布评论后，滚动到评论列表 ε=(´ο｀*)))
			scrollComment(){
				const _this = this;
				const query = uni.createSelectorQuery();
				query.select('#detail-intro').boundingClientRect(data => {
					uni.pageScrollTo({
						scrollTop: Math.round(data.height),
						duration: 0
					});
				}).exec();
			},
			useScoreApi() {
				Api_UseScore(this.id).then(res => {
					if (res.statusCode === 1) {
						uni.showToast({
							icon: 'none',
							title: "使用" + this.detailData.needScore + "积分，阅读成功",
							duration: 2000
						});
						this.loadNewsDetail();
					} else if (res.statusCode === 2) {
						uni.showModal({
							title: '提示',
							content: "抱歉，您的积分不够阅读，快去赚积分！",
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/user-center/points/points'
									});
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					}
				});
			},
			useScore() {
				let that = this;
				// 获取用户信息
				utils.getUserInfo(true).then(user => {
					if (user.isLogin) {
						uni.showModal({
							title: '提示',
							content: "是否消耗" + this.detailData.needScore + "积分",
							success: function(res) {
								if (res.confirm) {
									that.useScoreApi();
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					} else {
						setTimeout(function() {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}, 1000);
					}
				});
			},
			// 获取用户信息
			getUserInfo() {
				utils.getUserInfo(true).then(user => {
					if (user) {
						this.login = true;
						this.uerInfo = user;
						if (user.userId) {
							websocket.dispatch('initWebsocket');
						}
					}
				});
			},
			loadNewsDetail() {
				Api_GoDetail(this.id).then(res => {
					if (res.statusCode === 1) {
						this.loading = false;
						this.detailData = res.data;

						// 如果是专栏文章，评论传userId
						if (this.ctype === 1) {
							this.ydCommentObj.userId = this.detailData.expert.userId;
						}
						if(this.detailData.expert){							this.userInfo = this.detailData.expert;
						}
						// A0:资讯类   B01:专栏-专家文章  B02:专栏-行业洞见  B03:专栏-政策解读  B04:专栏-信用百科
						var type = 0;
						if (this.detailData.category == 'B01' || this.detailData.category == 'B02' || this.detailData.category == 'B03') {
							type = 1;
						} else if (this.detailData.category == 'B04') {
							type = 2;
						}
						this.obj = {
							title: this.detailData.title,
							businessId: this.id,
							summary: this.detailData.summary,
							href: this.id + '?path=/pages/details/details&id=' + this.id + "&ctype=" + this.ctype,
							type: type // 分享类型  0:资讯 1:专栏文章 2:信用百科 3:著作 4:专家 5:提问 6:回答 7:想法'
						};
					} else {
						uni.redirectTo({
							url: '/pages/404'
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		flex: 1;
	}

	.content {
		display: flex;
		flex-direction: column;
		flex: 1;
		background: #fff;
	}

	.scroll {
		flex: 1;
		position: relative;
		background-color: #f8f8f8;
	}

	.scroll-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.subtitle {
		margin-top: 22rpx;
		margin-bottom: 30rpx;
		padding: 23rpx 30rpx;
		background-color: #f9f9f9;

		.sub-title {
			color: #262626;
			font-size: 30rpx;
		}
	}

	.text1{
		margin-top: 20rpx;
		font-size: 26rpx;
		padding: 10rpx 20rpx;
		color: #ababab;
		border: 1px solid  #f7f7f7;
	}

	/* 简介 */
	.introduce-section {
		display: flex;
		flex-direction: column;
		padding: 20rpx 30rpx;
		background: #fff;
		line-height: 1.5;

		.title {
			margin-top: 20rpx;
			margin-bottom: 20rpx;
			font-size: 42rpx;
			color: #000;
		}

		.introduce {
			display: -webkit-box;
			font-size: 26rpx;
			color: #ababab;

			text {
				margin-right: 50rpx;
			}
		}
	}

	.rich-text {
		min-height: 235rpx;
		position: relative;
	}

	.rich-text-infos /deep/ img {
		width: 100% !important;
		height: auto !important;
	}

	.need-score {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 235rpx;
		display: flex;
		align-items: end;
		justify-content: center;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));

		.score-txt {
			color: #ce0201;
			font-size: 24rpx;
			text-align: center;
			border-bottom-style: dashed;
			border-bottom-color: #ce0201;
			border-bottom-width: 1rpx;
			padding-top: 180rpx;
			padding-right: 28rpx;
		}

		.double-arr {
			width: 21rpx;
			height: 20rpx;
			padding-top: 195rpx;
			margin-left: -16rpx;
		}
	}
</style>
