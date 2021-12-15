<template>
	<view class="page">
		<view class="tabs">
			<view id="tab-bar" class="tab-bar" :v-model="tabIndex">
				<view v-for="(tab,index) in tabList" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" @click="onTab(index)">
					<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{ tab }}</text>
				</view>
				<view id="line" class="line-h" :style="{left: indicatorLineLeft}"></view>
			</view>

			<swiper :current="tabIndex" class="swiper-box" :duration="300" @change="ontabchange">
				<swiper-item class="swiper-item">
					<!-- 专家 -->
					<div style="float:left;"></div>
					<view class="padding15">
						<image src="/static/img/ucenter/progress/pg.jpg" mode="aspectFill" class="pg-img"></image>
						<p>流程介绍</p>
						<view class="line">

							<view class="dot">
								<view>
									<text class="red">申请材料</text>
								</view>
								<view>
									<text>1、仔细阅读《用户认证协议》、《个人承诺书》并签字。<br>
										2、个人身份证原件图片。<br>
										3、个人简历说明；包含姓名、照片、职务、工作经历、研究课题等。<br>
										4、将上述材料以电子档形式发送至邮箱 cp@yuandiancredit.com。
									</text>
								</view>
							</view>

							<view class="dot">
								<view>
									<text class="red">审核材料</text>
								</view>
								<text>源点小编收到申请后，仔细核对材料的真实性。</text>
							</view>

							<view class="dot">
								<view>
									<text class="red">结果通知</text>
								</view>
								<text>材料审核完毕后，源点小编将以邮件的形式回复您结果。
									身份认证通过后，您的头像/用户名后将带有“专家身份”的标识，同时，您可以在平台上进行知识创建。</text>
							</view>

						</view>
						<button class="yd-btn yd-btn-type1" type="primary" :loading="loading" @tap="downloadFun">下载申请材料</button>
					</view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<!-- 企业 -->
					<div style="clear: both;"></div>
					<view class="padding15">
						<image src="/static/img/ucenter/progress/pg.jpg" mode="aspectFill" class="pg-img"></image>
						<p>流程介绍</p>
						<view class="line">
							<view class="dot">
								<view>
									<text class="red">申请材料</text>
								</view>
								<view>
									<text>
										1、仔细阅读《用户认证协议》、《企业/机构承诺书》并签字。<br>
										三证合一的营业执照复印件、经办人身份证原件图片及复印件并加盖企业机构公章。<br>
										3、企业/机构情况说明，内容包括企业名称、企业照片、企业简介等。<br>
										4、上述所需复印件均为原件复印，并将电子档发送至邮箱 cp@yuandiancredit.com。</text>
								</view>
							</view>

							<view class="dot">
								<view>
									<text class="red">审核材料</text>
								</view>
								<text>源点小编收到申请后，仔细核对材料的真实性。</text>
							</view>

							<view class="dot">
								<view>
									<text class="red">结果通知</text>
								</view>
								<text>材料审核完毕后，源点小编将以邮件的形式回复您结果。
									身份认证通过后，您的头像/用户名后将带有“企业机构身份”的标识，同时，您可以在平台上进行知识创建。</text>
							</view>
						</view>

						<button class="yd-btn yd-btn-type1" type="primary" :loading="loading" @tap="downloadFun">下载申请材料</button>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import apiUrl from '@/api/apiUrl.js';
	export default {
		data() {
			return {
				active: 0,
				sortBtn: 'publishDate',
				newsList: [],
				banners: [],
				cacheTab: [],
				tabIndex: 0,
				tabList: ['专家认证流程', '企业机构认证流程'],
				scrollInto: "",
				showTips: false,
				navigateFlag: false,
				pulling: false,
				refreshIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg==",
				tabBarLength: 0,
				shareInfo: {},
				path: '',
				id: '',
				fixHeight: 0
			}
		},
		onNavigationBarSearchInputClicked(e) {
			uni.navigateTo({
				url: '/pages/search/search'
			});
		},
		computed: {
			indicatorLineLeft() {
				return 375 / 2 + this.tabIndex * 375 + 'rpx';
			}
		},
		mounted() {
			this.scrollComment()
		},
		methods: {
			scrollComment(){
				const _this = this;
				const query = uni.createSelectorQuery();
				query.select('.swiper-item .padding15').boundingClientRect(data => {
					console.log(data.height)
				}).exec();
			},
			onTab(e) {
				console.log(e)
				this.tabIndex = e;
				this.scrollComment()
			},
			ontabchange(e) {
				let index = e.target.current || e.detail.current;
				this.tabIndex = e.detail.current;
			},
			downloadFun() {
				let url = apiUrl.host + '/static/template/';
				if (this.tabIndex == 0) {
					url += '专家认证材料.doc';
				} else {
					url += '企业机构认证材料.doc';
				}
				uni.downloadFile({
					url: url,
					success: function (res) {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							success: function (res) {
								console.log('打开文档成功');
							}
						});
					},
					complete: function (res) {
						console.log(res)
					}
				});
			}
		}
	}
</script>

<style scoped>
	/* #ifndef APP-PLUS */
	body {
		overflow: hidden;
	}
	page {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* #endif */


	.page {
		display: flex;
		flex: 1;
		flex-direction: column;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #ffffff;
	}

	.tabs {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.tab-bar {
		width: 750rpx;
		height: 90rpx;
		position: sticky;
		top: 0;
		z-index: 999;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		justify-content: space-between;
	}

	.line-h {
		position: absolute;
		bottom: 6px;
		height: 6rpx;
		width: 48rpx;
		transition: left 0.3s;
		background-image: linear-gradient(to right, #ce0201, rgba(255, 255, 255, 0.3));
	}

	.uni-tab-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		text-align: center;
		align-items: center;
		justify-content: center;
		flex: 1;
	}

	.uni-tab-item-title {
		font-size: 30rpx;
		height: 90rpx;
		line-height: 90rpx;
		flex-wrap: nowrap;
		color: #949494;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		text-align: center;
	}

	.uni-tab-item-title-active {
		color: #000000;
		font-size: 36rpx;
	}

	.swiper-box {
		display: flex;
		flex: 1;
		flex-direction: row;
	}

	.swiper-item {
		flex: 1;
		overflow:auto;
	}

	.padding15 {
		padding: 30rpx;
	}

	.scroll-v {
		flex: 1;
		/* #ifndef MP-ALIPAY */
		flex-direction: column;
		/* #endif */
	}

	.pg-img {
		will-change: transform;
		width: 688rpx;
		height: 236rpx;
	}

	.red {
		font-size: 36rpx;
		line-height: 60rpx;
		color: #cb0100;
	}

	.yd-btn {
		margin-top: 20px;
	}

	.line {
		background: url(../../../static/img/ucenter/progress/line.png) no-repeat 16rpx;
	}

	.dot {
		padding-left: 20px;
		background: url(../../../static/img/ucenter/progress/ico.png) no-repeat left 16rpx;
		background-size: 20px;
	}
</style>
