<template>
	<view class="no-data flex-col">
		<view style="margin-bottom: 30rpx;">
			<image src="/static/img/nodata.png" mode="aspectFill" class="no-data-img"></image>
		</view>
		<view class="text-box">
			<text class="no-data-txt">{{texts}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			texts: {
				type: String,
				default: function(){
					return "暂无数据"
				}
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.no-data {
		width: 750rpx;
		flex: 1;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
	.no-data-img {
		margin-top: 160rpx;
		width: 462rpx;
		height: 352rpx;
	}
	.no-data-txt {
		text-align: center;
		color: #999999;
		font-size: 28rpx;
	}
	.text-box {
		margin-bottom: 100rpx;
	}
</style>
