<template>
	<view>
		<!-- 加载图标 -->
		<mix-loading v-if="loading"></mix-loading>
		
		<view v-if="!loading">
			<view class="baike-title">
				<text class="tt">{{detailData.title}}</text>
			</view>
			<view class="baike-con">
				<text class="explain">解释</text>
				<view style="margin-top: 20rpx;">
					<view class="con" v-if="detailData.text" v-html="detailData.text"></view>
					<uni-no-data v-if="!detailData.text"></uni-no-data>
				</view>
			</view>
		</view>
		
		<share-box ref='change' :info="obj"></share-box>
	</view>
</template>

<script>
	import {
		Api_GoDetail
	} from '@/api/news.js';
	
	export default {
		data() {
			return {
				detailData: [],
				id: "",
				obj: {},
				loading: true
			}
		},
		onLoad(options){
			this.id = options.id;
			
			this.loadDetail();
		},
		onNavigationBarButtonTap(e) {
			this.obj = {
				title: this.detailData.title,
				// businessId: this.id,
				summary: this.detailData.summary,
				href: this.id + '?path=/pages/details/baike-detail&id=' + this.id,
				type: 2 // 分享类型  0:资讯 1:专栏文章 2:信用百科 3:著作 6:专家 4:提问 5:回答 7:想法'
			};
			this.$refs.change.share();
		},
		methods: {
			loadDetail(){
				Api_GoDetail(this.id).then(res=>{
					if(res.statusCode === 1){
						this.detailData = res.data;
						this.loading = false;
						
						uni.setNavigationBarTitle({
							title: res.data.title
						})
					} else {
                        uni.redirectTo({
                            url: '/pages/404'
                        });
					}
				});
			},
		}
	}
</script>

<style scoped>
page {
	background-color: #f7f7f7;
}
.baike-title {
	padding: 47rpx 20rpx;
	background-color: #fff;
	margin-bottom: 20rpx;
	border-bottom-width: 20rpx;
	border-bottom-color: #f7f7f7;;
	border-bottom-style: solid;
}
.tt {
	font-size: 36rpx;
	color: #000;
}
.baike-con {
	padding: 37rpx 20rpx;
}
.explain {
	padding: 0 25rpx;
	background-color: #ce0201;
	color: #fff;
	height: 40rpx;
	line-height: 40rpx;
}
.baike-con {
	background-color: #ffffff;
}
.con {
	color: #555555;
}
</style>
