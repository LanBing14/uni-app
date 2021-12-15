const getters = {
	// 点赞
	likeCount: state => state.comment.likeCount,
	likeStatus: state => state.comment.likeStatus,
	// 收藏
	collectionCount: state => state.comment.collectionCount,
	collectionStatus: state => state.comment.collectionStatus,
	// 评论总数
	commentCount: state => state.comment.commentCount,
	// 是否点击关注
	isFocus: state => state.focus.isFocus,
	// 当前点击关注对象的id
	focusId: state => state.focus.id,
	// 当前登录用户信息
	userInfo: state => state.login.userInfo,
	isShowUserMenu: state => state.login.isShowUserMenu,
	blackInfo: state => state.login.blackInfo,
	// 未读消息数量
	unReadCount: state => state.login.unReadCount,
}
export default getters
