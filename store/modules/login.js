import {
	Api_Login
} from "@/api/login.js"
import * as utils from '@/utils/index.js'

const login = {
	state: {
		token: '',
		hasLogin: false,
		loginProvider: "",
		openid: null,
		testvuex: false,
		colorIndex: 0,
		colorList: ['#FF0000', '#00FF00', '#0000FF'],
		userInfo: {},
		isShowUserMenu: false,
		blackInfo: {},
		unReadCount: 0
	},
	mutations: {
		SAVE_BLACK_INFO: (state, data) => {
			state.blackInfo = data
		},
		SAVE_USER_MENU: (state, data) => {
			state.isShowUserMenu = data
		},
		SAVE_USER_INFO: (state, data) => {
			state.userInfo = data
		},
		SAVE_USER_UNREAD_COUNT: (state, data) => {
			state.unReadCount = data
		},
		login(state, provider) {
			state.hasLogin = true;
			state.loginProvider = provider;
		},
		logout(state) {
			state.hasLogin = false
			state.openid = null
		},
		setToken(state, token) {
			state.token = token
		},
		setOpenid(state, openid) {
			state.openid = openid
		},
		setTestTrue(state) {
			state.testvuex = true
		},
		setTestFalse(state) {
			state.testvuex = false
		},
		setColorIndex(state, index) {
			state.colorIndex = index
		}
	},
	getters: {
		currentColor(state) {
			return state.colorList[state.colorIndex]
		}
	},
	actions: {
		saveUserMenu({commit}, data) {
			commit('SAVE_USER_MENU', data)
		},
		saveBlackInfo({commit}, data) {
			commit('SAVE_BLACK_INFO', data)
		},
		saveUnReadCount({commit}, data) {
			commit('SAVE_USER_UNREAD_COUNT', data)
		},
		// lazy loading openid
		getUserOpenId: async function({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {
				if (state.openid) {
					resolve(state.openid)
				} else {
					uni.login({
						success: (data) => {
							commit('login')
							setTimeout(function() { //模拟异步请求服务器获取 openid
								const openid = '123456789'
								console.log('uni.request mock openid[' + openid + ']');
								commit('setOpenid', openid)
								resolve(openid)
							}, 1000)
						},
						fail: (err) => {
							console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
							reject(err)
						}
					})
				}
			})
		},
		LoginAuth({
			commit,
			state
		}, loginauth) {
			return new Promise((resolve, reject) => {
				console.log(loginauth)
				Api_Login({ ...loginauth
				}).then(res => {
					if (res.access_token) {
						commit('setToken', res.access_token);
						console.log(res.access_token)
						uni.removeStorageSync('user-token');
						uni.setStorageSync('user-token', res.access_token);
						utils.getUserInfo(true);
						resolve(res)
					} else if (res.statusCode == 2) {
						resolve(res)
					} else {
						reject('')
					}
				}).catch(error => {
					reject(error)
				})
			})
		},
		saveUserInfo({commit}, data) {
			commit('SAVE_USER_INFO', data)
		}
	}
}

export default login
