<template>
	<view class="user-menu" v-if="isShow">
		<view class="mask" @click="hideMask"></view>
		<view class="layer">
			<view class="btns btn-black" v-if="blackInfo.userId === userId" @click="delItem">
			    <uni-icons type="trash" size="20" color="#ce0100"></uni-icons>
			    <view class="btn-info">
			        <view>
			            <text class="btn-tt">删除内容</text>
			        </view>
			        <view>
			            <text class="btn-desc">永久删除</text>
			        </view>
			    </view>
			</view>
			<hr class="hr" v-if="blackInfo.userId === userId">
            <view class="btns btn-black" @click="changeBlackStatus">
                <uni-icons type="eye-slash" size="20" color="#ce0100"></uni-icons>
                <view class="btn-info">
                    <view>
                        <text class="btn-tt">{{blackStatus?'取消屏蔽':'屏蔽'}}该作者</text>
                    </view>
                    <view>
                        <text class="btn-desc">「{{blackInfo.name?blackInfo.name:'用户名'}}」</text>
                    </view>
                </view>
            </view>
            <hr class="hr">
            <view class="btns btn-jb" @click="goPolice">
                <uni-icons type="info" size="20" color="#ce0100"></uni-icons>
                <view class="btn-info">
                    <view>
                        <text class="btn-tt">举报内容</text>
                    </view>
                    <view>
                        <text class="btn-desc">内容令人不适，搬运抄袭，广告内容</text>
                    </view>
                </view>
            </view>
        </view>
	</view>
</template>

<script>
	import {
		mapGetters
    } from 'vuex';

	import {
		Api_GetBlackStatus,
		Api_Pullblack,
		Api_DelItem
	} from '@/api/faq.js'

	export default {
		name: "UniUserMenu",
        computed: {
			...mapGetters([
				'isShowUserMenu',
				'blackInfo'
			])
		},
		watch: {
			'isShowUserMenu': function(val){
				this.isShow = val;
				if(val){
					this.getBlackStatus()
				}
			},
			blackStatus: function(val){
				this.blackStatus = val;
			},
			isShow: function(val){
				if(val){
					uni.hideTabBar();
				} else {
					uni.showTabBar();
				}
			}
		},
		data() {
			return {
				isShow: false,
				blackStatus: false,
				userId: ''
			};
        },
		mounted() {
			this.userId = uni.getStorageSync('userInfo').userId;
		},
		methods: {
			delItem(){
				this.hideMask();
				let _this = this;
				uni.showModal({
				    title: '提示',
				    content: "确定永久删除吗？",
				    success: function(res) {
				        if (res.confirm) {
							Api_DelItem({id: _this.blackInfo.id}, _this.blackInfo.type).then(res => {
								if(res.statusCode === 1) {
									// 触发事件
									uni.$emit('flushData', true);
									
									uni.showToast({
										icon:'none',
										title: '删除成功',
										duration: 2000
									});
								}
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
							return
				        }
				    }
				});
				
			},
			goPolice(){
				uni.showToast({
					icon:'none',
					title: '举报成功，平台会在24小时之内处理',
					duration: 2000
				});
				this.hideMask();
			},
			changeBlackStatus(){
				Api_Pullblack({
					userId: this.blackInfo.userId
				}).then(res=>{
					if(res.success){
						if(res.statusCode === 1) {
							this.blackStatus = true;
							uni.showToast({
								icon:'none',
								title: '操作成功',
								duration: 2000
							});
							this.hideMask();
						} else if (res.statusCode === 2){
							uni.showToast({
								icon:'none',
								title: '不能屏蔽自己',
								duration: 2000
							});
							this.hideMask();
						} else {
							uni.showToast({
								icon:'none',
								title: '操作失败',
								duration: 2000
							});
							this.hideMask();
						}
					}
				})
			},
            getBlackStatus(){
                Api_GetBlackStatus({
                    userId: this.blackInfo.userId
                }).then(res=>{
					this.blackStatus = res.data.status;
                })
            },
			hideMask(){
				this.$store.dispatch('saveUserMenu', false);
			}
		},
	};
</script>

<style scoped>
	.mask {
		background-color: rgba(0, 0, 0, 0.5);
		position: fixed;
		width: 750rpx;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 4500;
	}

	.layer {
        box-sizing: border-box;
		width: 750rpx;
		/* height: 320rpx; */
		position: fixed;
		bottom: 0;
		z-index: 5000;
		background-color: #ffffff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		flex-direction: column;
		overflow: hidden;
        padding: 30rpx;
	}
    .hr {
        height:1px;
        border:none;
        border-bottom-width: 1rpx;
		border-bottom-style: solid;
		border-bottom-color: #e8e8e8;
        margin: 30rpx 0;
    }
    .btns {
        display: flex;
        flex-direction: row;
        height: 90rpx;
        line-height: 90rpx;
    }
    .btn-info {
        margin-left: 30rpx;
    }
    .btn-tt {
        color: #000000;
        font-size: 32rpx;
    }
    .btn-desc {
        color: #545454;
        font-size: 28rpx;
        line-height: 30px;
    }
</style>
