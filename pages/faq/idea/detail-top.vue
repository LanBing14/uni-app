<template>
	<view class="idea-panel">
		<view class="panel-top" style="justify-content: space-between;">
			<view class="flex flex-row">
				<image class="user-img" :src="headUrl(value.headPicUrl)" mode="aspectFill"></image>
				<view class="user-info">
					<text class="user-name">{{ value.username }}</text>
					<text class="user-time">{{ value.publishDate | dateFormat('yyyy-MM-dd hh:mm:ss') }}</text>
				</view>
			</view>

			<image src="@/static/img/ico-more.png" mode="aspectFill" class="ico-pb" @click="sendBlackInfo(value.username, value.userId)"></image>
		</view>
		<view class="panel-content">
			<text class="content-title">{{ value.ideaContent }}</text>
		</view>
		<view class="panel-img-list">
			<image class="list-img" v-for="(item,index) in value.imgList" :key="index" @click="previewImage(index)" :src="item" mode="aspectFill" :class="{ 'no-margin': !((index+1)%3) }"></image>
		</view>
		<view class="space-line"></view>

		<uni-user-menu></uni-user-menu>
	</view>
</template>

<script>
	import {dateFormat} from '@/utils/index.js'
	export default {
		name:'',
		props: {
		    value: Object,
			default:function(){
				return {}
			}
		},
		filters:{
			dateFormat
		},
		data() {
			return {}
		},
		mounted(){
			console.log(this.value)
		},
		methods: {
			sendBlackInfo(name, userId){
				this.$store.dispatch('saveUserMenu', true)
				this.$store.dispatch('saveBlackInfo', {name:name, userId: userId})
			},
			headUrl(url){
				return url ? url : '/static/img/demo1.png';
			},
			previewImage(idx) {
				uni.previewImage({
					current: idx,
					urls: this.value.imgList
				});
			},
		}
	}
</script>

<style scoped>
	.idea-panel{
		 background-color: #ffffff;
	}
	.space-line {
		background-color: #f7f7f7;
		height: 20rpx;
		margin-top: 40rpx;
	}
	.panel-top{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		padding: 24rpx 20rpx 0 20rpx;
	}
	.user-img{
		width: 64rpx;
		height: 64rpx;
		margin-right: 16rpx;
		border-radius: 200rpx;
	}
	.user-info{
		display: flex;
		flex-direction: column;
	}
	.user-name{
		color: #999999;
		line-height: 1.4;
		font-size: 26rpx;
		lines: 1;
		text-overflow: ellipsis;
		width: 500rpx;
	}
	.user-time{
		color: #999999;
		font-size: 24rpx;
	}
	.panel-content{
		padding: 16rpx 20rpx 10rpx;
	}
	.content-title{
		font-size: 26rpx;
		color: #262626;
	}
	.panel-img-list{
		margin-top: 20rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		align-items: flex-start;
	}
	.list-img{
		width: calc( ( 750rpx - 80rpx ) / 3 );
		height: 140rpx;
		margin-right: 10rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
	}
	.no-margin{
		margin-right: 0rpx;
	}

	.user-desc {
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
	}

	.ico-pb {
		width: 35rpx;
		height: 35rpx;
	}
</style>
