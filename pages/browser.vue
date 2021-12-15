<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="url"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      webviewStyles: {
        progress: {
          color: '#FF3333'
        }
      },
      url: ''
    }
  },
  /**
   * 自定义返回
   * @param options
   * @returns {boolean}
   */
  onBackPress(options) {
    uni.switchTab({
      url: '/pages/news/index'
    });
    return true;
  },
  onLoad(options) {
    if (options && options.url) {
      this.url = options.url;
    }
  }
}
</script>