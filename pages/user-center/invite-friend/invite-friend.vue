<template>
	<view class="friend" @longpress="actionSheetTap">
		<image class="friend-bg" src="/static/img/ucenter/friends/bj.png"></image>
		<image class="friend-word" src="/static/img/ucenter/friends/word.png"></image>
		<image class="friend-box" src="/static/img/ucenter/friends/box.png"></image>
		<view class="con">
			<text class="title title1">邀请朋友</text>
			<image class="qrcode" :src="invitationQrUrl"></image>
			<text class="invite-code">邀请码：{{invitationCode}}</text>
			<button class="yd-btn yd-btn-type1" type="primary" @tap="share">立即邀请</button>
			<text class="title title2">邀请步骤</text>
			<text class="step">您可以保存海报，邀请好友扫码下载“源点信用APP”；或点击“立即邀请”分享链接给好友</text>
		</view>

		<share-box ref='change' :info="obj"></share-box>
	</view>
</template>
<script>
	import * as utils from '@/utils/index.js'
    import apiUrl from '@/api/apiUrl.js'
	export default{
		data() {
	        return {
                invitationQrUrl: apiUrl.invitationQrUrl,
				invitationCode: '',
				obj: {}
			};
	    },
		onLoad() {
		    console.log(apiUrl.invitationQrUrl)
			if (uni.getStorageSync('user-token')) {
				utils.getUserInfo(true).then(res => {
					if (res) {
						this.invitationCode = res.invitationCode;
					}
				});
			}
		},
        methods: {
            capture() {
                var pages = getCurrentPages();
                var page = pages[pages.length - 1];
                console.log('当前页：'+pages.length-1);
                var bitmap=null;
                var currentWebview = page.$getAppWebview();

                currentWebview.setBounce({position:{top:'100px'},changeoffset:{top:'0px'}});
                bitmap = new plus.nativeObj.Bitmap('amway_img');
                // 将webview内容绘制到Bitmap对象中
                currentWebview.draw(bitmap,function(){
                    console.log('截屏绘制图片成功');
                    bitmap.save( "_doc/a.jpg"
                        ,{}
                        ,function(i){
                            console.log('保存图片成功：'+JSON.stringify(i));
                            uni.saveImageToPhotosAlbum({
                                filePath: i.target,
                                success: function () {
                                    bitmap.clear(); //销毁Bitmap图片
                                    uni.showToast({
                                        title: '保存图片成功',
                                        mask: false,
                                        duration: 1500
                                    });
                                }
                            });
                        }
                        ,function(e){
                            console.log('保存图片失败：'+JSON.stringify(e));
                        });
                },function(e){
                    console.log('截屏绘制图片失败：'+JSON.stringify(e));
                });
                //currentWebview.append(amway_bit);
            },
            actionSheetTap() {
                uni.showActionSheet({
                    itemList: ['保存图片'],
                    success: (e) => {
                        this.capture();
                    }
                })
            },
            share() {
              this.obj = {
              	title: '源点信用',
              	summary: '点击下载源点信用，填我邀请码【' + this.invitationCode + '】，可得100积分！',
              	href: '',
              	// businessId: '' // 当前业务主键id
              }
              this.$refs.change.share();
			}
        }
    }

</script>

<style scoped>
	view {
		display: flex;
	}
	.friend {
		flex-direction: column;
		background-color: #fff;
		position: relative;
		align-items: center;
	}
	.con {
		flex-direction: column;
		width: 750rpx;
		align-items: center;
		position: absolute;
		top: 370rpx;
	}
	.friend-bg {
		position: absolute;
		top: 0;
		width: 750rpx;
		height: 590rpx;
	}
	.friend-word {
		margin-top: 188rpx;
		width: 480rpx;
		height: 137rpx;
	}
	.friend-box {
		width: 750rpx;
		height: 1009rpx;
	}
	.title {
		border-radius: 50rpx;
		text-align: center;
		font-size: 32rpx;
		color: #fff;
		width: 210rpx;
		height: 70rpx;
		line-height: 70rpx;
		background-color: #ff9d8c;
	}
	.title1 {
		margin-bottom: 70rpx;
	}
	.qrcode {
		width: 260rpx;
		height: 260rpx;
	}
	.title2 {
		margin-bottom: 26rpx;
	}
	.invite-code {
		color: #000;
		text-align: center;
		font-size: 24rpx;
		margin-top: 10rpx;
	}
	.step {
		width: 590rpx;
		text-align: center;
		color: #555555;
		font-size: 24rpx;
	}
	.yd-btn {
		margin-top: 46rpx;
		margin-bottom: 70rpx;
		font-size: 30rpx;
	}
</style>
