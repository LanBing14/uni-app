<template>
	<view>
		<!-- 0未关注 1已关注 -->
		<text @click="getUserInfo(businessId, type, btnStatus)" :class="{'add-focus': !btnStatus, 'cancel-focus': btnStatus}">{{(!btnStatus) ? '+关注' : '已关注'}}</text>
		<text class="atten-num" v-if="total != -1">{{total}}人关注他</text>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		Api_GetAttentionAdd
	} from "@/api/faq.js";
	import * as utils from "@/utils/index.js";
	export default {
		props: {
			focusStatus: {
				type: [Boolean, String],
				default: false
			},
			businessId: {
				type: [Number, String],
				default: 0
			},
			type: {
				type: [Number, String],
				default: 0 // 关注类型 0:专家 1:问题
			},
			total: {
				type: [Number, String],
				default: -1
			}
		},
		data() {
			return {
				login: false,
				uerInfo: {},
				btnStatus: this.focusStatus,
				test: false
			}
		},
		computed: {
			...mapGetters([
				'isClick',
				'focusId',
			])
		},
		created() {
			utils.getUserInfo(true).then(user => {
				if (user.isLogin) {
					this.login = true;
				} else {
					this.login = false;
				}
			});
		},
		watch: {
			login: function(val){
				return this.login = val
			},
			focusStatus: function(val){
			    console.log(val)
				return this.btnStatus = val
			},
			'focusId': function(val){
				if(val == this.businessId && this.login){
                    this.btnStatus = !this.btnStatus;
				}
			}			
		},
		destroyed() {
			this.$store.dispatch('setId', '')
			this.$store.dispatch('clickBtn', false)
		},
		methods: {
			getUserInfo(businessId, type, focusStatus) {
				// 点击关注的时候，储存点击状态和点击的id
				this.$store.dispatch('clickBtn')
				this.$store.dispatch('setId', businessId)

				if (this.focusId === businessId) {
					utils.getUserInfo(true).then(user => {
						if (user.isLogin) {
							this.login = true;							
							// 调接口
							Api_GetAttentionAdd({
								businessId: businessId,
								type: type
							}).then(res => {
								if (res.statusCode === 1) {
									let tips = ''
									if (this.btnStatus) {
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
									this.$parent.showTip();
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
	}
</script>

<style scoped>
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
	}

	.cancel-focus {
		width: 97rpx;
		height: 40rpx;
		line-height: 40rpx;
		border-radius: 10rpx;
		font-size: 24rpx;
		text-align: center;
		border-width: 2rpx;
		border-color: #ce0201;
		border-style: solid;
		background-color: #ce0201;
		color: #ffffff;
	}

	.atten-num {
		color: #ffffff;
		font-size: 24rpx;
		margin-top: 15rpx;
	}
</style>
