<template>
	<view class="books">
		<view class="book-top flex-row" v-if="!loading">
			<image :src="resData.titleUrl?resData.titleUrl : imgUrl" mode="aspectFill" class="book-img"></image>

			<view class="flex-col" style="width: 390rpx;">
				<text class="tt">{{resData.title}}</text>
				<view class="flex-row" style="align-items: center;">
					<image :src="resData.expert.headPicUrl?resData.expert.headPicUrl : imgHeadUrl" mode="aspectFill" class="head-img"></image>
					<text class="zj-tt">{{resData.expert.expertName}}</text>
					<image src="/static/img/ico-zj.png" mode="aspectFill" class="zj-img"></image>
				</view>
			</view>

			<text class="add-focus" :class="{'already': resData.expert.status}" @click="getUserInfo(resData.expert.id)">{{!resData.expert.status?'+关注':'已关注'}}</text>

		</view>

		<view class="book-con flex-col" v-if="!loading">
			<text style="font-size: 36rpx; color: #000000;">著作详情</text>
			<view>
				<rich-text class="con" :nodes="resData.intro"></rich-text>
			</view>
		</view>

		<!-- 加载图标 -->
		<mixLoading class="mix-loading" v-if="loading"></mixLoading>

		<share-box ref='change' :info="obj"></share-box>

		<tip-box ref='tip' :info="tipInfo"></tip-box>
	</view>
</template>

<script>
    import {
        mapGetters
    } from 'vuex';
	import {Api_GetBooksDetail} from '@/api/topic.js';
	import mixLoading from '@/components/mix-loading/mix-loading.vue';
	import * as utils from '@/utils/index.js'
    import {
        Api_GetAttentionAdd
    } from "@/api/faq.js";
	export default {
		components: {
			mixLoading
		},
		data() {
			return {
				resData: [],
				imgUrl: '/static/img/demo2.png',
				imgHeadUrl: '/static/img/demo1.png',
				obj: {},
                tipInfo:{type: 2, dialogVisible: false},
				loading: true
			}
		},
		onLoad(options){
			this.id = options.id;
			this.getBooksDetail();
		},
		onNavigationBarButtonTap(e) {
			this.$refs.change.share();
		},
        computed: {
            ...mapGetters([
                'focusId'
            ])
        },
        watch: {
            'focusId': function(val){
                if(val == this.resData.expert.id){
                    this.resData.expert.status = !this.resData.expert.status;
                }
            }
        },
		methods: {
			getBooksDetail(){
				Api_GetBooksDetail(this.id).then(res=> {
					if(res.statusCode === 1 && res.data) {
						this.resData = res.data;
						const intro = utils.html2Text(this.resData.intro);
						this.obj = {
							title: this.resData.title,
							summary: intro,
							imageUrl: this.resData.expert.titleUrl,
							href: this.id + '?path=/pages/details/book-detail&id=' + this.id,
							// businessId: this.id,
							type: 3 // 分享类型  0:资讯 1:专栏文章 2:信用百科 3:著作 6:专家 4:提问 5:回答 7:想法'
						};

						this.loading = false;
					} else {
                        uni.redirectTo({
                            url: '/pages/404'
                        });
					}
				})
			},
            getUserInfo(businessId) {
                // 点击关注的时候，储存点击状态和点击的id
                this.$store.dispatch('clickBtn')
                this.$store.dispatch('setId', businessId)
				utils.getUserInfo(true).then(user => {
					if (user.isLogin) {
						this.login = true;
						// 调接口
						Api_GetAttentionAdd({
							businessId: businessId,
							type: 0
						}).then(res => {
							if (res.statusCode === 1) {
								let tips = ''
								if (this.resData.expert.status) {
									tips = '关注成功'
								} else {
									tips = '取消关注成功'
								}
								uni.showToast({
									icon: 'none',
									title: tips,
									duration: 2000
								});
							} else if (res.statusCode === 2) {
								// 第一次关注
                                this.$refs.tip.show();
							} else if (res.statusCode === 403) {
								uni.showToast({
									icon: 'none',
									title: res.message,
									duration: 2000
								});
							} else {
								uni.showToast({
									icon: 'none',
									title: '关注失败',
									duration: 2000
								});
							}
						})
						// 接口成功后初始化store里的内容
						this.$store.dispatch('setId', '')
						this.$store.dispatch('clickBtn', false)
					} else {
						this.login = false;
						uni.showToast({
							icon: 'none',
							title: '请先登录',
							duration: 2000
						});
						setTimeout(function() {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}, 1000);
					}
				});
            }
		}
	}
</script>

<style scoped>
/* #ifndef APP-PLUS */
page {
	display: flex;
}
/* #endif */
view {
	display: flex;
	box-sizing: border-box;
}
.books {
	flex-direction: column;
}
.book-top {
	width: 750rpx;
	padding: 47rpx 20rpx;
	background-color: #fff;
	margin-bottom: 20rpx;
	justify-content: space-between;
	border-bottom-width: 20rpx;
	border-bottom-color: #f7f7f7;;
	border-bottom-style: solid;
}
.tt {
	font-size: 36rpx;
	color: #000;
}
.book-con {
	width: 750rpx;
	padding: 37rpx 20rpx;
}
.book-con {
	background-color: #ffffff;
}
.con {
	color: #787878;
}
.book-img {
	width: 175rpx;
	height: 235rpx;
	border-radius: 10rpx;
	margin-right: 30rpx;
}
.head-img {
	width: 50rpx;
	height: 50rpx;
	border-radius: 200rpx;
}
.zj-tt {
	margin-left: 18rpx;
	margin-right: 16rpx;
}
.zj-img {
	width: 36rpx;
	height: 36rpx;
}
.add-focus {
	width: 97rpx;
	height: 40rpx;
	line-height: 40rpx;
	border-radius: 10rpx;
	color: #ce0201;
	font-size: 24rpx;
	text-align: center;
	border-width: 2rpx;
	border-color: #ce0201;
	border-style: solid;
	margin-top: 30rpx;
}
.already,
.add-focus:active {
	background-color: #ce0201;
	color: #fff;
}
</style>
