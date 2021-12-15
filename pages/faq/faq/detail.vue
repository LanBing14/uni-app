<template>
	<view>
	    <view class="question-item">
			<view class="question-info-box">
				<text class="question-title">{{ detailItem.issueTitle }}</text>
				<text :class="[!answerOpen?'question-desc':'question-desc-auto']">{{ detailItem.issueDesc }}</text>
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

		<view class="question-user">
			<view class="user-info pdT0">
				<image class="user-img" :src="defaultHeadImg(detailItem.headPicUrl)" mode=""></image>
				<view class="user-desc">
					<view class="desc-top">
						<text class="user-name">{{ detailItem.username }}</text>

						<image src="@/static/img/ico-more.png" mode="aspectFill" class="ico-pb" @click="showUserMenu(detailItem, 'issue')"></image>
					</view>
					<view class="desc-bottom">
						<view class="user-titp">
							<text class="user-time">{{ detailItem.publishDate | dateFormat('yyyy-MM-dd') }}</text>
							<text class="user-tip">提出问题</text>
						</view>
						<view class="user-right" @click="allClick" v-if="answersCount > 0">
							<text class="right-tip">查看全部 {{ answersCount }} 个回答</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="question-tool">
			<view v-if="!detailItem.attentionStatus" class="tool-focus" @click="focusAdd">
				<image class="focus-img" src="/static/img/faq/focus.png" mode=""></image>
				<text class="focus-text">关注问题</text>
			</view>
			<view v-if="detailItem.attentionStatus" class="tool-focus" @click="focusCancel">
				<image class="focus-img" src="/static/img/faq/focus.png" mode=""></image>
				<text class="focus-text">已关注</text>
			</view>
			<view class="tool-answer" @click="answerClick">
				<image class="answer-img" src="/static/img/faq/answer.png" mode=""></image>
				<text class="answer-text">写回答</text>
			</view>
		</view>

		<view v-for="(item, index) in answers" :key="index" @click="commentPopup">
			<view v-if="index < 5" style="border-bottom: 10px solid #f7f7f7;">
				<view class="question-user">
					<view class="user-info">
						<image class="user-img" :src="defaultHeadImg(item.headPicUrl)" mode=""></image>
						<view class="user-desc">
							<view class="desc-top">
								<text class="user-name" @click="goDetail(item.id)">{{ item.username }}</text>
								<image src="@/static/img/ico-more.png" mode="aspectFill" class="ico-pb" @click="showUserMenu(item, 'answer')"></image>
							</view>
							<view class="desc-bottom"  @click="goDetail(item.id)">
								<view class="user-titp">
									<text class="user-time">{{ item.publishDate | dateFormat('yyyy-MM-dd') }}</text>
									<text class="user-tip">回答问题</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="question-answer pdT0"  @click="goDetail(item.id)">
					 <text class="question-answer-text">{{ item.content }}</text>
				</view>

				<view class="media-info">
					<text class="info-text">{{item.likeCount|| 0}} 赞同</text>
					<text class="info-text">·</text>
					<text class="info-text">{{item.commentCount|| 0}} 评论</text>
				</view>
			</view>

		</view>
		<share-box ref="change" :info="obj"></share-box>
		<tip-box ref="tip" :info="tipInfo"></tip-box>
		<eula-box ref='eula'></eula-box>

		<uni-popup class="idea-popup" ref="popup" maskClick  type="bottom">
			<view class="question-form">
				<view class="form-tool">
					<text class="tool-cancel" @click="cancekClick">取消</text>
					<text class="tool-publish" @click="publishClick">发布</text>
				</view>
				<form class="form-content">
					<view class="uni-form-item uni-column">
					    <textarea class="form-desc" height="50px" v-model="answerContent" row="10" maxlength="1000" placeholder-style="color:#b6b6b6" placeholder="有话要说,不吐不快"/>
					</view>
				</form>
			</view>
		</uni-popup>

		<uni-user-menu></uni-user-menu>
	</view>
</template>

<script>
	import ShareBox from "@/components/share.nvue"
	import {
		Api_GeIssue,
		Api_GetAttentionAdd,
		Api_GetIssueAnswer,
		Api_GetCommentSave,
		Api_GetLikeSave,
        Api_GetUserAnswerList
	} from '@/api/faq.js';
    import ydComment from '@/pages/yd-comment/comment.nvue';
	import {
		dateFormat, getUserInfo
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
				detailItem:{issueTitle:'', issueDesc: ''},
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
				answers:[],
				answersCount: 0,
                requestParams: { // 参数信息
                    currentPage: 1,
                    pageSize: 5,
					issueId: '',
					type: 1
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
			
			// 事件监听
			uni.$on('flushData', (flag) => {  
				if (flag) {
					this.getAnswers();
				}
			});
		},
		onUnload() {  
		    // 移除监听事件  
			uni.$off('flushData');
		},
		onNavigationBarButtonTap(e) {
			this.obj = {
				title: this.detailItem.issueTitle,
				businessId: this.businessId,
				summary: this.detailItem.issueDesc,
				href: '/pages/faq/faq/detail&id=' + this.businessId,
				type: 4 // 分享类型  0:资讯 1:专栏文章 2:信用百科 3:著作 6:专家 4:提问 5:回答 7:想法'
			};
			this.$refs.change.share();
		},
        onShow:function() {
            this.getIssue();
        },
		methods: {
			showUserMenu(item, linkType){
				this.$store.dispatch('saveUserMenu', true)
				this.$store.dispatch('saveBlackInfo', {
					name: item.name,
					userId: item.userId,
					id: item.id,
					type: linkType
				})
			},
			getIssue(){
				Api_GeIssue({
					id: this.businessId
				}).then(res=>{
                    if (res.statusCode === 1) {
						this.detailItem = res.data;
						this.openShow = (res.data.issueDesc && res.data.issueDesc.length > 200);
						this.getAnswers();
                    } else {
                        uni.redirectTo({
                            url: '/pages/404'
                        });
                    }
				})
			},
			getAnswers() {
			    this.requestParams.issueId = this.businessId;
                Api_GetUserAnswerList(this.requestParams).then(res => {
                    if (res.statusCode === 1) {
                        this.answers = res.data.data;
                        this.answersCount = res.data.totalRecordNumber;
                        if (this.answers && this.answers.length > 0) {
                            this.ydCommentObj.id = this.answers[0].id;
                            this.ydCommentObj.userId = this.answers[0].userId;
                        }
                    }
                }).catch(err => {
                });
			},
			defaultHeadImg(url){
				return url ?  url : '/static/img/demo1.png';
			},
			openClick() {
				this.answerOpen = !this.answerOpen;
			},
            goDetail(id) {
                uni.navigateTo({
                    url: '/pages/faq/faq/answer-detail?id=' + id
                });
            },
			focusAdd(){
				Api_GetAttentionAdd({
					businessId: this.businessId,
					type: 1
				}).then(res =>{
					if(res.statusCode === 2){
                        this.$refs.tip.show();
					}else{
						uni.showToast({
							icon:'none',
						    title: '关注成功',
						    duration: 2000
						});
					}
                    this.getIssue()
				})
			},
			focusCancel(){
				if (this.detailItem && this.detailItem.attentionStatus) {
					Api_GetAttentionAdd({
						businessId: this.businessId,
						type: 1
					}).then(res =>{
						uni.showToast({
							icon:'none',
							title: '取消关注成功',
							duration: 2000
						});
						this.getIssue()
					});
				}
			},
			answerClick(){
				getUserInfo(true).then(res => {
					if (res.isLogin && res.forbidden === true) {
						uni.showToast({
							icon:'none',
							title: '您已被禁言，禁言后您将不能再平台上做任何留言！',
							duration: 2000
						});
						return;
					}
					const platform = uni.getSystemInfoSync().platform;
					if (platform == 'ios' && !uni.getStorageSync('eula')) {
					    this.$refs.eula.showEula();
					} else {
					    this.commit();
					}
				});
			},
			commit() {
                this.$refs.popup.open();
			},
			cancekClick(){
				this.answerContent = '';
				this.$refs.popup.close();
			},
			publishClick(){
				const _self = this;
				if(!_self.answerContent){
					uni.showToast({
						icon:'none',
						title: '请输入回答内容',
						duration: 2000
					});
					return false;
				}
				Api_GetIssueAnswer({
				  answerContent:_self.answerContent,
				  issueId: _self.businessId,
				}).then(res =>{
                    if(res.statusCode === 1) {
                        _self.answerContent = '';
                        uni.showToast({
                            icon:'none',
                            title: '回答成功',
                            duration: 2000
                        });
                        _self.$refs.popup.close();
                        _self.getIssue()
                    }
				})
			},
			allClick(){
				if(this.answers.length > 0){
					uni.navigateTo({
						url: `/pages/faq/faq/detail-all?id=`+ this.businessId
					})
				} else {
					uni.showToast({
						icon:'none',
						title: '暂无更多回答',
						duration: 2000
					});
				}
			},
			commentPopup(){
				// this.$refs.commentpopup.open();
			},
			commentClick(){
				Api_GetCommentSave({
				  beUserId: this.detailItem.userId, //被回复人id（type=0需要填写）
				  businessId: this.businessId, //业务表主键(关联各业务表id)
				  businessType: 1, // 1:回答 2:文章 3:想法 ,
				  businessUserId: "string", //业务表创建的用户id（type = 1 的时候必填） ,
				  commentContent: this.commentValue, //评论内容
				  replyId: "string", // 回复表id(关联自身的id，针对评论回复的回复内容) ,
				  type: "string" //0：回复；1:评论
				}).then(res=>{
					if (res.statusCode === 3) {
						uni.showToast({
							icon:'none',
							title: res.message,
							duration: 2000
						});
					}
				})
			},
			praiseclick(){
				Api_GetLikeSave({
				  userId: this.detailItem.userId, //被回复人id（type=0需要填写）
				  businessId: this.businessId, //业务表主键(关联各业务表id)
				  businessType: 1, // 1:回答 2:文章 3:想法 ,
				}).then(res=>{

				})
			},
			shareclick(){
				console.log(this.commentValue)
			},
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
	width: 67rpx;
	height: 67rpx;
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
  overflow: hidden;
}
.ico-pb {
	float: right;
	line-height: normal;
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
	font-size: 30rpx;
	/* line-height: 1.5; */
	lines: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 500rpx;
	display: inline-block;
}
.user-titp{
	flex: 1;
	flex-direction: row;
	align-items: center;
	line-height: normal;
}
.user-time{
	color: #999999;
	margin-right: 12rpx;
	line-height: normal;
	font-size: 20rpx;
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
	padding: 0 20rpx;
	width: 710rpx;
}
.question-answer-text{
	font-size: 28rpx;
	line-height: 40rpx;
	color: #555555;
	display: -webkit-box;
	overflow: hidden;  
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
}
.idea-popup{
	/* #ifndef APP-PLUS */
	display: flex;
	/* #endif */
	flex: 1;
	z-index: 999999;
}
.question-form{
	flex: 1;
	/* #ifndef APP-PLUS */
	display: flex;
	/* #endif */
	flex-direction: column;
	height: 900rpx;
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
	border: 0;
	border-bottom-width: 1px;
	border-bottom-color: #dddddd;
	border-style: solid;
}
.tool-cancel{
	font-size: 30rpx;
	color: #999999;
}
.tool-publish{
	float: right;
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
.ico-pb {
	width: 35rpx;
	height: 35rpx;
}

/* 底部数据块 */
.media-info {
	padding: 0 20rpx;
	flex-direction: row;
	align-items: flex-end;
	margin-bottom: 16rpx;
}
.info-text {
	margin-right: 20rpx;
	color: #999999;
	font-size: 24rpx;
}

</style>
