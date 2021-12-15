import request from '@/utils/request.js'
import apiUrl from '@/api/apiUrl.js'

/**
 * 分享至大家谈，保存到分享表，同一内容不可转发多次至“大家谈”
 * @param {Object} params
 */
export function Api_AddShare(params) {
    return request("/share/add", {
        method: "post",
        params: params
    });
}

/**
 * 获取粘贴板上面的详细内容
 * @param id
 * @param type
 * @constructor
 */
export function Api_getShareInfo(id, type) {
    return request(apiUrl.userCenter.userInfo.getShareInfo, {
        method: "get",
        params: {id: id, type: type}
    });
}


/**
 * 获取最新的APP版本信息
 * @param {Object} params
 */
export function Api_getAppVersion(params) {
    return request('/app/user/get-app-version', {
        method: 'get',
        params: params
    });
}