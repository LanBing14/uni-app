import request from '@/utils/request.js'

export function Api_Login(params) {
    return request("/oauth/token", {
        method: "get",
		header:{
			'Authorization':'Basic YXBwOmFwcA=='
		},
        params: params
    });
}

/**
 * 判断openid是否已存在，如果存在直接登录，否则跳转绑定账号页面
 * @param {Object} params
 */
export function Api_IsOpenId(params) {
    return request("/app/user/is-openid", {
        method: "get",
        params: params
    });
}

// 退出登录
export function Api_Logout () {
    return request('/token?accessToken='+uni.getStorageSync('user-token'), {
        method: 'delete'
    })
}

/**
 * 保存token信息到redis
 * @param {Object} params
 */
export function Api_SaveAuth(params) {
    return request("/app/auth/saveAuth", {
        method: "get",
        params: params
    });
}
