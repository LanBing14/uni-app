<template>
	<view class="idea-page">
		<view class="idea-panel flex-col">
			<view class="panel-top">
				<image class="user-img" :src="userImgUrl(detailItem.headPicUrl)" mode=""></image>
				<view class="user-info">
					<text class="user-name">{{ detailItem.username }}</text>
					<text class="user-time">{{ detailItem.publish_date | dateFormat('yyyy-MM-dd')}}</text>
				</view>
				<view class="user-tool">
					<view class="tool-good" @click.stop="likeCommentClick()">
						<image class="good-img" src="/static/img/faq/ico2.png" mode=""></image>
						<text class="good-count">{{ detailItem.likeCount.count || 0 }}</text>
					</view>
					<view class="tool-comment">
						<image class="comment-img" src="/static/img/faq/ico1.png" mode=""></image>
						<text class="good-count">{{ detailItem.replyCount || 0 }}</text>
					</view>
				</view>
			</view>
			<view class="panel-content">
				<text class="content-title">
					{{ detailItem.comment_content }}
				</text>
			</view>
			<view class="panel-original">
				<!-- <text class="original-link">查看原文</text> -->
			</view>
		</view>
		<!-- <view class="comment-order" @click="ascClick">
			<image class="order-img" :class="{ 'order-img-asc':searchAsc}" src="/static/img/faq/time.png" mode=""></image>
			<text class="order-desc">按时间</text>
		</view> -->
		<view class="comment-list">
			<view v-for="(item, index) in dataList" :key="index" v-if="dataList.length > 0">
				<view class="idea-panel">
					<view class="panel-top">
						<image class="user-img" :src="userImgUrl(item.headPicUrl)" mode=""></image>
						<view class="user-info">
							<text class="user-name">{{ item.username }}</text>
							<text class="user-time">{{ item.publish_date | dateFormat('yyyy-MM-dd')}}</text>
						</view>
						<view class="user-tool" @click.stop="likeClick(item.user_id, item.id)">
							<view class="tool-good">
								<image class="good-img" src="/static/img/faq/ico2.png" mode=""></image>
								<text class="good-count">{{ item.likeCount.count || 0 }}</text>
							</view>
						</view>
					</view>
					<view class="panel-content comment-content pdT0">
						<text class="content-title" @click="setAtName(item.username)">
							{{ item.reply_content }}
						</text>
					</view>
				</view>
			</view>
			
			<uni-load-more class="loading-more-text" :status="status" :contentText="contentText" @clickLoadMore="clickLoadMore" v-if="!showNoData && !loading"></uni-load-more>

			<view class="no-data" v-if="showNoData && !loading">
				<uni-no-data texts="暂无回复"></uni-no-data>
			</view>
		</view>

		<comment-tool v-model="commentValue" @cclick="commentClick" :option="toolOption"></comment-tool>
	</view>
</template>

<script>
	import CommentTool from '@/pages/yd-comment-tool/comment-tool.nvue';
	import {
		Api_GetComment,
		Api_GetCommentSave,
		Api_GetLikeSave,
		Api_GetReplyPage
	} from '@/api/faq.js';
	import {
		dateFormat
	} from '@/utils/index.js'
	export default {
		filters: {
			dateFormat
		},
		components: {
			CommentTool,
		},
		data() {
			return {
				status: 'more',
				contentText: {
					contentdown: "—— 点击显示更多 ——",
					contentrefresh: "正在加载...",
					contentnomore: "—— 没有更多数据了 ——"
				},
				showNoData: false,
				dataList: [],
				currentPage: 0,
				totalPageNumber: 0,
				toolOption: {
					placeholder: '听君一席话，胜读十年书',
					like: true,
					commentCount: 0,
					likeCount: 0
				},
				item: {},
				detailItem: {
					likeCount: {
						count: 0,
						isLike: "0"
					}
				},
				businessId: '',
				isComIdea: true,
				isLikeIdea: true,
				curComItem: {},
				commentValue: '',
				searchAsc: true
			}
		},
		onLoad: function(option) {
			this.businessId = option.id;
			this.loadComment();
			this.loadListData();
		},
		watch:{
			currentPage: function(val) {
				return this.currentPage = val;
			},
			dataList: function(val) {
				return this.dataList = val;
			},
		},
		methods: {
			clickLoadMore() {
				// 判断是否加载更多
				if (this.status === 'more') {
					this.loadListData();
				}
			},
			setAtName(val) {
				this.commentValue = '@' + val + '：'
			},
			backClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			userImgUrl(url) {
				return url ? url : '/static/img/demo1.png';
			},
			loadComment() {
				Api_GetComment({
					id: this.businessId
				}).then(res => {
					if (res.statusCode === 1) {
						this.detailItem = res.data;
					}
				});
			},
			ascClick() {
				this.searchAsc = !this.searchAsc;
				this.loadListData();
			},
			loadListData(refresh) {
				this.loading = true;
				if (this.totalPageNumber == 0) {
					this.currentPage = 1;
				} else if (this.currentPage < this.totalPageNumber) {
					this.currentPage = this.currentPage + 1;
				}
				
				if (refresh) {
					this.currentPage = 1;
					this.dataList = [];
				}
				Api_GetReplyPage({
						businessId: this.businessId,
						currentPage: this.currentPage,
						pageSize: 10,
						asc: this.searchAsc
					}).then(curPageData => {
						let list = curPageData.data.data;
						if (this.currentPage === 1) {
							this.dataList = [];
						}
						if (this.currentPage == curPageData.data.totalPageNumber) {
							this.status = 'noMore';
						} else {
							this.status = 'more'
						}
						
						this.totalPageNumber = curPageData.data.totalPageNumber;
						this.dataList = this.dataList.concat(list);
						this.showNoData = !this.dataList.length;
						this.loading = false;
					})
					.catch(err => {
						console.log(err)
					});
			},
			commentClick() {
				const _self = this;
				if (this.commentValue === '') {
					uni.showToast({
						icon: 'none',
						title: '请输入评论内容',
						duration: 2000
					});
					return false;
				}
				
				Api_GetCommentSave({
					beUserId: _self.detailItem.user_id, //被回复人id（type=0需要填写） ,
					businessId: _self.detailItem.id, //业务表主键(关联各业务表id) ,
					businessType: 3,
					commentContent: _self.commentValue, //评论内容 ,
					type: 0, //0：回复；1:评论
				}).then(res => {
					if (res.statusCode === 1) {
						_self.commentValue = '';
						_self.loadListData();
					} else if (res.statusCode === 3) {
						uni.showToast({
							icon:'none',
							title: res.message,
							duration: 2000
						});
					}
				})
			},
			likeCommentClick() {
				Api_GetLikeSave({
					businessId: this.businessId,
					businessType: 0,
					userId: this.detailItem.user_id,
				}).then(res => {
					if (res.statusCode === 1) {
						if (res.data === 0) {
							// 取消点赞
							if (0 < this.detailItem.likeCount.count) {
								this.detailItem.likeCount.count--;
							}
							this.detailItem.likeCount.isLike = 0;
						} else {
							this.detailItem.likeCount.count++;
							this.detailItem.likeCount.isLike = 1;
						}
					}
				})
			},
			likeClick(userId, id) {
				Api_GetLikeSave({
					businessId: id,
					businessType: 0,
					userId: userId,
				}).then(res => {
					if (res.statusCode === 1) {
						this.loadListData();
					}
				})
			}
		},
	}
</script>

<style scoped>
	.pdT0 {
		padding-top: 0 !important;
	}

	.idea-page {
		height: 100%;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
	}

	.comment-list {
		padding-bottom: 98rpx;
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		border-top: 20rpx solid #f7f7f7;
	}

	.space-line {
		background-color: #f7f7f7;
		height: 20rpx;
		margin-top: 40rpx;
	}

	.top-share {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.panel-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		padding: 24rpx 20rpx 0 20rpx;
	}

	.user-info {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.user-img {
		width: 64rpx;
		height: 64rpx;
		margin-right: 16rpx;
		border-radius: 200rpx;
	}

	.user-name {
		color: #000000;
		line-height: 1.4;
		font-size: 26rpx;
		lines: 1;
		text-overflow: ellipsis;
		width: 500rpx;
		display: inline-block;
	}

	.user-time {
		color: #999999;
		font-size: 24rpx;
	}

	.share-img {
		width: 38rpx;
		height: 39rpx;
	}

	.user-tool {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}

	.tool-good,
	.tool-comment {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.good-img,
	.comment-img {
		width: 26rpx;
		height: 24rpx;
		margin-right: 10rpx;
		margin-left: 38rpx;
	}

	.good-count {
		font-size: 24rpx;
		color: #999999;
	}

	.panel-content {
		padding: 16rpx 20rpx 10rpx;
	}

	.content-title {
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

	.original-link {
		font-size: 26rpx;
		color: #262626;
		padding: 0 20rpx;
	}

	.comment-order {
		display: flex;
		margin-top: 20rpx;
		padding: 20rpx 20rpx;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		background-color: #f7f7f7;
		border-bottom-color: #e2e2e2;
		border-bottom-width: 1px;
	}

	.order-img {
		width: 23rpx;
		height: 23rpx;
		margin-right: 10rpx;
	}

	.order-img-asc {
		width: 23rpx;
		height: 23rpx;
		margin-right: 10rpx;
		transform: rotate(180deg);
	}

	.order-desc {
		font-size: 22rpx;
		color: #ce0201;
	}

	.comment-content {
		padding-left: 0;
		padding-bottom: 18rpx;
		margin-left: 100rpx;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #e2e2e2;
	}

	.panel-img-list {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.list-img {
		width: 243rpx;
		height: 162rpx;
	}

	.tab-box {
		flex: 1;
	}

	.no-data{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
		padding: 20rpx 0;
	}
	/deep/.mescroll-uni-fixed {
		position: static;
	}
</style>
