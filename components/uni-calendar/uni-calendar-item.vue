<template>
	<view class="uni-calendar-item__weeks-box" :class="{
		'uni-calendar-item--disable':weeks.disable,
		'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
		'uni-calendar-item--checked':(calendar.fullDate === weeks.fullDate && !weeks.isDay) ,
		'uni-calendar-item--multiple': weeks.multiple
		}"
	 @click="choiceDate(weeks)">
		<view class="uni-calendar-item__weeks-box-item">
			<view class="uni-calendar-item__weeks-box-bg" :class="{
				'uni-calendar-item__weeks-box-bg--disable':weeks.disable,
				'uni-calendar-item__weeks-box-bg--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
				'uni-calendar-item__weeks-box-bg--checked':(calendar.fullDate === weeks.fullDate && !weeks.isDay) ,
				'uni-calendar-item__weeks-box-bg--multiple': weeks.multiple
				}">
				<text v-if="selected&&weeks.extraInfo" class="uni-calendar-item__weeks-box-circle"></text>
				<text class="uni-calendar-item__weeks-box-text" :class="{
					'uni-calendar-item--isDay-text': weeks.isDay,
					'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
					'uni-calendar-item--checked':calendar.fullDate === weeks.fullDate && !weeks.isDay,
					'uni-calendar-item--multiple': weeks.multiple,
					'uni-calendar-item--disable':weeks.disable,
					'uni-calendar-item--isDay-circle-text':weeks.isDay&&selected&&weeks.extraInfo,
					}">{{weeks.date}}</text>
				<!-- <text v-if="!lunar&&!weeks.extraInfo && weeks.isDay" class="uni-calendar-item__weeks-lunar-text" :class="{
					'uni-calendar-item--isDay-text':weeks.isDay,
					'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
					'uni-calendar-item--checked':calendar.fullDate === weeks.fullDate && !weeks.isDay,
					'uni-calendar-item--multiple': weeks.multiple,
					}">今天</text> -->
				<text v-if="lunar&&!weeks.extraInfo" class="uni-calendar-item__weeks-lunar-text" :class="{
					'uni-calendar-item--isDay-text':weeks.isDay,
					'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
					'uni-calendar-item--checked':calendar.fullDate === weeks.fullDate && !weeks.isDay,
					'uni-calendar-item--multiple': weeks.multiple,
					'uni-calendar-item--disable':weeks.disable,
					}">{{weeks.isDay?'今天': (weeks.lunar.IDayCn === '初一'?weeks.lunar.IMonthCn:weeks.lunar.IDayCn)}}</text>
				<text v-if="weeks.extraInfo&&weeks.extraInfo.info" class="uni-calendar-item__weeks-lunar-text" :class="{
					'uni-calendar-item--extra':weeks.extraInfo.info,
					'uni-calendar-item--isDay-text':weeks.isDay,
					'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
					'uni-calendar-item--checked':calendar.fullDate === weeks.fullDate && !weeks.isDay,
					'uni-calendar-item--multiple': weeks.multiple,
					'uni-calendar-item--disable':weeks.disable,
					}">{{weeks.extraInfo.info}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			weeks: {
				type: Object,
				default () {
					return {}
				}
			},
			calendar: {
				type: Object,
				default: () => {
					return {}
				}
			},
			selected: {
				type: Array,
				default: () => {
					return []
				}
			},
			lunar: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			choiceDate(weeks) {
				this.$emit('change', weeks)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-calendar-item__weeks-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.uni-calendar-item__weeks-box-text {
		font-size: $uni-calendar-font-size;
		color: $uni-text-color;
	}

	.uni-calendar-item__weeks-lunar-text {
		font-size: $uni-font-size-sm;
		color: $uni-text-color;
	}

	.uni-calendar-item__weeks-box-item {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100rpx;
		height: 100rpx;
	}

	.uni-calendar-item__weeks-box-bg{
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 60rpx;
		height: 60rpx;
		border-radius: 200rpx;
	}

	.uni-calendar-item__weeks-box-circle {
		position: absolute;
		top: 0px;
		right: 0px;
		width: 60rpx;
		height: 60rpx;
		border-radius: 200rpx;
		color: #FFFFFF;
		background-color: $uni-calendar-check;
	}

	.uni-calendar-item--disable {
		background-color: rgba(249, 249, 249, $uni-opacity-disabled);
		color: $uni-text-color-disable;
	}

	.uni-calendar-item--isDay-text {
		color: $uni-color-primary;
	}
	
	.uni-calendar-item--isDay-circle-text{
		color: #FFFFFF;
	}

	.uni-calendar-item__weeks-box-bg--isDay{
		background-color: $uni-color-primary;
	}
	.uni-calendar-item--isDay {
		// background-color: $uni-color-primary;
		opacity: 0.8;
		color: #fff;
	}

	.uni-calendar-item--extra {
		color: $uni-color-error;
		opacity: 0.8;
	}
	.uni-calendar-item__weeks-box-bg--checked{
		background-color: $uni-color-primary;
		// color: #fff;
		// opacity: 0.8;
	}
	.uni-calendar-item--checked {
		// background-color: $uni-color-primary;
		color: #fff;
		opacity: 0.8;
	}

	.uni-calendar-item--multiple {
		background-color: $uni-color-primary;
		color: #fff;
		opacity: 0.8;
	}
</style>
