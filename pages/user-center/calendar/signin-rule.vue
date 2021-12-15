<template>
    <view class="text1 flex flex-col">
        <text style="font-size: 18px;">签到规则：</text>
        <text>每人每天可签到1次。签到7天为一个周期，连续签到积分递增，即第一天签到得1积分，连续签到2天，2积分；连续签到3天，3积分……中途中断或超过7天将会开始新一轮的计算。</text>
		<text> </text>
        <text>上述信息最终解释权归源点信用所有。</text>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                title: '1'
            }
        },
        methods: {
        }
    }
</script>

<style>
    .text1{
        margin-top: 20px;
        padding: 0 40rpx;
        font-size: 32rpx;
    }
</style>
