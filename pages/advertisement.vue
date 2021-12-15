<template>
  <view class="content">
    <!--图片-->
    <view v-if="type === '0'" class="con">
      <image class="image" :src="imageUrl" @click="toDetail(toUrl)"/>
    </view>
    <!--视频-->
    <view v-else class="con">
      <video id="myVideo" class="myVideo" :src="videoUrl" @error="videoCallback" @ended="videoCallback" controls="false" autoplay object-fit="fill">
        <cover-view class="controls" @click="toDetail(toUrl)"></cover-view>
        <cover-view class="controls-title" @click="skipAd">跳过</cover-view>
      </video>
    </view>
    <view class="timer" @click="skipAd">
      <view class="info">跳过</view>
      <view class="circleProgress_wrapper">
        <view class="wrapper right">
          <view class="circleProgress rightcircle"></view>
        </view>
        <view class="wrapper left">
          <view class="circleProgress leftcircle"></view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import {Api_GetInfo} from '@/api/advertisement.js';
import * as Utils from '@/utils/index.js';

export default {
  data() {
    return {
      // 0图片格式；1视频格式
      type: '',
      toUrl: 'http://m.fdscf.top',
      videoUrl: 'https://fds520.gitee.io/static/window/83.jpg',
      imagesList: [],
      imageUrl: '',
      time: ''
    }
  },
  onLoad() {
    this.getList();
  },
  onReady: function () {
  },
  onShow() {
    uni.createVideoContext('myVideo').play();
  },
  methods: {
    videoCallback: function (e) {
      // 视频播放结束或者播放错误都跳转首页
      uni.switchTab({
        url: '/pages/news/index'
      });
    },
    toDetail(url) {
      if (Utils.strIsNull(url)) {
        // 地址没有填写
        return;
      }
      clearInterval(this.time);
      if (url.indexOf('http') !== -1) {
        // 停止视频播放
        uni.createVideoContext('myVideo').pause();
        // 跳转外部链接
        uni.navigateTo({
          url: '/pages/browser?url=' + url
        });
      } else {
        // 跳转内部链接
        uni.navigateTo({
          url: url
        });
      }
    },
    skipAd() {
      clearTimeout(this.timer);
      uni.switchTab({
        url: '/pages/news/index'
      });
    },
    getList() {
      Api_GetInfo().then(res => {
        try {
          if (res.statusCode === 1) {
            this.type = res.data.info.type;
            if ("0" === this.type) {
              // 照片
              this.imagesList = res.data.file;
              let that = this;
              let len = this.imagesList.length;
              let second = res.data.info.second * 1000;
              let i = 1;
              this.time = setInterval(e => {
                if (i >= len) {
                  clearInterval(that.time);
                  uni.switchTab({
                    url: '/pages/news/index'
                  });
                  return;
                }
                that.imageUrl = that.imagesList[i].domain + '/' + that.imagesList[i].url;
                that.toUrl = that.imagesList[i].description;
                i++;
              }, second);
              that.imageUrl = that.imagesList[0].domain + '/' + that.imagesList[0].url;
              that.toUrl = that.imagesList[0].description;
            } else {
              // 视频
              this.videoUrl = res.data.file[0].domain + '/' + res.data.file[0].url;
              this.toUrl = res.data.file[0].description;
            }
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
    },
  }
}
</script>

<style>
.controls {
  width: 100%;
  height: 100vh;
}
.controls-title {
  top: 40px;
  right: 10px;
  position: absolute;
  width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
  color: #FFFFFF;
  font-size: 12px;
}
.content {
  width: 100%;
  height: 100vh;
}

.content .con {
  width: 100%;
  height: 100vh;
}

.timer {
  position: fixed;
  top: 40px;
  right: 10px;
  z-index: 10000;
}

.image {
  width: 100%;
  height: 100%;
}

.myVideo {
  width: 100%;
  height: 100vh;
}

.info {
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
  color: #FFFFFF;
  font-size: 12px;
}

.circleProgress_wrapper {
  width: 36px;
  height: 36px;
  position: relative;
}

.wrapper {
  width: 18px;
  height: 36px;
  position: absolute;
  top: 0;
  overflow: hidden;
}

.right {
  right: 0;
}

.left {
  left: 0;
}

.circleProgress {
  width: 32px;
  height: 32px;
  border: 2px solid #FFFFFF;
  border-radius: 50%;
  position: absolute;
  top: 0;
  -webkit-transform: rotate(45deg);
}

.rightcircle {
  border-top: 2px solid #03A9F4;
  border-right: 2px solid #03A9F4;
  right: 0;
  -webkit-animation: circleProgressLoad_right 4s linear;
  /*动画停留在最后一帧*/
  animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
  -webkit-animation-fill-mode: forwards;
  -o-animation-fill-mode: forwards;
}

.leftcircle {
  border-bottom: 2px solid #03A9F4;
  border-left: 2px solid #03A9F4;
  left: 0;
  -webkit-animation: circleProgressLoad_left 4s linear;
  /*动画停留在最后一帧*/
  animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
  -webkit-animation-fill-mode: forwards;
  -o-animation-fill-mode: forwards;
}
</style>