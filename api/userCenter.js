import request from '@/utils/request.js'
import apiUrl from '@/api/apiUrl.js'

/**
 * 保存用户头像
 * @param headPath 头像地址
 * @returns {Promise<unknown>}
 * @constructor
 */
export function Api_EditHead(headPath) {
    return request(apiUrl.userCenter.userInfo.editHead, {
        method: "get",
        params: {'headPath': headPath}
    });
}

/**
 * 获取我的收藏分页列表
 * @param params
 * @constructor
 */
export function Api_GetMyCollectinsList(params) {
    return request('/cms/collection/page', {
        method: 'get',
        params: params
    })
}

/**
 * 查看推送状态
 * @param params
 * @constructor
 */
export function Api_GetPushStatus() {
    return request('/app/user/push', {
        method: 'get'
    })
}

/**
 * 推送开关
 * @param params
 * @constructor
 */
export function Api_SwitchPushStatus() {
    return request('/app/user/push', {
        method: 'post'
    })
}

/**
 * 加入/取消收藏
 * @param params
 * @constructor
 */
export function Api_AddCollection(id) {
    return request('/cms/collection/add?businessId=' + id, {
        method: 'post'
    })
}

/**
 * 获取我的关注
 * @param {Object} params
 */
export function Api_GetMyAttention(params) {
    return request('/cms/attention/page', {
        method: 'get',
        params: params
    })
}

// 保存第三方授权ID
export function Api_SaveOpenId(params) {
    return request("/app/user/save-openid", {
        method: "post",
        params: params
    });
}

// 关闭第三方授权ID
export function Api_CloseOpenId(params) {
    return request("/app/user/close-openid", {
        method: "post",
        params: params
    });
}

/**
 * 获取用户信息
 * @param {Object} params
 */
export function Api_GetInfo(params) {
    return request(apiUrl.userCenter.userInfo.getUserInfo, {
        method: "get",
        params: params
    });
}

/**
 * 更新用户名
 * @param username
 * @constructor
 */
export function Api_editUsername(username) {
    return request(apiUrl.userCenter.userInfo.editUsername, {
        method: "get",
        params: {username: username}
    });
}

/**
 * 更新个人介绍
 * @param introduction
 * @constructor
 */
export function Api_editIntroduction(introduction) {
    return request(apiUrl.userCenter.userInfo.editIntroduction, {
        method: "get",
        params: {introduction: introduction}
    });
}

/**
 * 判断用户名是否被 使用了
 * @param username
 * @constructor
 */
export function Api_isUsername(username) {
    return request(apiUrl.userCenter.userInfo.isUsername, {
        method: "get",
        params: {username: username}
    });
}

/**
 * 更新公司
 * @param company
 * @constructor
 */
export function Api_editCompany(company) {
    return request(apiUrl.userCenter.userInfo.editCompany, {
        method: "get",
        params: {company: company}
    });
}

/**
 * 更新行业
 * @param industryCode
 * @constructor
 */
export function Api_editIndustryCode(industryCode) {
    return request(apiUrl.userCenter.userInfo.editIndustryCode, {
        method: "get",
        params: {industryCode: industryCode}
    });
}

/**
 * 获取字典
 * @param groupCode
 * @constructor
 */
export function Api_getDictionaryList(groupCode) {
    return request(apiUrl.dictionary.getByGroupCode, {
        method: "get",
        params: {groupCode: groupCode}
    });
}

/**
 * 获取浏览历史
 * @param currentPage
 * @param pageSize
 * @constructor
 */
export function Api_viewHistory(currentPage, pageSize) {
    return request(apiUrl.userCenter.viewHistory, {
        method: "get",
        params: {currentPage: currentPage, pageSize: pageSize}
    });
}

export function Api_GetMobileRegister(params) {
    return request('/app/user/get-mobile-register', {
        method: 'get',
        params: params
    })
}
//修改手机
export function Api_SaveNewMobile(params) {
    return request('/app/user/save-new-mobile', {
        method: 'post',
        params: params
    })
}
//修改密码
export function Api_SaveNewPassword(params) {
    return request('/app/user/save-new-password', {
        method: 'post',
        params: params
    })
}

// 签到
export function Api_AddCheckin(params) {
    return request('/cms/checkin/add', {
        method: 'post',
        params: params
    })
}
// 获取签到
export function Api_GetCheckin(params) {
    return request('/cms/checkin/get', {
        method: 'get',
        params: params
    })
}

// 获取签到信息
export function Api_GetCheckInDates(params) {
    return request('/cms/checkin/getCheckInDates', {
        method: 'get',
        params: params
    })
}

// 忘记密码
export function Api_SaveForgetPwd(params) {
    return request('/app/user/save-forget-password', {
        method: 'post',
        params: params
    })
}

