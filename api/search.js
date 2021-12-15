import request from '@/utils/request.js'

// 搜索
export function Api_GetSearchWithPage(params) {
    return request("/cms/es/searchWithPage", {
        method: "get",
        params: params
    });
}

// 热搜
export function Api_GetHotsearchList(params) {
    return request("/cms/hotsearch/list", {
        method: "get",
        params: params
    });
}

// 历史搜索
export function Api_GetHistorySearchList(params) {
    return request("/cms/hotsearch/history", {
        method: "get",
        params: params
    });
}

// 记录关键词
export function Api_AddKeyword(params) {
    return request('/cms/es/keyword', {
        method: 'post',
        params: params
    })
}