import request from '@/utils/request.js'

// 获取资讯分类
export function Api_GetCategory(params) {
    return request("/app/information/category", {
        method: "get",
        params: params
    });
}

// 获取资讯列表
export function Api_GetInformation(params) {
    return request("/app/information/page", {
        method: "get",
        params: params
    });
}

// 去资讯详情页
export function Api_GoDetail(params) {
    return request("/app/information/detail/" + params, {
        method: "get"
    });
}

// 使用积分阅读全文
export function Api_UseScore(params) {
    return request("/app/information/detail/subtract-score/" + params, {
        method: "get"
    });
}

// 获取收藏数和状态
export function Api_GetCollectionStatus(params) {
    return request("/cms/collection/count", {
        method: "get",
		params
    });
}