<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"><view class="top_view"></view></view>
		<!-- #endif -->
		<uni-nav-bar title="积分任务" @clickLeft="backClick" @clickRight="ruleClick" :fixed="true" statusBar="true" left-icon="arrowleft" color="#FFFFFF" background-color="#ff7d5b">
			<view slot="right">
				<text class="rule-text">积分规则</text>
			</view>
		</uni-nav-bar>
		<view class="top">
			<image class="bj" src="/static/img/ucenter/calendar/bg.png" mode=""></image>
			<view class="point-info">
				<text class="t1">可用积分</text>
				<text class="t2">{{ bonusScore }}</text>
			</view>
			<view class="btns" @click="goDetail('points-list')">积分明细<uni-icons type="arrowright" color="#ffffff"></uni-icons></view>
		</view>
		<view class="points">
			<view class="tasks">
				<text class="task-tt">每日任务</text>
				<view class="task-item">
					<image class="task-img" src="/static/img/ucenter/points/ico1.png" mode="aspectFit"></image>
					<view class="task-info">
						<text class="task-tt1">每日签到</text>
						<text class="task-desc">签到得积分，连续签到享积分加成</text>
						<text class="task-score">最多得7积分</text>
					</view>
					<view v-if="!checkInFlag" class="task-btn task-btn-undo" @click="goDetail('../calendar/calendar')">去签到</view>
					<view v-if="checkInFlag" class="task-btn task-btn-do">已完成</view>
				</view>
				<view class="task-item">
					<image class="task-img" src="/static/img/ucenter/points/ico3.png" mode="aspectFit"></image>
					<view class="task-info">
						<text class="task-tt1">回答问题</text>
						<text class="task-desc">回答一个问题，可获得5积分</text>
						<text class="task-score">最多得25积分</text>
					</view>
					<view v-if="!answerFlag" class="task-btn task-btn-undo" @click="switchTab('/pages/faq/index', 0)">去回答</view>
					<view v-if="answerFlag" class="task-btn task-btn-do">已完成</view>
				</view>
				<view class="task-item">
					<image class="task-img" src="/static/img/ucenter/points/ico2.png" mode="aspectFit"></image>
					<view class="task-info">
						<text class="task-tt1">发表想法</text>
						<text class="task-desc">第一次发表想法，可获得6积分</text>
						<text class="task-desc">第二次及以后获得2积分</text>
					</view>
					<view class="task-btn task-btn-undo" @click="switchTab('/pages/faq/index', 2)">去发表</view>
				</view>
				<view class="task-item" v-if="!attentionFlag">
					<image class="task-img" src="/static/img/ucenter/points/ico2.png" mode="aspectFit"></image>
					<view class="task-info">
						<text class="task-tt1">关注专家</text>
						<text class="task-desc">关注一个专家，可获得2积分</text>
						<text class="task-score">最多得20积分</text>
					</view>
					<view class="task-btn task-btn-undo" @click="switchTab('../../topic/topic', 0)">去关注</view>
				</view>
				<view class="task-item" v-if="!attentionIssue">
					<image class="task-img" src="/static/img/ucenter/points/ico2.png" mode="aspectFit"></image>
					<view class="task-info">
						<text class="task-tt1">关注问题</text>
						<text class="task-desc">关注一个问题，可获得2积分</text>
						<text class="task-score">最多得20积分</text>
					</view>
					<view class="task-btn task-btn-undo" @click="switchTab('/pages/faq/index', 0)">去关注</view>
				</view>
				<view class="task-item">
					<image class="task-img" src="/static/img/ucenter/points/ico2.png" mode="aspectFit"></image>
					<view class="task-info">
						<text class="task-tt1">评论</text>
						<text class="task-desc">评论一次可得2积分</text>
						<text class="task-score">最多得10积分</text>
					</view>
					<view v-if="!commentFlag" class="task-btn task-btn-undo" @click="switchTab('../../news/index', 0)">去评论</view>
					<view v-if="commentFlag" class="task-btn task-btn-do">已完成</view>
				</view>
				<view class="task-item">
					<image class="task-img" src="/static/img/ucenter/points/ico2.png" mode="aspectFit"></image>
					<view class="task-info">
						<text class="task-tt1">邀请朋友</text>
						<text class="task-desc">邀请一个朋友，可获得100积分 上不封顶~</text>
						<!-- <text class="task-score">最多得10积分</text> -->
					</view>
					<view class="task-btn task-btn-undo" @click="goDetail('../invite-friend/invite-friend')">去邀请</view>
				</view>
			</view>
			<view class="task-tips">更多任务即将开启，敬请期待</view>
		</view>
	</view>
</template>

<script>
	import { Api_GetBonusScore, Api_GetCheckInStatus, Api_IsFinished } from "@/api/points.js";
	import store from "@/store";
	export default {
	    data() {
	        return {
				bonusScore: 0, // 可用积分
				checkInFlag: false, // 是否已签到
				answerFlag: false, // 是否已回答
				attentionFlag: false, // 是否已关注专家
				attentionIssue: false, // 是否已关注问题
				commentFlag: false, // 是否已评论
			};
	    },
		// onNavigationBarButtonTap(e) {
		// 	console.log(e)        
		// 	console.log("跳转积分规则")       
		// 	uni.navigateTo({
		// 		url: 'points-rule'
		// 	});
		// },
		async onLoad() {
			this.getBonusScore();
			this.getCheckInStatus();
			this.isFinished('3');
			this.isFinished('6');
			this.isFinished('9');
			this.isFinished('12');
		},
	    methods: {
			backClick(){
				uni.navigateBack({
				    delta: 1
				});
			},
			ruleClick(){
				uni.navigateTo({
					url: 'points-rule'
				});
			},
	        change(e) {
	            console.log(e);
	        },
			goDetail(link) {
				uni.navigateTo({
					url: link
				});
			},
			switchTab(link, index) {
				if (index || index === 0) {
					// 塞缓存
					uni.setStorageSync('tabBarIndex', index);
				}
				uni.switchTab({
					url: link
				});
			},
			// 获取可用积分
			getBonusScore() {
				Api_GetBonusScore({}).then(res => {
					if (res.statusCode == '1') {
						this.bonusScore = res.data;
					}
				});
			},
			// 今日是否已签到
			getCheckInStatus() {
				Api_GetCheckInStatus().then(res => {
					if (res.statusCode == '1') {
						this.checkInFlag = res.data.checkStats;
					}
				});
			},
			// 回答问题、关注、评论等积分是否达到上限
			isFinished(type) {
				Api_IsFinished({type: type}).then(res => {
					if (res.statusCode == '1') {
						if (type == '3') {
							this.commentFlag = res.data;
						} else if (type == '6') {
							this.answerFlag = res.data;
						} else if (type == '9') {
							this.attentionFlag = res.data;
						} else if (type == '12') {
							this.attentionIssue = res.data;
						}
					}
				});
			},
	    }
	};
</script>

<style scoped>
.points {
	align-items: center;
	background-color: #f7f7f7;
	height: 100%;
}
.top {
	position: fixed;
	width: 750rpx;
	height: 240rpx;
	z-index: 998;
}
.bj {
	width: 750rpx;
	height: 240rpx;
}
.point-info {
	position: absolute;
	left: 0;
	top: 80rpx;
	right: 0;
	bottom: 0;
	text-align: center;
	justify-content: center;
	align-items: center;
	color: #fff;
	display: flex;
	flex-direction: column;
}
.t1 {
	font-size: 28rpx;
	text-align: center;
}
.t2 {
	font-size: 64rpx;
	text-align: center;
}
.tasks {
	background-color: #fff;
	border-top-left-radius: 30rpx;
	border-top-right-radius: 30rpx;
	padding: 30rpx;
	margin-top: 250rpx;;
	position: relative;
	z-index: 997;
}
.task-tt {
	color: #000;
	font-size: 36rpx;
}
.task-tips {
	width: 750rpx;
	color: #bebebe;
	text-align: center;
}
.btns {
	position: absolute;
	right: 0;
	bottom: 130rpx;
	color: #fff;
	background-color: rgba(255,255,255,.3);
	border-top-left-radius: 30rpx;
	border-bottom-left-radius: 30rpx;
	width: 170rpx;
	text-align: right;
}
.task-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid #e9e9e9;
	padding: 20rpx 0;
	height: 185rpx;
}
.task-img {
	width: 80rpx;
	height: 80rpx;
	margin-right: 30rpx;
}
.task-tt {
	font-size: 30rpx;
}
.task-info {
	display: flex;
	flex-direction: column;
	text-align: left;
	width: 400rpx;
}
.task-desc {
	font-size: 24rpx;
	color: #999999;
}
.task-score {
	padding-left: 30rpx;
	background: url(/static/img/ucenter/points/king.png) no-repeat left center;
	background-size: 26rpx;
	font-size: 24rpx;
	color: #999999;
}
.task-btn {
	width: 130rpx;
	text-align: center;
	border-radius: 30rpx;
	font-size: 24rpx;
}
.task-btn.task-btn-do {
	border: 2rpx solid #c5c5c5;
	color: #fff;
	background-color: #c5c5c5;
}
.task-btn.task-btn-undo {
	border: 2rpx solid #ce0201;
	color: #ce0201;
	background-color: #fff;
}
.task-btn.task-btn-undo:active {
	color: #fff;
	background-color: #ce0201;
}
</style>
