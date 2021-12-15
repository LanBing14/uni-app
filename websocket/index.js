import Vue from 'vue'
import Vuex from 'vuex'
import apiUrl from '@/api/apiUrl.js'
import * as utils from '@/utils/index.js';
import store from '@/store'

Vue.use(Vuex)

const websocket = new Vuex.Store({
	state:{
	        //链接是否打开了
	        IsOpen: false,
	        // SocketTask
	        SocketTask: false,
	        //断线重连定时器
	        timer: null,
	        //心跳间隔
	        timeout: 35000,
	        //心跳事件
	        interval:null,
	        // 当前重连次数
	        connectNum : 0
	    },
	mutations: {
		set_IsOpen(state,bool){
			state.IsOpen = bool
		},
		set_SocketTask(state,object){
			state.SocketTask = object
		},
		set_timer(state,timer){
			state.timer = timer
		},
		set_timeout(state,timeout){
			state.timeout = timeout
		},
		set_interval(state,obj){
			state.interval = obj
		},
		set_connectNum(state,num){
			state.connectNum = num
		},
		set_url(state,url){
			state.url = url
		}
	},
	actions: {
		// 初始化websocket
		initWebsocket({ commit, state }) {
			// 如果有用户id，再执行连接
			utils.getUserInfo(false).then(userInfo => {
				if (userInfo && userInfo.userId) {
					// 防止重复连接
					if(state.IsOpen) {
						console.log('检查websocket已连接')
						return
					};
					//检查网络是否可用
					const _this = this; 
					uni.getNetworkType({
						success(result) {
							console.log(result)
							if (result.networkType != 'none') {
								// 连接
								console.log('开始websocket连接')
								const wsurl = apiUrl.wsUrl + userInfo.userId;
								state.SocketTask = uni.connectSocket({
									url: wsurl,
									success(data) {
										console.log("websocket连接成功");
									},
								});
								if (!state.SocketTask) return;
								// 监听开启
								state.SocketTask.onOpen((res) => {
									console.log('websocket连接正常打开中...')
									// 将连接状态设为已连接
									state.IsOpen = true;
									// 第一次发送一下用户id
									state.SocketTask.send({
										data: userInfo.userId,
										success: function(e) {
											console.log('websocket第一次发送消息...')
										},
									});
									//开启心跳
									state.interval = setInterval(() => {
										if (!state.IsOpen) {
											clearInterval(state.interval);
											clearTimeout(state.interval);
											state.interval = null;
											return;
										}
										//发送心跳
										state.SocketTask.send({
											data: 'PING',
											success: function(e) {
												console.log('心跳发送成功...')
											},
											fail:function(e){
												console.log('心跳发送失败了 ...执行重连第' + state.connectNum + '次');
												state.IsOpen = false;
												//执行重连
												_this.dispatch('reConnect');
											},
										});
									}, state.timeout);
								});
								// 监听信息
								state.SocketTask.onMessage((e) => {
									console.log("收到服务器内容：" + e.data);
									// 字符串转json
									let res = JSON.parse(e.data);
									console.log(res);
									//获取到 messageCount 未读消息数量
									if (res.messageCount > 0) {
										uni.setTabBarBadge({
											index: 3,
											text: res.messageCount + ''
										});
										store.dispatch('saveUnReadCount', res.messageCount);
									} else {
										uni.removeTabBarBadge({
											index: 3
										});
										store.dispatch('saveUnReadCount', 0);
									}
								});
								// 监听关闭
								state.SocketTask.onClose(() => {
									state.IsOpen = false;
									state.SocketTask = false;
									//清除定时器
									clearInterval(state.interval);
									clearTimeout(state.interval);
									state.interval = null;
								});
								// 监听错误
								state.SocketTask.onError((e) => {
									state.IsOpen = false;
									state.SocketTask = false;
								});
							} else {
								console.log('网络已断开');
							}
						}
					});
				} else {
					// 清除消息气泡
					uni.removeTabBarBadge({
						index: 3
					});
				}
			});
		},      
		// 重新连接websocket
		reConnect({ commit, state }) {
			if (state.connectNum < 5) {
				state.timer = setTimeout(() => {
				   this.dispatch('initWebsocket');
				}, 3000);
				state.connectNum += 1;
			} else {
				state.timer = setTimeout(() => {
				   this.dispatch('initWebsocket');
				}, 450000);
				state.connectNum += 1;
			}
		},
		// 关闭websocket连接
		closeWebsocket({ commit, state }) {
			if (state.IsOpen || state.SocketTask){
				state.IsOpen = false; 
				state.SocketTask = false;
				//清除定时器
				clearInterval(state.interval);
				clearTimeout(state.interval);
				state.interval = null;
				console.log('关闭websocket连接');
			}
		}
	}
})

export default websocket
