<template>
	<view class="login-page">
		<image class="login-bg" src="/static/img/login/top.png"></image>
		<image class="login-box" src="/static/img/login/box.png"></image>
		<form class="form">
			<view class="input-box" v-show="loginAuth.loginType === 0">
				<text class="pre-code">+86</text>
				<input type="text" value="" v-model="loginAuth.value" class="input" placeholder="请输入当前绑定手机号" />
			</view>
			<view class="input-box" v-show="loginAuth.loginType === 0">
				<image class="ico" src="/static/img/login/ico.png" mode="aspectFill"></image>
				<input type="text" value="" v-model="loginAuth.code" class="input" placeholder="输入验证码" />
				<text class="get-code" @click="sedCode" :disabled="disabledSend" >
					{{ sum === 61 ? "获取验证码": sum + "s后重新获取" }}
				</text>
			</view>
			<view class="input-box" v-show="loginAuth.loginType === 1">
				<image class="ico" src="/static/img/login/ico1.png" mode="aspectFill"></image>
				<input type="text" value="" v-model="loginAuth.value" class="input" placeholder="输入用户名/手机号" />
			</view>
			<view class="input-box" v-show="loginAuth.loginType === 1">
				<image class="ico" src="/static/img/login/ico2.png" mode="aspectFill"></image>
				<input type="password" value="" v-model="loginAuth.password" class="input" placeholder="输入用密码" />
			</view>
			<!-- 勾选阅读协议 -->
			<view class="agreement-box">
				<image class="radio" :src="imgUrl" mode="aspectFill"></image>
				<text style="color: #999999;" @click="changeCheck">我已阅读并同意</text>
				<text class="navigator-hover" @click="goAccept">《用户服务协议》</text>
        <text class="navigator-hover" @click="goYs">《隐私政策》</text>
			</view>

			<button class="yd-btn yd-btn-type1" type="primary" @click="loginClick">登录</button>
			<view :class="loginAuth.loginType !== 0 ? 'login-btns' : 'tac'">
				<text class="sign-with-account" @click="typeChange">
					{{ loginAuth.loginType === 0 ? '账号密码登录' : '短信验证登录' }}
				</text>
				<text class="sign-with-account" v-if="loginAuth.loginType !== 0" @click="forgetPwd">&nbsp;&nbsp;|&nbsp;&nbsp;忘记密码？</text>
			</view>

			<view class="tac">
				<image class="or" src="/static/img/login/or.png" mode=""></image>
			</view>

			<view class="login-type">
				<image class="type-img" src="/static/img/login/ico-apple.png" data-logintype="apple" @click="appOAuthLogin" mode="aspectFill" v-if="showStatus"></image>
				<image class="type-img" src="/static/img/login/qq.png" data-logintype="qq" @click="appOAuthLogin" mode="aspectFill"></image>
				<image class="type-img" src="/static/img/login/wx.png" data-logintype="weixin" @click="appOAuthLogin" mode="aspectFill"></image>
				<image class="type-img" src="/static/img/login/sina.png" data-logintype="sinaweibo" @click="appOAuthLogin" mode="aspectFill"></image>
			</view>
		</form>
	</view>
</template>

<script>
	import { Api_Login, Api_IsOpenId } from "@/api/login.js"
	import { Api_SendMsg } from "@/api/baseApi.js"
	export default {
		data() {
			return {
				disabledSend:false,
				accOrphone:true,
				timer:'',
				sum:61,
				loginAuth:{
					// #ifdef APP-PLUS
					clientId: plus.push.getClientInfo().clientid,
					// #endif
					grant_type: "password",
					// 0：手机号登录；1：密码登录
					loginType: 0,
					// 手机号/用户名
					value:'',
					// 密码
					password:'',
					// 验证码
					code:'',
					// 用户类型 1:app端用户
					loginSource:'1',
				},
				imgUrl: '/static/img/login/radio.png',
				agreeChecked: false,
				showStatus: false
			}
		},
		mounted(){

		    let that = this;
		    // ios13 上使用第三方登录时必须要加上苹果登录才可以审核通过
            plus.oauth.getServices(function(services) {
                for (var i in services) {
                    var service = services[i];
                    // 获取苹果授权登录对象，苹果授权登录id 为 'apple' iOS13以下系统，不会返回苹果登录对应的 service
                    if (service.id == 'apple') {
                        that.showStatus = true;
                        console.log(that.showStatus)
                        break;
                    }
                }
            }, function(err) {
                // 获取 services 失败
            })

		},
		methods: {
			goAccept () {
				uni.navigateTo({
					url: "/pages/user-center/setting/user-services"
				});
			},
      goYs () {
        uni.navigateTo({
          url: "/pages/user-center/setting/user-ys"
        });
      },
      forgetPwd () {
          uni.navigateTo({
              url: "/pages/login/forget-password"
          });

      },
			changeCheck () {
				this.agreeChecked = !this.agreeChecked;
				if (this.agreeChecked) {
					this.imgUrl = '/static/img/login/radio1.png'
				} else {
					this.imgUrl = '/static/img/login/radio.png'
				}
			},
			typeChange(){
				this.loginAuth.loginType = !this.loginAuth.loginType*1
			},
			sedCode(){
				if(this.disabledSend){
					return false;
				}
				if(this.loginAuth.value === ''){
					uni.showToast({
						icon:'none',
					    title: '请输入手机号',
					    duration: 2000
					});
					return false;
				}
				var phonereg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!phonereg.test(this.loginAuth.value)) {
					uni.showToast({
						icon:'none',
					    title: '手机格式错误',
					    duration: 2000
					});
					return false;
				}
				uni.showLoading({
					icon:'none',
				    title: '发送中...'
				})
				this.disabledSend = true;
				this.sum = 61;
				this.timer = setInterval(() => {
					this.sum--;
					if (this.sum < 1) {
						this.sum = 61;
						this.disabledSend = false;
						clearInterval(this.timer);
					}
				}, 1000);
				Api_SendMsg({
					mobile: this.loginAuth.value,
				}).then(res => {
					uni.hideLoading();
					if (res.statusCode == '2') {
						uni.showToast({
							icon:'none',
						 title: '发送验证码失败',
						 duration: 2000
						});
						this.sum = 61;
						this.disabledSend = false;
						clearInterval(this.timer);
					}
					// const stateCode = res.statusCode;
					// if (stateCode !== "0") {
					// 	let msg = "";
					// 	switch (stateCode) {
					// 		case "00002":
					// 			msg = "信息发送失败，请重新发送";
					// 			break;
					// 		case "00005":
					// 			msg = "获取短信验证码受限，由于您今日请求次数已达上限，请明日再试";
					// 			break;
					// 		case "20115":
					// 			msg = "验证码错误";
					// 			// 清空输入的错误的验证码
					// 			this.loginAuth.code = "";
					// 			break;
					// 		default:
					// 			msg = "短信发送失败";
					// 			break;
					// 	}
					// 	uni.showToast({
					// 		icon:'none',
					// 	    title: msg,
					// 	    duration: 2000,
					// 		position:'bottom'
					// 	});
					// }
				}).catch(err=>{
				   uni.hideLoading();
				   uni.showToast({
				   	icon:'none',
				    title: '发送验证码失败',
				    duration: 2000
				   });
				})
			},
			loginClick(){
				let loginFlag = true;
				if(this.loginAuth.loginType === 0 ){
					var phonereg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
					if(this.loginAuth.value === ''){
						console.log(this.loginAuth.value)
						uni.showToast({
							icon:'none',
							title: '请输入手机号',
							duration: 2000
						});
						loginFlag=false;
					}else if (!phonereg.test(this.loginAuth.value)) {
						uni.showToast({
							icon:'none',
							title: '手机格式错误',
							duration: 2000
						});
						loginFlag= false;
					}else if(this.loginAuth.code === ''){
						uni.showToast({
							icon:'none',
							title: '请输入验证码',
							duration: 2000
						});
						loginFlag= false;
					}else if(!this.agreeChecked) {
						uni.showToast({
							icon:'none',
							title: '请勾选协议',
							duration: 2000
						});
						loginFlag= false;
					}
				}else{
					if(this.loginAuth.value === ''){
						uni.showToast({
							icon:'none',
							title: '请输入用户名/手机号',
							duration: 2000
						});
						loginFlag= false;
					 }else if(this.loginAuth.password === ''){
						uni.showToast({
							icon:'none',
							title: '请输入密码',
							duration: 2000
						});
						loginFlag= false;
					}else if(!this.agreeChecked) {
						uni.showToast({
							icon:'none',
							title: '请勾选协议',
							duration: 2000
						});
						loginFlag= false;
					}
				}
				if(loginFlag){
                    uni.showLoading();
					this.goLogin(this.loginAuth);
				}
			},
			goLogin (loginParams) {
				this.$store.dispatch('LoginAuth', loginParams).then(res =>{
					uni.hideLoading();
					if(res.message){
						uni.showToast({
							icon:'none',
						    title: res.message,
						    duration: 2000
						});
					}else{
						uni.reLaunch({
							url: '/pages/user-center/user-center'
						});
					}
				}).catch(err=>{
				   uni.hideLoading();
				   uni.showToast({
				   	icon:'none',
				    title: '登录失败',
				    duration: 2000
				   });
				});
			},
			appOAuthLogin (e) {
				var me = this;
				// 1 获取用户的登录类型
				var logintype = e.currentTarget.dataset.logintype;
				// 2 授权登录，弹出授权窗口
				uni.login({
					provider: logintype,
					success(loginRes) {
                        uni.showLoading();

						// 3 授权登录成功以后，获取用户的信息
						uni.getUserInfo({
							provider: logintype,
							success(info) {
								var userInfo = info.userInfo;
								var openId = "";
								var wxOpenId = "";
								var qqOpenId = "";
								var wbOpenId = "";
                                var appleOpenId = "";
								if (logintype == "weixin") {
									wxOpenId = userInfo.openId;
									openId = userInfo.openId;
								} else if (logintype == "qq") {
									qqOpenId = userInfo.openId;
									openId = userInfo.openId;
								} else if (logintype == "sinaweibo") {
									wbOpenId = userInfo.id;
									openId = userInfo.id;
								}  else if (logintype == "apple") {
                                    appleOpenId = userInfo.openId;
                                    openId = userInfo.openId;
                                }

								// 4 调用开发者后台，执行一键注册或登录
								if (wxOpenId || qqOpenId || wbOpenId || appleOpenId) {
									// 判断openid是否已存在，如果存在直接登录，否则跳转绑定账号页面
									Api_IsOpenId({openId: wxOpenId, qqOpenId: qqOpenId, wbOpenId: wbOpenId, appleOpenId: appleOpenId}).then(res => {
										if (res.statusCode == '1') {
											if (res.data) {
												// 调用登录方法
												let loginParams = {
													clientId: plus.push.getClientInfo().clientid,
													grant_type: "password",
													// 0：手机号登录；1：密码登录；2：第三方授权登录
													loginType: 2,
													// 用户类型 1:app端用户
													loginSource:'1',
													// 授权openid，微信、QQ、微博、苹果登录
													openId: openId,
												}
                                                uni.hideLoading();
												me.goLogin(loginParams);
											} else{
                                                uni.hideLoading();
												// 跳转绑定账号页面
												let url = '../login/bind-phone?wxOpenId=' + wxOpenId + '&qqOpenId=' + qqOpenId + '&wbOpenId=' + wbOpenId + '&appleOpenId=' + appleOpenId;
												uni.navigateTo({
													url: url
												});
											}
										} else {
                                            uni.hideLoading();
										}
									});
								}

							},
                            fail() {
                                uni.hideLoading();
                            },
                            complete() {
                                uni.hideLoading();
							}
						})
					}
				});
			},
		}
	}
</script>

<style scoped>

.login-page {
	display: flex;
	position: relative;
	align-items: center;
}
.login-bg {
	position: absolute;
	top: 0;
	width: 750rpx;
	height: 590rpx;
}
.login-box {
	width: 750rpx;
	height: 1100rpx;
	margin-top: 300rpx;
}
.form {
	margin: auto;
	margin-top: 280rpx;
	width: 585rpx;
	height: 960rpx;
	align-items: center;
	position: absolute;
	top: 115rpx;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
.input-box {
	display: flex;
	position: relative;
	flex-direction: row;
	background-color: #f5f5f5;
	border-radius: 10rpx;
	margin-bottom: 30rpx;
	box-sizing: border-box;
	width: 560rpx;
}
.pre-code {
	height: 42rpx;
	width: 114rpx;
	border-right-width: 2rpx;
	border-right-color: #e9e9eb;
	border-right-style: solid;
	margin-top: 20rpx;
	margin-left: 30rpx;
}
.input {
	width: 518rpx;
	height: 86rpx;
	line-height: 86rpx;
	padding-left: 30rpx;
	font-size: 28rpx;
}
.get-code {
	position: absolute;
	color: #ce0201;
	right: 26rpx;
	top: 20rpx;
	font-size: 28rpx;
}
.yd-btn {
	margin-top: 46rpx;
	margin-bottom: 35rpx;
	border-radius: 50rpx;
	font-size: 14px;
}
.sign-with-account {
	text-align: center;
	color: #ce0201;
	font-size: 28rpx;
	padding-left: 12rpx;
}
.login-type {
	display: flex;
	justify-content: space-between;
}
.or {
	width: 503rpx;
	height: 32rpx;
	margin: 30rpx 0;
}
.login-type {
	width: 500rpx;
	margin: 0 auto;
}
.type-img {
	width: 88rpx;
	height: 88rpx;
}
.type-img:active {
	opacity: .6;
}
.tac {
	text-align: center;
}
.ico {
	width: 40rpx;
	height: 40rpx;
	margin-left: 30rpx;
	padding-top: 24rpx;
}
.agreement-box {
	overflow: hidden;
}
.float-left {
	float: left;
}
.radio-box {
	padding-right: 8rpx;
}

.apple-box {
	margin-bottom: 40rpx;
}

.apple{
	background: #000000 url(@/static/img/login/ico-apple.png) no-repeat 20% center;
	height: 30px;
	line-height: 30px;
	font-size: 12.9px;
	width: 100%;
	color: #FFFFFF;
}
.radio {
	width: 22rpx;
	height: 22rpx;
	margin-right: 8rpx;
}
.navigator-hover {
	color: #999999;
	text-decoration: underline;
	background-color: #fff;
}
.login-btns {
	display: flex;
	justify-content:center;
}

@media (max-width: 321px) {
	.login-box {
		margin-top: 227rpx;
	}
	.form {
		height: 760rpx;
	}
}
</style>
