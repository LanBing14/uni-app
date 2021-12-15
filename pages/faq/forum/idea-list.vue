<template>
	<view class="idea-panel">
		<view class="panel-top" @click="ItemClick">
			<image class="user-img" :src="headUrl(value.headPicUrl)" mode=""></image>
			<view class="user-desc">
				<text class="user-name">{{ value.username }}</text>
				<image src="@/static/img/ico-more.png" mode="aspectFill" class="ico-pb" @click="sendBlackInfo(value.username, value.userId)"></image>
			</view>
		</view>
		<view class="panel-content" @click="ItemClick">
			<text class="content-title">{{ value.ideaContent }}</text>
		</view>
		<view class="panel-img-list">
			<image class="list-img" v-for="(item,index) in value.imgList" :key="index" @click="previewImage(index)" :src="item" mode="" :class="{ 'no-margin': !((index+1)%3) }"></image>
		</view>
		<view class="user-tool">
			<view class="tool-time">
				<text class="praise-count">{{ value.publishDate | dateFormat('yyyy-MM-dd hh:mm:ss') }}</text>
			</view>
			<view class="tool-comment">
				<image class="comment-img" src="/static/img/faq/ico1.png" mode=""></image>
				<text class="good-count">{{ value.commentCount || 0}}</text>
			</view>
			<view class="tool-good">
				<image class="good-img" src="/static/img/faq/ico2.png" mode=""></image>
				<text class="good-count">{{ value.likeCount || 0}}</text>
			</view>
		</view>
		<view class="space-line"></view>
	</view>
</template>

<script>
	import {dateFormat} from '@/utils/index.js'
	export default {
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
			return {
			}
		},
		mounted(){
		},
		methods: {
			sendBlackInfo(name, userId){
				this.$store.dispatch('saveUserMenu', true)
				this.$store.dispatch('saveBlackInfo', {name:name, userId: userId})
			},
			headUrl(url){
				return url ? url : '/static/img/demo1.png';
			},
			ItemClick() {
				uni.navigateTo({
					url: '/pages/faq/idea-detail?id=' + this.value.id
				})
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
	}
	.panel-top{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		padding: 24rpx 20rpx 0 20rpx;
	}
	.user-img{
		width: 45rpx;
		height: 45rpx;
		margin-right: 16rpx;
		border-radius: 200rpx;
	}
	.user-name{
		color: #999999;
		line-height: 1.4;
		font-size: 26rpx;
		lines: 1;
		text-overflow: ellipsis;
		width: 500rpx;
	}
	.panel-content{
		padding: 16rpx 20rpx 10rpx;
	}
	.content-title{
		font-size: 26rpx;
		color: #262626;
		overflow: hidden;
		text-overflow: -o-ellipsis-lastline;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.panel-img-list{
		margin-top: 20rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}
	.list-img{
		width: 223rpx;
		height: 140rpx;
		margin-right: 20rpx;
	}
	.no-margin{
		margin-right: 0rpx;
	}
	.idea-comment{
		display: flex;
		flex-direction: column;
		flex: 1;
		align-items: stretch;
		justify-content: flex-start;
	}
	.user-tool {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		padding: 20rpx;
	}
	.tool-praise,
	.tool-comment,
	.tool-time{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.tool-time{
		flex: 1;
	}

	.praise-img,
	.good-img,
	.comment-img {
		width: 26rpx;
		height: 24rpx;
		margin-right: 10rpx;
		margin-left: 38rpx;
	}
	.praise-count {
		font-size: 24rpx;
		color: #999999;
	}
	.good-count{
		font-size: 24rpx;
		color: #999999;
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
