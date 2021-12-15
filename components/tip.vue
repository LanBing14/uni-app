<template>
	<view>
		<!-- 第一次操作提示框 -->
		<view class="share" v-if="info.dialogVisible" :class="shareClass">
            <!-- click.stop阻止事件冒泡，防止弹出遮罩时点击列表页 -->
            <view class="mask" @click.stop=""></view>
			<view class="layer" :style="{top: newtop + 'rpx'}">
				<view class="title" v-if="info.type === 0">收藏成功</view>
				<view class="title" v-if="info.type === 1">关注问题成功</view>
				<view class="title" v-if="info.type === 2">关注专家成功</view>
				<view class="title" v-if="info.type === 3">发布问题成功</view>
				<view class="title" v-if="info.type === 4">发布想法成功</view>
				<view class="title2" v-if="info.type === 0">收藏成功，您可以在我的-我的收藏栏目中查看此资讯</view>
				<view class="title2" v-if="info.type === 1">关注成功，您可以在我的-我的关注中查看回答更新</view>
				<view class="title2" v-if="info.type === 2">关注成功，您可以在我的-我的关注中查看专家作品更新</view>
				<view class="title2" v-if="info.type === 3">发布成功，您可以在我的-我的创作中查看问题回答更新</view>
				<view class="title2" v-if="info.type === 4">发布成功，您可以在我的-我的创作中查看已发布的想法</view>
				<view class="list">
					<view class="box" >
						<swiper class="swiper-box " autoplay="true" interval="2000" duration="300" circular="true">
							<swiper-item v-if="info.type === 0">
								<view class="swiper-item"><image src="/static/img/tip/sccg.png" mode="aspectFill"></image></view>
							</swiper-item>
							<swiper-item  v-if="info.type === 1">
								<view class="swiper-item"><image src="/static/img/tip/wdgz.png" mode="aspectFill"></image></view>
							</swiper-item>
							<swiper-item  v-if="info.type === 1">
								<view class="swiper-item"><image src="/static/img/tip/gzwt.png" mode="aspectFill"></image></view>
							</swiper-item>
							<swiper-item  v-if="info.type === 2">
								<view class="swiper-item"><image src="/static/img/tip/wdgz.png" mode="aspectFill"></image></view>
							</swiper-item>
							<swiper-item  v-if="info.type === 2">
								<view class="swiper-item"><image src="/static/img/tip/gzzj.png" mode="aspectFill"></image></view>
							</swiper-item>
							<swiper-item  v-if="info.type === 3">
								<view class="swiper-item"><image src="/static/img/tip/wdcz.png" mode="aspectFill"></image></view>
							</swiper-item>
							<swiper-item  v-if="info.type === 3">
								<view class="swiper-item"><image src="/static/img/tip/fbtw.png" mode="aspectFill"></image></view>
							</swiper-item>
							<swiper-item  v-if="info.type === 4">
								<view class="swiper-item"><image src="/static/img/tip/wdcz.png" mode="aspectFill"></image></view>
							</swiper-item>
							<swiper-item  v-if="info.type === 4">
								<view class="swiper-item"><image src="/static/img/tip/fbxf.png" mode="aspectFill"></image></view>
							</swiper-item>
						</swiper>
					</view>
				</view>
				<view class="h1"  @tap="hideShare">我知道了</view>
			</view>

		</view>

	</view>
</template>

<script>
    import { Api_AddShare } from "@/api/share.js";
    import { Api_SaveScore } from "@/api/points.js";
    export default {
        props: {
            info: {
                type: Object,
                dialogVisible: Boolean,
                default: function(e) {
                    return {
                        type: 2, // 提示类型  0:收藏 1:关注问题 2:关注专家 3:发布问题 4:发表想法
                        dialogVisible: false
                    }
                }
            }
        },
        data() {
            return {
                shareClass: '',
                newtop: 0
            }
        },
        methods: {
            show(){


				let thiss = this;
                uni.getSystemInfo({
                    success: function (res) {
                        let top = (res.windowHeight - 338 ) - 44;
                        thiss.newtop = top;
                    }
                });

                this.info.dialogVisible = true;
            },
            hideShare(){
                this.$emit('click');
                this.info.dialogVisible = false;
            }
        }
    }
</script>

<style scoped lang="scss">
	.share{
		.mask{
			background-color: rgba(0,0,0,.5);
			position: fixed;
			width: 750rpx;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 4500;
		}
		.layer{
			width: 70%;
			position: fixed;
			z-index: 5000;
			left: 11%;
			padding: 0 4%;
			top: 170rpx;
			background-color: #ffffff;
			border-radius: 20rpx;
			.list{
				width: 100%;
				display: flex;
				padding:10rpx 0 30rpx 0;
				flex-wrap: wrap;
				.box{
					margin: 0 auto;
					width: 90%;
					height: 450rpx;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					.title{
						margin-top: 17rpx;
					}
				}
			}
			.h1{
				width: 100%;
				height: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				border-top: 2rpx solid #e3e3e3;
			}
		}
	}
	.swiper-box {
		width: 100%;
		height: 450rpx;
	}
	.swiper-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #fff;
		position: relative;
	}
	.title{
		margin-top: 20rpx;
		font-size:38rpx;
		text-align: center;
	}

	.title2{
		font-size:29rpx;
		line-height:1.5;
		text-align: center;
		color:#cdcdcd;
		width:90%;
		margin: 10rpx auto;
	}
</style>
