<template>
	<view class="center">
		<!-- 列表 -->
		<view class="center-list">
			<view class="center-list-item border-bottom" @click="goDetail('info')">
				<text class="list-text">账号管理</text>
				<view class="navigat-arrow"><uni-icons type="arrowright" color="#bdbdbd"></uni-icons></view>
			</view>
			<view class="center-list-item border-bottom">
				<text class="list-text">推送管理</text>
				<switch :checked="pushStatus" color="#ce0201" @change="pushMsg" style="transform:scale(0.7); margin-top: 10rpx; margin-right: -18rpx;"/>
			</view>
			<view class="center-list-item border-bottom" @tap="cleanCache()">
				<text class="list-text">清除缓存</text>
				<text class="cache-size">{{cacheSize}}</text>
				<view class="navigat-arrow"><uni-icons type="arrowright" color="#bdbdbd"></uni-icons></view>
			</view>
			<view class="center-list-item border-bottom" @tap="goDetail('about')">
				<text class="list-text">关于源点信用</text>
				<view class="navigat-arrow"><uni-icons type="arrowright" color="#bdbdbd"></uni-icons></view>
			</view>
			<view class="center-list-item" @click="goDetail('user-services')">
				<text class="list-text">用户协议</text>
				<view class="navigat-arrow"><uni-icons type="arrowright" color="#bdbdbd"></uni-icons></view>
			</view>
		</view>

		<button class="logout yd-btn yd-btn-type1" type="primary" :loading="loading" @tap="logout">退出登录</button>

	</view>
</template>

<script>
    import {Api_GetPushStatus, Api_SwitchPushStatus} from '@/api/userCenter.js';
    import {Api_Logout} from '@/api/login.js';
    export default {
        data() {
            return {
                cacheSize: '',
                loading: false,
                pushStatus: true,
                enableChange: false
            };
        },
        onLoad() {
            this._timer = null;
            this.getPushStatus();
        },
        onShow() {
            this.clearTimer();

            // 计算本地缓存大小
            let that = this;
            plus.cache.calculate(function (size) {
                if (size < 1024 * 1024) {
                    that.cacheSize = '0M';
                } else {
                    that.cacheSize = Math.floor(size / 1024 / 1024 * 100) / 100 + 'M';
                }
            });
        },
        onUnload() {
            this.clearTimer();
            this.loading = false;
        },
        methods: {
            openTypeError(error) {
                console.error('open-type error:', error);
            },
            clearTimer() {
                if (this._timer != null) {
                    clearTimeout(this._timer);
                }
            },
            switch1Change: function (e) {
                console.log('switch1 发生 change 事件，携带值为', e.target.value)
            },
            switch2Change: function (e) {
                console.log('switch2 发生 change 事件，携带值为', e.target.value)
            },
            getPushStatus: function(){
                Api_GetPushStatus().then(res => {
                    this.pushStatus = res.data.pushStatus;

                    setTimeout(()=> {
                        this.enableChange = true;
                    }, 500)
                }).catch(err => {
                    console.log(err);
                    setTimeout(()=> {
                        this.enableChange = true;
                    }, 500)
                });
            },
            pushMsg: function(e){

                // 如下写法为了解决switch在安卓手机上回显时自动触发change事件的问题
                if (!this.enableChange) {
                    return;
                }

                let title = '已关闭推送';
                if (e.detail.value) {
                    title = '已开启推送';
                }

                Api_SwitchPushStatus().then(res => {
                    uni.showToast({
                        title: title,
                        mask: false,
                        duration: 1500
                    });
                }).catch(err => {
                    uni.showToast({
                        icon: "none",
                        title: title,
                        mask: false,
                        duration: 1500
                    });
                });

            },
            cleanCache: function() {
                let that = this;
                // 可以询问用户是否删除
                uni.showModal({
                    title: '提示',
                    content: '确定清除缓存吗?',
                    success(res) {
                        // 用户确定要删除
                        if (res.confirm) {
                            // 使用plus.cache.clear 清除应用中的缓存数据 这里清除后还要二十几KB没有清除，达不到全部清除
                            plus.cache.clear(function () {
                                uni.showToast({
                                    title: '清除成功',
                                    icon: 'none',
                                    success() {
                                        // 成功后处理
                                        that.cacheSize = '0M';
                                    }
                                })
                            });
                        }
                    }
                });
            },
            goDetail(link) {
                uni.navigateTo({
                    url: link
                });
            },
            logout() {
                this.loading = true;
                Api_Logout().then(res => {
                    this.loading = false;

                    // 退出成功
                    if (res.statusCode == 1) {
                        uni.removeStorageSync('user-token');
                        uni.reLaunch({
                            url: '/pages/user-center/user-center'
                        });
                    } else {
                        uni.showToast({
                            icon: "none",
                            title: "登出失败，请稍微重试",
                            mask: false,
                            duration: 1500
                        });
                    }
                }).catch(err => {
                    this.loading = false;
                    uni.showToast({
                        icon: "none",
                        title: "登出失败，请稍微重试",
                        mask: false,
                        duration: 1500
                    });
                });
            }
        }
    };
</script>

<style scoped>
	@import '@/common/css/uCenter/uCenter.css';

	.cache-size {
		height: 90rpx;
		width: 100rpx;
		line-height: 90rpx;
		font-size: 34rpx;
		color: #555;
		text-align: right;
	}

	.logout {
		margin-top: 290rpx;
		margin-left: 90rpx;
		margin-right: 90rpx;
	}
</style>
