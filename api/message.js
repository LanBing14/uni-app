import request from '@/utils/request.js'
import apiUrl from '@/api/apiUrl.js'

/**
 * 获取消息数量
 * @param {Object} params
 * messageType：消息类型  0:系统消息  1:回复  2:点赞
 * businessType：业务类型  0:回复  1:回答  2:文章  3:想法
 * readStatus：阅读状态 0：未读，1：已读
 */
export function Api_GetMessageCount(params) {
    return request("/cms/message/count", {
        method: "get",
        params: params
    });
}

/**
 * 分页查询系统消息
 * @param {Object} params
 */
export function Api_GetSystemPage(params) {
    return request("/cms/message/system/page", {
        method: "get",
        params: params
    });
}

/**
 * 分页查询 评论或点赞 消息
 * @param {Object} params
 * messageType：消息类型  0:系统消息  1:回复  2:点赞
 * businessType：业务类型  0:回复  1:回答  2:文章  3:想法
 */
export function Api_GetMessagePage(params) {
    return request("/cms/message/page", {
        method: "get",
        params: params
    });
}

/**
 * 获取消息详情
 * @param {String} id
 */
export function Api_GetDetail(id) {
    return request("/cms/message/get/" + id, {
        method: "get"
    });
}

/**
 * 更新消息数量
 * @param {Object} params
 * messageType：消息类型  0:系统消息  1:回复  2:点赞
 * businessType：业务类型  0:回复  1:回答  2:文章  3:想法
 */
export function Api_UpdateReadStatus(params) {
    return request("/cms/message/updateReadStatus", {
        method: "post",
        params: params
    });
}
