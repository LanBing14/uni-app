<template>
	<view class="content">
		<uni-swiper-dot :info="info" :mode="mode" :current="current" :dots-styles="dotsStyles" field="content">
			<swiper class="swiper-box" @change="change">
				<swiper-item v-for="(item, index) in info" :key="index">
					<view class="swiper-item">
						<image @click="item.link?goDetail(item.link): ''" class="image" :src="item.url" mode="aspectFit" />
					</view>
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
		data() {
			return {
				info: [{
						url: '/static/img/welcome1.jpg',
						link: ''
					},
					{
						url: '/static/img/welcome2.jpg',
						link: ''
					},
					{
						url: '/static/img/welcome3.jpg',
						link: ''
					},
					{
						url: '/static/img/welcome4.jpg',
						link: 'news/index'
					}
				],
				mode: 'default',
				dotsStyles: {
					backgroundColor: '#d5d5d5',
					border: '1px #d5d5d5 solid',
					color: '#fff',
					selectedBackgroundColor: '#ce0201',
					selectedBorder: '1px #ce0201 solid',
					bottom: '30',
					width: '14'
				},
				current: 0,
			}
		},
		methods: {
			change(e) {
				this.current = e.detail.current;
			},
			goDetail(link) {
				uni.switchTab({
					url: link
				});
			}
		}
	}
</script>

<style>
	/* 头条小程序组件内不能引入字体 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url('~@/static/fonts/uni.ttf') format('truetype');
	}

	/* #endif */

	/* #ifndef APP-NVUE */
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		min-height: 100%;
		height: auto;
	}

	view {
		font-size: 14px;
		line-height: inherit;
	}
	/* #endif */

	.swiper-box {
		/* height: 600px; */
		height: 100vh;	
	}

	.swiper-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #ffffff;
		color: #fff;
		height: 100%;
	}

	.image {
		width: 710rpx;
		height: 100%;
	}
	
	.uni-swiper__dots-item {
		border-radius: 10rpx;
	}
</style>