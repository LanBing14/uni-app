<template>
	<view>
		<view v-for="(item,index) in listItem" :key="index">
			<view v-if="item">
				<view class="list">
					<view @click="goDetail(item.issueId)">
						<text class="list-title">{{item.title}}</text>
						<view class="flex-row">
							<text class="list-desc">{{item.content}}</text>
						</view>
						<text class="info-text" style="padding-bottom: 20rpx;">{{item.publishDate | getLocalTime}}</text>
					</view>
					<view class="media-info flex-row" style="align-items: center;">
						<image src="/static/img/faq/ico1.png" class="imgIco" mode="aspectFill"></image>
						<text class="info-text" style="margin-right: 43rpx;">{{item.commentCount}}</text>
						<image src="/static/img/faq/ico2.png" class="imgIco" mode="aspectFill"></image>
						<text class="info-text">{{item.likeCount}}</text>
						<uni-icons type="trash" size="12" color="#999999" style="margin-left: 10px;" @click="delItem(item.id, index)"></uni-icons>
					</view>
				</view>
				<view class="space-line"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getLocalTime
	} from '@/common/js/util.js';
	import {
		Api_DelItem
	} from '@/api/faq.js'

	export default {
		props: {
			listItem: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		filters: {
			getLocalTime
		},
		methods: {
			delItem(id, index){
				let _this = this;
				uni.showModal({
				    title: '提示',
				    content: "确定永久删除吗？",
				    success: function(res) {
				        if (res.confirm) {
							Api_DelItem({id: id}, 'answer').then(res => {
								if(res.statusCode === 1) {
									_this.listItem = _this.listItem.splice(index, 1);
								}
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
							return
				        }
				    }
				});
				
			},
			click() {
				this.$emit('click');
			},
			close(e) {
				e.stopPropagation();
				this.$emit('close');
			},
			goDetail(id) {
				if (id) {
					uni.navigateTo({
						url: '/pages/faq/faq/detail?id=' + id
					});
				}
			}
		}
	}
</script>

<style scoped>
	.view {
		flex-direction: column;
	}

	.flex-col {
		flex-direction: column;
	}

	.flex-row {
		flex-direction: row;
	}

	.info-text {
		margin-right: 20rpx;
		color: #a3a3a3;
		font-size: 23rpx;
		line-height: normal;
	}

	.list {
		background-color: #ffffff;
		margin-bottom: 17rpx;
		padding: 30rpx 15rpx 15rpx 15rpx;
	}

	.list-title {
		font-size: 32rpx;
		line-height: 44rpx;
		color: #000;
		lines: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.list-desc {
		width: 730rpx;
		margin-top: 10rpx;
		padding-bottom: 20rpx;
		font-size: 26rpx;
		line-height: 38rpx;
		color: #787878;
		lines: 3;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.explain {
		margin-right: 13rpx;
		background-color: #ce0201;
		color: #FFFFFF;
		font-size: 20rpx;
		height: 30rpx;
		width: 60rpx;
		line-height: 30rpx;
		text-align: center;
		padding: 0 10rpx;
	}

	.imgIco {
		height: 24rpx;
		width: 26rpx;
		margin-right: 10rpx;
	}

	.space-line {
		background-color: #f7f7f7;
		height: 20rpx;
		width: 750rpx;
	}
</style>
