<template>
	<view class="faq-page">
		<uni-list class="scroll-v list" enableBackToTop="true" scroll-y loadmoreoffset="500">
			<uni-refresh class="refresh" @refresh="onrefresh(index1)" @pullingdown="onpullingdown" :display="newsList[0].refreshing ? 'show' : 'hide'">
				<div class="refresh-view">
					<image class="refresh-icon" :src="refreshIcon" :style="{width: (newsList[0].refreshing || pulling) ? 0: '30px'}" :class="{'refresh-icon-active': newsList[0].refreshFlag}"></image>
					<loading-indicator class="loading-icon" animating="true" v-if="newsList[0].refreshing"></loading-indicator>
					<text class="loading-text">{{newsList[0].refreshText}}</text>
				</div>
			</uni-refresh>

			<!-- 资讯 -->
			<uni-cell class="tab-title" v-if="newsData.length > 0">
				<text class="title-text">资讯</text>
			</uni-cell>
			<uni-cell v-for="(ditem, dindex) in newsData" :key="dindex+'-news'" v-if="newsData.length > 0">
				<news-item v-model="newsData[dindex]"></news-item>
			</uni-cell>
			<uni-cell class="tab-more" v-if="newsData.length > 0">
				<text class="more-text" @click="moreClick(0)" >查看全部 </text>
				<image class="more-icon" src="../../static/img/more.png" mode=""></image>
			</uni-cell>
			<!-- 专家 -->
			<uni-cell class="tab-title" v-if="expertsData.length > 0">
				<text class="title-text">专家</text>
			</uni-cell>
			<uni-cell v-for="(ditem, dindex) in expertsData" :key="dindex+'-experts'" v-if="expertsData.length > 0">
				<experts-item v-model="expertsData[dindex]"></experts-item>
			</uni-cell>
			<uni-cell class="tab-more" v-if="expertsData.length > 0">
				<text class="more-text" @click="moreClick(1)" >查看全部 </text>
				<image class="more-icon" src="../../static/img/more.png" mode=""></image>
			</uni-cell>
			<!-- 文章 -->
			<uni-cell class="tab-title" v-if="articlesData.length > 0">
				<text class="title-text">文章</text>
			</uni-cell>
			<uni-cell v-for="(ditem, dindex) in articlesData" :key="dindex+'-articles'" v-if="articlesData.length > 0">
				<articles-item v-model="articlesData[dindex]"></articles-item>
			</uni-cell>
			<uni-cell class="tab-more" v-if="articlesData.length > 0">
				<text class="more-text" @click="moreClick(2)">查看全部 </text>
				<image class="more-icon" src="../../static/img/more.png" mode=""></image>
			</uni-cell>
			<!-- 问答 -->
			<uni-cell class="tab-title" v-if="faqData.length > 0">
				<text class="title-text">问答</text>
			</uni-cell>
			<uni-cell v-for="(ditem, dindex) in faqData" :key="dindex+'-faq'" v-if="faqData.length > 0">
				<faq-item v-model="faqData[dindex]"></faq-item>
			</uni-cell>
			<uni-cell class="tab-more" v-if="faqData.length > 0">
				<text class="more-text" @click="moreClick(3)" >查看全部 </text>
				<image class="more-icon" src="../../static/img/more.png" mode=""></image>
			</uni-cell>
			<!-- 词条 -->
			<uni-cell class="tab-title" v-if="entryData.length > 0">
				<text class="title-text">词条</text>
			</uni-cell>
			<uni-cell v-for="(ditem, dindex) in entryData" :key="dindex+'-entry'" v-if="entryData.length > 0">
				<entry-item v-model="entryData[dindex]"></entry-item>
			</uni-cell>
			<uni-cell class="tab-more" v-if="entryData.length > 0">
				<text class="more-text" @click="moreClick(4)" >查看全部 </text>
				<image class="more-icon" src="../../static/img/more.png" mode=""></image>
			</uni-cell>
	
			<!-- 暂无数据 -->
			<uni-cell v-if="showNoData">
				<view class="no-data">
					<view style="margin-bottom: 30rpx;">
						<image src="/static/img/nodata.png" mode="aspectFill" class="no-data-img"></image>
					</view>
					<text class="no-data-txt">没有找到" {{ keyword }} "相关内容</text>
					<text class="no-data-txt">请换个关键字试试</text>
				</view>
			</uni-cell>

			<uni-cell class="loading-more" v-if="newsList[0].isLoading || newsList[0].data.length > 10">
				<text class="loading-more-text">{{newsList[0].loadingText}}</text>
			</uni-cell>
		</uni-list>
	</view>
</template>
<script> 
	import uniList from '@/components/uni-list.vue';
	import uniCell from '@/components/uni-cell.vue';
	import uniRefresh from '@/components/uni-refresh.vue';
	import uniLoadMore from '@/components/uni-load-more.vue';
	
	import NewsItem from './searchitem/news-item.nvue';
	import ExpertsItem from './searchitem/experts-item.nvue';
	import ArticlesItem from './searchitem/articles-item.nvue';
	import FaqItem from './searchitem/faq-item.nvue';
	import EntryItem from './searchitem/entry-item.nvue';
	
	import { Api_GoDetail } from '@/api/topic.js';
	import { Api_GetSearchWithPage } from '@/api/search.js';

    // 缓存每页最多
    const MAX_CACHE_DATA = 100;
    // 缓存页签数量
    const MAX_CACHE_PAGE = 3;

    export default {
        components: {
			uniList,
			uniCell,
			uniRefresh,
			uniLoadMore,
			NewsItem,
			ExpertsItem,
			ArticlesItem,
			FaqItem,
			EntryItem,
        },
        data() {
            return {
				active: 0,
                newsList: [],
                cacheTab: [],
				newsData:[],
				expertsData:[],
				articlesData:[],
				faqData:[],
				entryData:[],
                tabIndex: 0,
                scrollInto: "",
                showTips: false,
                navigateFlag: false,
                pulling: false,
				showNoData:false,
                refreshIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg==",
			}
        },
        props: {
        	keyword: String,
        },
		mounted() {
			uni.setStorageSync('wd-un-flush', true);
			this.newsList.push({
				data: [],
				isLoading: true,
				refreshText: "",
				loadingText: '',
				requestParams: { // 参数信息
					type: 5,
					currentPage: 1,
					pageSize: 10
				},
				totalPageNumber: 0, // 总页数
				totalRecordNumber: 0, // 总数量
			});
            setTimeout(()=>{
				this.getList(this.tabIndex, true);
            }, 500);
		},
		onShow() {
			// 从积分任务跳转过来时的判断，勿删！！！
			if (uni.getStorageSync('tabBarIndex') || uni.getStorageSync('tabBarIndex') === 0) {
				if (this.tabIndex !== uni.getStorageSync('tabBarIndex')) {
					this.tabIndex = uni.getStorageSync('tabBarIndex');
				}
			}
			this.getList(this.tabIndex, uni.getStorageSync('wd-un-flush'));
		},
		onHide() {
			uni.removeStorageSync('tabBarIndex');
		},
		// watch: {
		// 	keyword(val) {
		// 		setTimeout(()=>{
		// 			this.getList(this.tabIndex, true);
		// 		}, 500);
		// 	},
		// },
        methods: {
			moreClick(i){
				this.$emit('moreclick',i);
			},
			searchRefish(){
				setTimeout(()=>{
					this.getList(this.tabIndex, true);
				}, 500);	
			},
		    getList(index, flush) {
				let _self = this;
				let activeTab = this.newsList[index];
				const promises = [0,1,2,3,4].map(function(type) {
					return promisify(loaddata)({
						type: type,
						_self: _self
					});
				});
				Promise.all(promises)
				.then(function(data) {
					_self.newsData = data[0];
					_self.expertsData = data[1];
					_self.articlesData = data[2];
					_self.faqData = data[3];
					_self.entryData = data[4];
					_self.showNoData = !(data[0].length + data[1].length + data[2].length + data[3].length +data[4].length);
				})
				.catch(function(res) {
				});
            },
            refreshData() {
				setTimeout(()=>{
					this.getList(this.tabIndex, true);
				}, 500);
			},
            onrefresh(e) {
                var tab = this.newsList[this.tabIndex];
                if (!tab.refreshFlag) {
                    return;
                }
                tab.refreshing = true;
                tab.refreshText = "正在刷新...";

                setTimeout(() => {
                    this.refreshData();
                    this.pulling = true;
                    tab.refreshing = false;
					tab.refreshFlag = false;
                    tab.refreshText = "已刷新";
                    setTimeout(() => { // TODO fix ios和Android 动画时间相反问题
                        this.pulling = false;
                    }, 500);
                }, 2000);
            },
            onpullingdown(e) {
                var tab = this.newsList[this.tabIndex];
                if (tab.refreshing || this.pulling) {
                    return;
                }
                if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
                    tab.refreshFlag = true;
                    tab.refreshText = "释放立即刷新";
                } else {
                    tab.refreshFlag = false;
                    tab.refreshText = "下拉可以刷新";
                }
            }
        }
    }
	
	const promisify = api => {
		return function(options, ...params) {
			return new Promise(function(resolve, reject) {
				api(
					Object.assign({}, options, {
						success: resolve,
						fail: reject
					}),
					...params
				);
			});
		};
	};
	const loaddata = function(options) {
		let _self = options._self,
			type = options.type,
			success = options.success,
			fail = options.fail;
		Api_GetSearchWithPage({
			type: type,
			keyword:_self.keyword,
			currentPage:1,
			pageSize:3,
		}).then(curPageData=>{
			if (success) {
				if(curPageData.data.data){
					success(curPageData.data.data);
				}else{
					success([]);
				}
			}
		}).catch((res)=>{
			if (fail) {
				fail(res);
			}
		})
	};
	
</script>

<style scoped>
    /* #ifndef APP-PLUS */
    page {
        width: 100%;
        min-height: 100%;
        display: flex;
    }

    /* #endif */

	.faq-page{
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: column;
	}

    .tabs {
        flex: 1;
        flex-direction: column;
        overflow: hidden;
        background-color: #ffffff;
        /* #ifdef MP-ALIPAY || MP-BAIDU */
        height: 100vh;
        /* #endif */
    }
	.tab-title {
		background-color: #f7f7f7;
		height: 74rpx;
		width: 750rpx;
		padding: 0 22rpx;
		flex-direction: row;
		align-items: center;
	}
	.title-text{
		font-size: 30rpx;
	}
	.tab-more{
		background-color: #fff;
		height: 74rpx;
		width: 750rpx;
		padding: 0 22rpx;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.more-text{
		color: #999;
		font-size: 28rpx;
	}
	.more-icon{
		width: 10rpx;
		height: 16rpx;
		margin-left: 10rpx;
	}
    .scroll-v {
        flex: 1;
        /* #ifndef MP-ALIPAY */
        flex-direction: column;
        /* #endif */
        width: 750rpx;
    }

    .refresh {
        width: 750rpx;
        height: 64px;
        justify-content: center;
    }

    .refresh-view {
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
    }

	.refresh-icon {
		width: 30px;
		height: 30px;
		transition-duration: .5s;
		transition-property: transform;
		transform: rotate(0deg);
		transform-origin: 15px 15px;
	}

	.refresh-icon-active {
		transform: rotate(180deg);
	}

	.loading-icon {
		width: 20px;
		height: 20px;
		margin-right: 5px;
		color: #999999;
	}

    .loading-text {
        margin-left: 2px;
        font-size: 16px;
        color: #999999;
    }

    .loading-more {
        align-items: center;
        justify-content: center;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center;
    }

    .loading-more-text {
        font-size: 28rpx;
        color: #999;
    }
	 
	.no-data {
		width: 750rpx;
		flex: 1;
		justify-content: center;
		align-items: center;
	}
	.no-data-img {
		margin-top: 40rpx;
		width: 462rpx;
		height: 352rpx;
	}
	.no-data-txt {
		text-align: center;
		color: #999999;
		font-size: 28rpx;
	}
</style>
