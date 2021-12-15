import request from '@/utils/request.js';

/**
 * 获取可用积分
 * @param {Object} params
 */
export function Api_GetBonusScore(params) {
    return request("/cms/score/get", {
        method: "get",
        params: params
    });
}

/**
 * 分页查询明细
 * @param {Object} params
 */
export function Api_GetPage(params) {
    return request("/cms/score/page", {
        method: "get",
        params: params
    });
}

/**
 * 今日是否已签到
 * @param {Object} params
 */
export function Api_GetCheckInStatus(params) {
    return request("/cms/checkin/get", {
        method: "get",
        params: params
    });
}

/**
 * 回答问题、关注、评论等积分是否达到上限
 * @param {Object} params
 */
export function Api_IsFinished(params) {
    return request("/cms/score/isFinished", {
        method: "get",
        params: params
    });
}

/**
 * 保存积分
 * @param {Object} params
 * type: 操作类型 0:登录  1:完善信息  2:签到  3:评论  4:评论加精  5:转发至第三方平台  6:回答问题  7:回答加精  8:发表想法 9:关注专家/关注问题  10:邀请朋友'
 */
export function Api_SaveScore(params) {
    return request("/cms/score/add", {
        method: "post",
        params: params
    });
}