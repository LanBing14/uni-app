import request from '@/utils/request.js'

// 推荐列表
export function Api_GetRecommendList(params) {
    return request("/cms/issue/recommend/page", {
        method: "get",
        params: params
    });
}

// 最新列表
export function Api_GetNewestList(params) {
    return request("/cms/issue/newest/page", {
        method: "get",
        params: params
    });
}

// 大家谈列表
export function Api_GetIdeaList(params) {
    return request("/cms/issue/forum/page", {
        method: "get",
        params: params
    });
}

// 添加观点
export function Api_GetIdeaAdd(params) {
    return request("/cms/issue/idea/add", {
        method: "post",
        params: params
    });
}
// 详情
export function Api_GeIdea(params) {
    return request("/cms/issue/idea/" + params.id , {
        method: "get",
        params: params
    });
}

// 问题详情
export function Api_GeIssue(params) {
    return request("/cms/issue/" + params.id , {
        method: "get",
        params: params
    });
}

// 关注/取消关注
// @params
// type: 0:专家 1:问题
export function Api_GetAttentionAdd(params) {
    return request("/cms/attention/add?businessId=" + params.businessId + "&type=" + params.type, {
        method: "post"
    });
}

// 添加问题
export function Api_GetIssueAdd(params) {
    return request("/cms/issue/add", {
        method: "post",
        params: params
    });
}

// 写回答
export function Api_GetIssueAnswer(params) {
    return request("/cms/issue/answer", {
        method: "post",
        params: params
    });
}


// 评论
export function Api_GetCommentSave(params) {
    return request("/app/comment/save", {
        method: "post",
        params: params
    });
}
// 删除评论
export function Api_DelComment(params) {
    return request("/app/comment/delete", {
        method: "get",
        params
    });
}
// 获取评论列表
export function Api_GetCommentPage(params) {
    return request("/app/comment/page", {
        method: "get",
        params: params
    });
}
//获取评论
export function Api_GetComment(params) {
    return request("/app/comment/detail", {
        method: "get",
        params: params
    });
}
// 获取评论
export function Api_GetReplyPage(params) {
    return request("/app/reply/page", {
        method: "get",
        params: params
    });
}

/* 点赞
 * @param businessId
 * @param userId
 * @param businessType 0:评论/回复 1:回答 2:文章 3:想法
 * */
export function Api_GetLikeSave(params) {
    return request("/app/like/save", {
        method: "get",
        params: params
    });
}

// 获取用户问答列表
export function Api_GetUserAnswerList(params) {
    return request("/cms/issue/answer/page", {
        method: "get",
        params: params
    });
}

// 获取某个问答
export function Api_GetAnswer(params) {
    return request("/cms/issue/answer/" + params.id, {
        method: "get",
        params: params
    });
}

// 我的想法分页列表
export function Api_GetMyIdeaPage(params) {
    return request("/cms/issue/idea/my/page", {
        method: "get",
        params: params
    });
}

// 我的问题分页列表
export function Api_GetMyIssuePage(params) {
    return request("/cms/issue/my/page", {
        method: "get",
        params: params
    });
}

// 获取当前想拉黑用户的屏蔽状态
export function Api_GetBlackStatus(params) {
    return request("/app/user/getBlackStatus", {
        method: "get",
        params: params
    });
}

// 拉黑用户
export function Api_Pullblack(params) {
    return request("/app/user/pullblack?userId=" + params.userId, {
        method: "post"
    });
}

// 删除
export function Api_DelItem(params, type) {
    return request("/cms/issue/" + type + "/" + params.id, {
        method: "delete"
    });
}

export function Api_DelAnswer(params) {
    return request("/cms/issue/answer?id=" + params.id, {
        method: "delete"
    });
}

// 删除想法
export function Api_DelIdea(params) {
    return request("/cms/issue/idea?id=" + params.id, {
        method: "delete"
    });
}