<script>
	import uniIcons from 'components/uni-icons/uni-icons.vue'
	import uniBadge from 'components/uni-badge/uni-badge.vue'
	import webscoket from '@/websocket/index.js'
	import store from '@/store'
    import {Api_getShareInfo, Api_getAppVersion} from '@/api/share.js'
    import * as utils from '@/utils/index.js'
    function getUrlKey(url, name) {
        return (
            decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
                    url
                ) || [, ''])[1].replace(/\+/g, '%20')
            ) || null
        );
    }

	export default {
		components: {
			uniIcons,
			uniBadge,
            getUrlKey
		},
		onLaunch: function() {
      // #ifdef APP-PLUS 启动页展示几秒钟
      setTimeout(() => {
        plus.navigator.closeSplashscreen();
      }, 2400);
      // #endif
            //监听click事件，用户从手机通知栏点击触发的
            plus.push.addEventListener("click", function (msg) {

                //根据payload传递过来的数据，打开一个详情
                var payload = msg.payload;
                if (payload) {

                    if (payload.params && payload.params.indexOf("businessId") > -1 && payload.params.indexOf("businessType") > -1) {

                        let businessId = getUrlKey(payload.params, "businessId");
                        let businessType = getUrlKey(payload.params, "businessType");
                        let messageType = getUrlKey(payload.params, "messageType");

                            var url = '';

                            // 系统消息
                            if (messageType === '0') {
                                // 业务类型  0:评论 1:回答  2:文章  3:想法  4:栏目(先不做)  5:内容  6:专家  7:著作
                                if (businessType === '1') {
                                    url = '/pages/faq/faq/answer-detail?id=' + businessId;
                                } else if (businessType === '2') {
                                    url = '/pages/details/details?id=' + businessId;
                                } else if (businessType === '3') {
                                    url = '/pages/faq/idea-detail?id=' + businessId;
                                } else if (businessType === '5') {
                                    url = '/pages/details/details?id=' + businessId;
                                } else if (businessType === '6') {
                                    url = '/pages/specialist/specialist?expertId=' + businessId;
                                } else if (businessType === '7') {
                                    url = '/pages/details/book-detail?id=' + businessId;
                                }
                            } else {
                                const isExpert = utils.getStorageUserInfo('isExpert');

                                // 专家用户多一个文章的tab
                                if (businessType === '3') {
                                    if (isExpert !== '1') {
                                        businessType = '2';
                                    }
                                }
                                url = "/pages/user-center/msg-box/msg-list?messageType=" + messageType + "&index=" + businessType ;
                            }

                            if (url) {
                                uni.navigateTo({
                                    url: url
                                });
                            }
                    } else {
                        uni.navigateTo({
                            url: "/pages/user-center/msg-box/msg-list?messageType=0"
                        });
                    }
                }


            }, false);

			// 判断APP是否应该升级
			// #ifdef APP-PLUS
			var that = this;
			// 获取本地应用资源版本号  
			plus.runtime.getProperty(plus.runtime.appid, function(inf) {
				Api_getAppVersion().then(res => {
					if (res.statusCode === 1) {
						if (inf.version < res.data.appVersion) {
							uni.showModal({ //提醒用户更新
								title: "更新提示",
								content: res.data.appInfo ? res.data.appInfo : 'APP有新版本发布啦，快来更新吧',
								success: (re) => {
									if (re.confirm) {
										const platform = uni.getSystemInfoSync().platform;
										if (platform == 'android') {
											var dtask = plus.downloader.createDownload(res.data.androidUrl, {}, function (d, status) {
												// 下载完成  
												if ( status == 200 ) {
													plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, function (error) {
														uni.showToast({
															title: '安装失败',
															icon: 'none',
															duration: 2000
														});
													});
												} else {
													uni.showToast({
														title: '下载失败',
														icon: 'none',
														duration: 2000
													});
												}
											});
											dtask.start();
										} else if (platform == 'ios') {
											plus.runtime.openURL(res.data.iosUrl);
										}
									}
								}
							});
						} else {
						}
					} else {
					}
				});
			});
			// #endif
		},
		onShow: function() {

            // #ifdef APP-PLUS
            setTimeout(function(){
                var args= plus.runtime.arguments;
                if(args){
                    if (getUrlKey(args, "path")) {
                        let url = args.substring(args.indexOf("?path=") + 6, args.length);
                        url = url.replace("&", "?");
                        uni.navigateTo({
                            // 参考文档 https://ask.dcloud.net.cn/article/409
                            // 获取从其他应用进入本应用的参数path。其他应用访问本应用地址：<a href="hbuilder://?name=test&path=/pages/details/details">文章详情</a>
                            url: url
                        });
                    }

                    // 用完参数之后清空，否则每次唤醒app都会调用上面的方法
                    plus.runtime.arguments = null;
                    plus.runtime.arguments = '';
                    // 处理args参数，如直达到某新页面等
                }
            }, 500);
            // #endif

			// 如果有登录token，发起websocket连接
			if (uni.getStorageSync('user-token')) {
				webscoket.dispatch('initWebsocket');
			} else {
				// 清除消息气泡
				uni.removeTabBarBadge({
					index: 3
				});
				store.dispatch('saveUnReadCount', 0);
			}
        },
        onUniNViewMessage:function(e){
            uni.showToast({
                title: "接受到数据",
                icon : "none"
            });
        },
		onHide: function() {
			// 关闭websocket连接
			webscoket.dispatch('closeWebsocket');
		},
		onTabItemTap: function(e){
			
		},
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/css/common.css';
	@import './common/css/iconfont.css';

    /* #ifndef APP-PLUS-NVUE */
    /* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
    @import './common/css/uni.css';
    /* #endif*/
</style>
