<template>
	<view>
		<uni-popup ref="popup" :type="type" :mask-click="false" @change="change">
			<view class="uni-tip">
				<text class="uni-tip-title">{{popsInfo.title?popsInfo.title : '提示'}}</text>
				<view class="uni-tip-content">
					<text v-if="popsInfo.content">{{popsInfo.content}}</text>
					<slot></slot>
				</view>
				
				<view class="uni-tip-group-button">
					<view class="uni-tip-button" style="border-right: 1rpx solid #dcdce0;">
						<text @click="cancelBtn" style="color: #87878a;">取消</text>
					</view>
					<view class="uni-tip-button">
						<text @click="sureBtn" style="color: #1f1f26;">确定</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	
	/* pops-Object
	 * @params
	 * title:
	 * content:
	 * imgUrl:
	 */
	export default {
		props: {
			popsInfo: {
				type: Object,
				default: function(){
					return {}
				}
			}
		},
		data() {
			return {
				type: 'center'  //center,top,bottom
			}
		},
		components: {
			uniPopup
		},
		methods: {
			change(){
				console.log('pop change')
			},
			open(){
				this.$refs.popup.open();
			},
			cancelBtn(){
				this.$emit('cancel-btn', '点击了取消');
				this.$refs.popup.close();
			},
			sureBtn(){
				this.$emit('sure-btn', '点击了取消');
				console.log('pop sure')
			}
		}
	}
</script>

<style scoped>
/* 提示窗口 */
.uni-tip {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	width: 300px;
	background-color: #fff;
	border-radius: 10px;
}

.uni-tip-title {
	padding-top: 15px;
	text-align: center;
	font-weight: bold;
	font-size: 16px;
	color: #1f1f26;
}

.uni-tip-content {
	padding: 15px;
	font-size: 14px;
	color: #666;
	border-bottom: 1rpx solid #dcdce0;
}

.uni-tip-group-button {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
}

.uni-tip-button {
	flex: 1;
	text-align: center;
	font-size: 14px;
	color: #3b4144;
	padding: 15px;
}

/* 插屏广告 */
.uni-image {
	position: relative;
}

.image {
	width: 200px;
	height: 200px;
}

.uni-image-close {
	margin-top: 20px;
	text-align: center;
}
</style>
