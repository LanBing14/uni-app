<template>
	<view class="comment-tool">
		<input class="tool-input" type="text" v-model="model" :maxlength="option.maxlength" :placeholder="option.placeholder" placeholder-class="tool-placeholder" />
		<view class="comment-panel" v-show="option.comment">
			<image @click="commentClick" class="tool-comment" src="/static/img/comment/comment.png" mode=""></image>
			<text class="comment-tip" v-show="option.commentCount">{{ option.commentCount }}</text>
		</view>
		<view class="praise-panel" v-show="option.praise">
			<image @click="praiseClick" class="tool-praise" src="/static/img/comment/praise.png" mode=""></image>
			<text class="comment-tip" v-show="option.likeCount">{{ option.likeCount }}</text>
		</view>
		<view class="collection-panel" v-show="option.collection">
			<image @click="collectionClick" class="tool-collection" src="/static/img/comment/collection.png" mode=""></image>
		</view>
		<view class="share-panel" v-show="option.share">
			<image @click="shareClick" class="tool-share" src="/static/img/comment/share.png" mode=""></image>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		option: {
			type: Object,
			default: function(e) {
				return {
					placeholder: '有话要说,不吐不快',
					comment:false,
					praise:false,
					collection:false,
					share:false,
					maxlength: 120,
					commentCount: 0,
					likeCount: 0
				};
			}
		},
		value: {
			type: String,
			default: '',
	    }
	},
	data() {
		return { }
	},
	// 统一数据源
	computed: {
		model: {
			get() {
				return this.value;
			},
			set(newVal) {
				this.$emit('input', newVal);
			}
		}
	},
	methods: {
		commentClick() {
			this.$emit('commentclick');
		},
		praiseClick() {
			this.$emit('praiseclick');
		},
		collectionClick() {
			this.$emit('collectionClick');
		},
		shareClick() {
			this.$emit('shareclick');
		}
	}
};
</script>

<style scoped>
.comment-tool {
	background-color: #fff;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 98rpx;
	display: flex;
	align-items: center;
	flex-direction: row;
	box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.4);
}
.tool-input {
	flex: 1;
	font-size: 24rpx;
	margin-left: 20rpx;
	margin-right: 20rpx;
	background-color: #f4f4f4;
	border-top-right-radius: 50rpx;
	border-top-left-radius: 50rpx;
	border-bottom-right-radius: 50rpx;
	border-bottom-left-radius: 50rpx;
	padding-top: 10rpx;
	padding-bottom: 10rpx;
	padding-left: 55rpx;
	padding-right: 30rpx;
	background-image: url(../../static/img/comment/write.png);
	background-position: 20rpx;
	background-repeat: no-repeat;
	background-size: 24rpx 22rpx;
}
.tool-placeholder {
	font-size: 24rpx;
	color: #999999;
}
.comment-panel{
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}
.tool-comment {
	width: 39rpx;
	height: 37rpx;
	margin-right: 34rpx;
}
.praise-panel{
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}
.tool-praise {
	width: 36rpx;
	height: 37rpx;
	margin-right: 34rpx;
}
.collection-panel{
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}
.tool-collection {
	width: 40rpx;
	height: 37rpx;
	margin-right: 34rpx;
}
.share-panel{
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}
.tool-share {
	width: 34rpx;
	height: 37rpx;
	margin-right: 34rpx;
}
.comment-tip{
	line-height: 1.2;
	position: absolute;
	top: -20rpx;
	right: 8rpx;
	font-size: 24rpx;
	color: #ce0201;
	padding: 2rpx 10rpx;
	border-top-right-radius: 50rpx;
	border-top-left-radius: 50rpx;
	border-bottom-right-radius: 50rpx;
	border-bottom-left-radius: 50rpx;
	background-color: #f7d7da;
}
</style>
