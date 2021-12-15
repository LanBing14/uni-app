import request from '@/utils/request.js'

export function Api_GetList(params) {
	return request("/cms/experts/page", {
	    method: "get",
	    params: params
	});
}

// 详情页
export function Api_GoDetail(params) {
    return request("/cms/experts/" + params, {
        method: "get"
    });
}

// 获取著作列表
export function Api_GetOpusesList(params) {
    return request("/cms/opuses/page/", {
        method: "get",
	    params: params
    });
}

// 获取著作详情
export function Api_GetBooksDetail(params) {
    return request("/cms/opuses/" + params, {
        method: "get"
    });
}

// 获取对应用户文章列表
export function Api_GetMultipleArticleList(params) {
    return request('/cms/specialcolumn/multiple/page', {
        method: 'get',
        params: params
    })
}

// 获取对应用户文章列表
export function Api_GetArticleList(params) {
    return request('/cms/specialcolumn/page', {
        method: 'get',
        params: params
    })
}

// 查询问答分页列表
export function Api_GetAnswerPage(params) {
    return request('/cms/issue/answer/page', {
        method: 'get',
        params: params
    })
}

// 查询著作分页列表
export function Api_GetOpusesPage(params) {
    return request('/cms/opuses/page', {
        method: 'get',
        params: params
    })
}
