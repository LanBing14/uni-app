<template>
	<view>
		<view class="question-item">
			<view class="question-info-box">
				<text class="question-title">{{ detailItem.issue.issueTitle }}</text>
				<text :class="[!answerOpen?'question-desc':'question-desc-auto']">{{ detailItem.issue.issueDesc }}</text>
				<view class="question-open" v-if="openShow">
					<view class="open-btn" @click="openClick" >
						<view class="btn-icon">
							<image class="open-img" :class="[!answerOpen?'open-off':'open-on']" src="/static/img/open.png" mode=""></image>
						</view>
						<text class="open-text">{{ !answerOpen?'展开全部':'收起全部' }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- <view class="question-user">
			<view class="user-info pdT0">
				<image class="user-img" :src="defaultHeadImg(detailItem.issue.headPicUrl)" mode=""></image>
				<view class="user-desc">
					<view class="desc-top">
						<text class="user-name">{{ detailItem.issue.username }}</text>
					</view>
					<view class="desc-bottom">
						<view class="user-titp">
							<text class="user-time">{{ detailItem.issue.publishDate | dateFormat('yyyy-MM-dd') }}</text>
							<text class="user-tip">提出问题</text>
						</view>
					</view>
				</view>
			</view>
		</view> -->

		<view>
			<view class="question-user">
				<view class="user-info">
					<image class="user-img" :src="defaultHeadImg(detailItem.headPicUrl)" mode=""></image>
					<view class="user-desc">
						<view class="desc-top">
							<text class="user-name">{{ detailItem.username }}</text>
						</view>
						<view class="desc-bottom">
							<view class="user-titp">
								<text class="user-time">{{ detailItem.publishDate | dateFormat('yyyy-MM-dd') }}</text>
								<text class="user-tip">回答问题</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="question-answer pdT0">
				<text class="question-answer-text">{{ detailItem.answerContent }}</text>
			</view>
		</view>
		<share-box ref="change" :info="obj"></share-box>
		<tip-box ref="tip" :info="tipInfo"></tip-box>

		<!-- 评论 -->
		<view class="container" style="margin-top: 20rpx; border-top: 10px solid #f7f7f7;">
			<yd-comment :value="ydCommentObj" :shareInfo="obj"></yd-comment>
		</view>
	</view>
</template>

<script>
    import ShareBox from "@/components/share.nvue"
    import {
        Api_GetAnswer,
    } from '@/api/faq.js';
    import ydComment from '@/pages/yd-comment/comment.nvue';

    import {
        dateFormat
    } from '@/utils/index.js';
    export default {
        filters: {dateFormat},
        components: {
            ShareBox,
            ydComment
        },
        data() {
            return {
                tipInfo:{type: 1, dialogVisible: false},
                obj: {},
                businessId:'',
                answerOpen:false,
                openShow:false,
                detailItem:{issue:{}},
                answerContent:'',
                commentValue:'',
                commentOption: {
                    placeholder:'听君一席话，胜读十年书',
                    comment:true,
                    praise:true,
                    share:true,
                    // commentCount:99,
                    // likeCount:99
                },
                ydCommentObj: {
                    id: '',
                    userId: '',
                    type: 1
                }
            }
        },
        onLoad: function (option) {
            this.businessId = option.id;
            this.getIssueAnswer();
            this.ydCommentObj.id = this.businessId;
        },
        onNavigationBarButtonTap(e) {
            this.obj = {
                title: this.detailItem.issue.issueTitle,
                businessId: this.businessId,
                summary: this.detailItem.answerContent,
                href: '/pages/faq/faq/answer-detail&id=' + this.businessId,
                type: 5 // 分享类型  0:资讯 1:专栏文章 2:信用百科 3:著作 6:专家 4:提问 5:回答 7:想法'
            };
            this.$refs.change.share();
        },
        methods: {
            getIssueAnswer(){
                Api_GetAnswer({
                    id: this.businessId
                }).then(res=>{
                    if (res.statusCode === 1) {
                        this.detailItem = res.data;

                        // 评论传userId
                        this.ydCommentObj.userId = this.detailItem.userId;

                        this.openShow = (res.data.issueDesc.length > 200);
                    } else {
                        uni.redirectTo({
                            url: '/pages/404'
                        });
                    }
                })
            },
            defaultHeadImg(url){
                return url ?  url : '/static/img/demo1.png';
            },
            openClick() {
                this.answerOpen = !this.answerOpen;
            }
        }
    }
</script>

<style scoped>
	page {
		background-color: #ffffff;
	}
	.pdT0{
		padding-top: 0!important;
	}
	.top-share{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.share-img{
		width: 38rpx;
		height: 39rpx;
	}

	.question-item {
		position: relative;
		display: flex;
		flex: 1;
		padding: 20rpx 24rpx 0 20rpx;
	}

	.question-info-box {
		flex: 1;
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.question-title {
		font-size: 34rpx;
		color: #000000;
		margin-bottom: 20rpx;
	}

	.question-desc {
		flex: 1;
		lines: 2;
		font-size: 28rpx;
		color: #666666;
		overflow: hidden;
	}
	.question-desc-auto{
		flex: 1;
		font-size: 28rpx;
		color: #666666;
		overflow: hidden;
		height: auto;
	}

	.question-author {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.author-img {
		width: 40rpx;
		height: 40rpx;
		margin-right: 18rpx;
	}

	.author-name {
		color: #999999;
		font-size: 24rpx;
	}

	.question-open {
		flex: 1;
		display: flex;
		align-items: flex-end;
	}

	.open-btn{
		display: flex;
		flex-direction: row;
		background-color: #f7f7f7;
		padding: 8rpx 16rpx;
		border-radius: 8rpx;
	}
	.open-img{
		width: 26rpx;
		height: 27rpx;
		margin-right: 8rpx;
	}
	.open-text {
		font-size: 24rpx;
		color: #999999;
	}
	.open-off{
		transform: rotate(0deg);
	}
	.open-on{
		transform: rotate(180deg);
	}

	/*  */
	.question-user{
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
		padding:15rpx 20rpx;
	}
	.user-info{
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.user-img{
		width: 62rpx;
		height: 62rpx;
		margin-right: 15rpx;
		border-radius: 200rpx;
	}
	.user-desc{
		flex: 1;
		color: #999999;
		font-size: 24rpx;
		display: flex;
		align-items: stretch;
		flex-direction: column;
	}
	.desc-top{
		line-height: 1.4;
	}
	.desc-bottom{
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.user-name{
		color: #000000;
		font-size: 26rpx;
		lines: 1;
		text-overflow: ellipsis;
		width: 500rpx
	}
	.user-titp{
		flex: 1;
		flex-direction: row;
		align-items: center;
	}
	.user-time{
		color: #999999;
		font-size: 24rpx;
		margin-right: 12rpx;
	}
	.user-tip{
		color: #999999;
		font-size: 24rpx;
	}
	.user-right{
		text-align: right;
	}
	.right-tip{
		color: #666666;
		font-size: 24rpx;
	}

	/* 关注/写回答模块 */
	.question-tool{
		height: 74rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background-color: #fbfbfb;
		margin: 20rpx 0;
	}
	.tool-focus{
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.focus-img{
		width: 30rpx;
		height: 27rpx;
		margin-right: 14rpx;
	}
	.focus-text{
		color:#ce0201;
		font-size: 28rpx;
	}
	.tool-answer{
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.answer-img{
		width: 28rpx;
		height: 28rpx;
		margin-right: 14rpx;
	}
	.answer-text{
		color:#ce0201;
		font-size: 28rpx;
	}

	/*  */
	.question-answer{
		padding: 0 24rpx 20rpx 24rpx;
	}
	.question-answer-text{
		font-size: 30rpx;
		line-height: 40rpx;
		color: #262626;
	}

	.question-form{
		flex: 1;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
		flex-direction: column;
		height: 600rpx;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		background-color: #fff;
	}
	.form-tool{
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 25rpx 0 14rpx;
		margin: 0 24rpx;
		border-bottom-width: 1px;
		border-bottom-color: #dddddd;
		border-style: solid;
	}
	.tool-cancel{
		font-size: 30rpx;
		color: #999999;
	}
	.tool-publish{
		font-size: 30rpx;
		color: #333333;
	}
	.form-title{
		font-size: 30rpx;
	}
	.form-desc{
		font-size: 26rpx;
		margin: 20rpx 24rpx;
		width: calc( 100% - 48rpx )
	}
</style>
