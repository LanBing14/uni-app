<template>
	<view class="content">
		<uni-swiper-dot :info="lists" :current="current" :mode="mode" :dots-styles="dotsStyles" field="content">
			<swiper class="swiper-box" @change="change" circular autoplay interval="3000" duration="3000">
				<swiper-item v-for="(item,index) in lists" :key="index">
					<view class="swiper-item" @click="goDetail(item.id)">
						<image class="banner-img" :src="(item.titleImg.length>0) ? (item.titleImg[0].domain + '/' + item.titleImg[0].url) : imgUrl" mode="aspectFill"></image>
					</view>
					<text class="title" @click="goDetail(item.id)">{{ item.title }}</text>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
	</view>
</template>

<script>
	import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue';

	export default {
		components: {
			uniSwiperDot
		},
		props: {
			lists: {
				type: Array,
				default: function(e){
					return []
				}
			}
		},
		data() {
			return {
				imgUrl: '/static/img/demo2.png',
				dotStyle: [{
						backgroundColor: 'rgba(255, 255, 255, 0.3)',
						border: '1px rgba(255, 255, 255, 0.3) solid',
						color: '#fff',
						selectedBackgroundColor: 'rgba(255, 255, 255, 0.9)',
						selectedBorder: '1px rgba(255, 255, 255, 0.9) solid'
					}
				],
				styleIndex: -1,
				current: 0,
				mode: 'default',
				dotsStyles: {
					backgroundColor: 'rgba(255, 255, 255, 0.3)',
					border: '1px rgba(255, 255, 255, 0.3) solid',
					color: '#fff',
					selectedBackgroundColor: 'rgba(255, 255, 255, 0.9)',
					selectedBorder: '1px rgba(255, 255, 255, 0.9) solid'
				}
			}
		},
		onLoad(options) {
			this.lists.length = 5;
		},
		methods: {
			goDetail(id){
				uni.navigateTo({
					url: '/pages/details/details?id=' + id
				});
			},
			change(e) {
				this.current = e.detail.current
			},
			selectStyle(index) {
				this.dotsStyles = this.dotStyle[index]
				this.styleIndex = index
			},
			selectMode(mode, index) {
				this.mode = mode
				this.modeIndex = index
				this.styleIndex = -1
				this.dotsStyles = this.dotStyle[0]
			}
		}
	}
</script>

<style scoped>
	.content {
		box-sizing: border-box;
		width: 750rpx;
		height: 340rpx;
		padding: 20rpx 30rpx 0 30rpx;
	}
	.swiper-box {
		height: 320rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}
	.swiper-item {
		width: 690rpx;
		height: 320rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}
	.banner-img {
		width: 690rpx;
		height: 320rpx;
	}
	.title {
		position: absolute;
		bottom: 40rpx;
		left: 20rpx;
		right: 20rpx;
		color: #fff;
		font-size: 36rpx;
		line-height: normal;
		lines: 1;
		text-overflow: ellipsis;
	}
</style>