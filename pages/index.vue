<template>
  <view class="content">
  </view>
</template>

<script>

import {Api_GetInfo} from '@/api/advertisement.js';
export default {
  data() {
    return {}
  },
  onLoad() {
    /*
    // TODO 下载pdf文件
    uni.downloadFile({
        url: 'https://images.yuandiancredit.com/group1/M00/00/0D/rBPP3V8zSnyAH4teAA3sUFNaoEc095.pdf',
        success: function (res) {
            var filePath = res.tempFilePath;
            uni.openDocument({
                filePath: filePath,
                success: function (res) {
                    console.log('打开文档成功');
                }
            });
        },
        complete: function (res) {
            console.log(res)
        }
    });*/

    this.loadExecution()
  },
  methods: {
    loadExecution: function () {
      /*/!**
       * 获取本地存储中launchFlag的值
       * 若存在，说明不是首次启动，直接进入首页；
       * 若不存在，说明是首次启动，进入引导页；
       */
      try {
        const value = uni.getStorageSync('launchFlag');
        if (value) {
          Api_GetInfo().then(res => {
            try {
              if (res.statusCode === 1) {
                // 广告页
                uni.redirectTo({
                  url: '/pages/advertisement'
                });
              } else {
                // 没有启动页面，直接进入app内部
                uni.switchTab({
                  url: '/pages/news/index'
                });
              }
            } catch (e) {
              uni.switchTab({
                url: '/pages/news/index'
              });
            }
          }).catch(e => {
            uni.switchTab({
              url: '/pages/news/index'
            });
          })
        } else {
          uni.setStorageSync('launchFlag', true);
          uni.redirectTo({
            url: '/pages/welcome'
          });
        }
      } catch (e) {
        // error
        uni.setStorageSync('launchFlag', true);
        uni.switchTab({
          url: '/pages/news/index'
        });
      }
    }
  }
}
</script>
<style>
</style>
