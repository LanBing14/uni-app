<template>
	<view class="idea-page">
		<!-- <uni-nav-bar class="nav-topbar" @clickLeft="backClick" :fixed="false" color="#ffffff" background-color="#d51e1e" statusBar="true" left-icon="arrowleft">
			<view class="top-share" slot="right"><image class="share-img" src="/static/img/share.png" mode=""></image></view>
		</uni-nav-bar> -->

		<detail-top class="detail-top" v-model="detailItem"></detail-top>

		<yd-comment v-if="showComment" :value="ydCommentObj"  :shareInfo="obj"></yd-comment>
		
		<share-box ref="change" :info="obj"></share-box>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import IdeaTab from './idea/idea-tab.nvue';
import CommentList from './idea/comment-list.vue';
import DetailTop from './idea/detail-top.vue';
import CommentTool from '@/pages/yd-comment-tool/comment-tool.nvue';
import YdComment from '@/pages/yd-comment/comment.nvue';
import {
	Api_GeIdea,
	Api_GetCommentSave,
	Api_GetLikeSave
} from '@/api/faq.js';
export default {
	components: {
		IdeaTab,
		CommentList,
		DetailTop,
		YdComment,
		CommentTool
	},
	data() {
		return {
			item:{},
			detailItem: {},
			showComment:false,
			businessId:'',
			preIndex: 0, // 前一个菜单下标
			navTop: null, // nav距离到顶部的距离 (如计算不准确,可直接写死某个值)
			isShowSticky: true, // 是否悬浮
			isComIdea:true,
			isLikeIdea:true,
			curComItem:{},
			commentValue:'',
			obj: {},
            ydCommentObj: {
                id: '',
                userId: '',
                type: 3
            },
		};
	},
	mounted() {},
	onLoad: function (option) {
		this.businessId = option.id;
        this.ydCommentObj.id = this.businessId;
		this.loadIdea();
	},
	onNavigationBarButtonTap(e) {
		this.$refs.change.share();
	},
	methods: {
		backClick() {
			uni.navigateBack({
				delta: 1
			});
		},
		loadIdea(){
			Api_GeIdea({
				id:this.businessId
			}).then(res=>{
				if(res.statusCode === 1){
					this.detailItem = res.data;
					// v-if延迟显示组件
					this.showComment = true;
					
					// 评论传userId
					this.ydCommentObj.userId = this.detailItem.userId;
					
					// 分享信息
					this.obj = {
						title: this.detailItem.ideaContent,
						// businessId: this.businessId,
						href: 'pages/faq/idea-detail&id=' + this.businessId,
						type: 7 // 分享类型  0:资讯 1:专栏文章 2:信用百科 3:著作 6:专家 4:提问 5:回答 7:想法'
					};
                } else {
                    uni.redirectTo({
                        url: '/pages/404'
                    });
                }
			})
		},
	}
};
</script>

<style scoped>
.idea-page {
	height: 100vh;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-start;
}
.top-share {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
}
.share-img {
	width: 38rpx;
	height: 39rpx;
}
.idea-comment{
	flex: 1;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-start;
}
.tab-box{
	flex: 1;
}
</style>
