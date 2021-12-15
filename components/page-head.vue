<template name="page-head">
	<view class="uni-page-head">
		<view class="uni-page-head-title">{{title}}111</view>
	</view>
</template>
<script>
	export default {
		name: "page-head",
		props: {
			title: {
				type: String,
				default: ""
			}
		}
		/* onReady() {
			// 通过 id 获取 nvue 子窗体  
			const subNVue = uni.getSubNVueById('nav')  
			console.log('sub')
			// 打开 nvue 子窗体  
			subNVue.show('slide-in-left', 300, function(){  
			    // 打开后进行一些操作...  
			    //   
			});  
			// 关闭 nvue 子窗体  
			subNVue.hide('fade-out', 300)
		} */
	}
</script>