<template>
	<mescroll-uni ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
		<uni-cell v-for="(item, index) in dataList" :key="index" v-if="dataList.length > 0">
			 <comment-item @coclick="commentClick" v-model="dataList[index]"></comment-item>
		</uni-cell>

		<view class="no-data" v-if="showNoData">
			<text>暂无评论</text>
		</view>
	</mescroll-uni>
</template>

<script>
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
import MescrollMoreItemMixin from '@/components/mescroll-uni/mixins/mescroll-more-item.js';
import uniCell from '@/components/uni-cell.vue';
import CommentItem from './comment-item.nvue';
import { 
	Api_GetCommentPage,
} from '@/api/faq.js';
export default {
	mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
	components: {
		uniCell,
		CommentItem
	},
	data() {
		return {
			downOption: {
				auto: true,
				textInOffset: '下拉刷新',
				textOutOffset: '释放更新',
				textLoading: '加载中 ...'
			},
			upOption: {
				auto: true,
				textLoading: '加载中 ...',
				textNoMore: '-- 没数据了 --',
				toTop: {
					src: "/static/img/search/top.png", // 图片路径
					width: '95rpx',
				},
				page: {
					num: 0, 
					size: 10
				},
				empty: { use: false }
			},
			showNoData: false,
			dataList: [],
			currentPage: 1,
			totalPageNumber: 0,
		};
	},
	props: {
		value: {
			type: Object,
			default:function(){
				return {}
			}
		}
	},
	mounted(){
		this.loadListData();
	},
	methods: {
		userImgUrl(url){
			return url ? url : '/static/img/demo1.png';
		},
		loadListData() {
			// uni.showLoading();
			Api_GetCommentPage({
				businessId:this.value.id,
				currentPage: this.currentPage,
				pageSize: 10
			}).then(curPageData => {
				let list = curPageData.data.data;
				// uni.hideLoading();
				if (this.currentPage === 1) {
					this.dataList = [];
				} 
		
				// this.totalPageNumber = curPageData.totalPageNumber;
				this.dataList = this.dataList.concat(list);
				
				this.showNoData = !this.dataList.length;
				// 数据渲染完毕再隐藏加载状态
				this.$nextTick(() => {
					this.mescroll.endSuccess(list.length);
				});
			})
			.catch(() => {
				uni.hideLoading();
				this.mescroll.endErr();
			});
		},
		/*下拉刷新的回调 */
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		/*上拉加载的回调 */
		upCallback(page) {
			this.currentPage = page.num
			this.loadListData();
		},
		commentClick(item){
			this.$emit('coclick',item);
		},
	}
};
</script>
<style scoped>
	.no-data{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
	}
</style>

