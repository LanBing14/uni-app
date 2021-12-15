<template>
    <view>

        <view class="media-item view" @click="goDetail(item1.businessId)">
            <view class="view" :style="{flexDirection:'row-reverse'}">
                <view v-if="item1.image_list || item1.titleImg" class="image-section flex-row image-section-left">
                    <image :fade-show="false" class="image-list1 image-list2"
                           v-if="item1.titleImg" :src="item1.titleImg" mode="aspectFill"></image>
                    <image :fade-show="false" class="image-list3" v-if="item1.image_list" :src="source.url" v-for="(source, i) in item1.image_list"
                           :key="i" mode="aspectFill"></image>
                </view>
                <!-- 新闻标题 -->
                <view class="media-info-box">
                    <text class="media-title">{{item1.title}}</text>
                    <view class="media-foot flex-row">
                        <view class="media-info flex-row">
                            <view v-for="(tag, index) in item1.tagList" :key="index">
                                <text v-if="tag.tagName" class="info-text info-source">{{tag.tagName}}</text>
                            </view>
                            <text class="info-text">{{item1.publishDate}}</text>
                        </view>
                        <view class="flex-row views">
                            <uni-icons type="eye" color="#bdbdbd" size="12"></uni-icons>
                            <text class="views-num">{{item1.browseCount}}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="media-item-line" style="position: absolute;"></view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            item1: {
                type: Object,
                default: function(e) {
                    return {}
                }
            },
            index: {
                type: Number
            }
        },
		data(){
			return {
				demoImgUrl: '/static/img/demo2.png'
			}
		},
        methods: {
            goDetail(businessId) {
                this.$parent.$parent.$parent.currentId =  businessId;
                this.$parent.$parent.$parent.currentIndex =  this.index;
                uni.navigateTo({
                   url: '/pages/details/details?id=' + businessId
                });
            },
            close(e) {
                e.stopPropagation();
                this.$emit('close');
            }
        }
    }
</script>

<style scoped>
    .view {
        flex-direction: column;
    }

    .flex-row {
        flex-direction: row;
    }

    .flex-col {
        flex-direction: column;
    }

    .list-cell {
        padding: 0 30rpx;
    }

    .uni-list-cell-hover {
        background-color: #eeeeee;
    }

    .media-item {
        position: relative;
        flex: 1;
        flex-direction: column;
        padding: 20rpx 30rpx 21rpx 30rpx;
    }

    .media-item-line {
        position: absolute;
        left: 30rpx;
        right: 30rpx;
        bottom: 0;
        height: 1rpx;
        background-color: #ebebeb;
    }

    .media-image-right {
        flex-direction: row;
    }

    .media-image-left {
        flex-direction: row-reverse;
    }

    .media-info-box {
        flex: 1;
    }

    .media-title {
        flex: 1;
        lines: 2;
        text-overflow: ellipsis;
        font-size: 32rpx;
        line-height: 44rpx;
        color: #000000;
    }

    .image-section {
        margin-top: 20rpx;
        flex-direction: row;
        justify-content: space-between;
    }

    .image-section-right {
        margin-top: 0rpx;
        margin-left: 20rpx;
        width: 166rpx;
        height: 166rpx;
    }

    .image-section-left {
        margin-top: 0rpx;
        margin-left: 20rpx;
        width: 166rpx;
        height: 166rpx;
    }

    .image-list1 {
        width: 690rpx;
        height: 481rpx;
        border-radius: 10rpx;
        overflow: hidden;
    }

    .image-list2 {
        width: 166rpx;
        height: 166rpx;
        border-radius: 10rpx;
        overflow: hidden;
    }

    .image-list3 {
        width: 166rpx;
        height: 166rpx;
        border-radius: 10rpx;
        overflow: hidden;
    }

    .media-info {
        flex-direction: row;
        align-items: center;
    }

    .info-text {
        margin-right: 20rpx;
        color: #999999;
        font-size: 24rpx;
    }

    .info-source {
        color: #ce0201;
        border-width: 1rpx;
        border-style: solid;
        border-color: #ce0201;
        border-radius: 10rpx;
        padding: 0 10rpx;
    }

    .media-foot {
        margin-top: 25rpx;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .views {
        align-items: center;
    }

    .views-num {
        margin-left: 10rpx;
        color: #a3a3a3;
        font-size: 24rpx;
    }
</style>
