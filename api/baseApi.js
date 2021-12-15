import request from '@/utils/request.js'

// 发送手机短信，加图形验证码校验
export function Api_SendMsg(params) {
    return request('/app/user/send-message', {
        method: 'get',
        params: params
    })
}

// 上传图片
export function Api_UpImg(params) {
    return request('/fs/attachments/image/1', {
        method: 'post',
		// uni中不支持form格式
		header: {
			'Content-Type':'multipart/form-data'
		},
        params: params
    })
}


/**
 * 填写邀请码
 * @param {Object} params
 */
export function Api_SaveInvitationCode(params) {
    return request('/app/user/write-invitation-code', {
        method: 'get',
        params: params
    })
}

// 获取当前用户关注状态
export function Api_GetAttentionStatus(params) {
    return request('/cms/attention/'+ params.id, {
        method: 'get'
    })
}

/*
* 点赞
* @param {Object} params
*/
export function Api_LikeCount(params) {
    return request('/app/like/count', {
        method: 'get',
        params: params
    })
}
