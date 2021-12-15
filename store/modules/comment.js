import {
	Api_LikeCount
} from '@/api/baseApi.js';
import {
	Api_GetLikeSave
} from '@/api/faq.js';
import {
	Api_GetCollectionStatus
} from '@/api/news.js';
import {
	Api_AddCollection,
	Api_GetMyCollectinsList
} from '@/api/userCenter.js';

const comment = {
	state: {
		likeCount: 0,
		likeStatus: '0',
		collectionCount: 0,
		collectionStatus: '0',
		commentCount: 0
	},
	mutations: {
		// 保存赞的状态
		SAVE_LIKE_STATUS: (state, status) => {
			state.likeStatus = status
		},
		// 保存赞的数量
		SAVE_LIKE_NUM: (state, num) => {
			state.likeCount = num
		},
		// 保存收藏的状态
		SAVE_COLLECTION_STATUS: (state, status) => {
			state.collectionStatus = status
		},
		// 保存收藏的数量
		SAVE_COLLECTION_NUM: (state, num) => {
			if (num === 'add') {
				state.collectionCount = state.collectionCount + 1
			} else {
				state.collectionCount = num
			}
		},
		// 保存评论的数量
		SAVE_COMMENT_NUM: (state, num) => {
			if (num === 'add') {
				state.commentCount = state.commentCount + 1
			} else {
				state.commentCount = num
			}
		}
	},
	actions: {
		// 获取赞的数量和状态
		getLikeStatus({commit}, id) {
			return new Promise((resolve, reject) => {
				Api_LikeCount({
					businessId: id
				}).then(res => {
					commit('SAVE_LIKE_STATUS', res.data.isLike?res.data.isLike: '1')
					commit('SAVE_LIKE_NUM', res.data.count)
					resolve(res)
				}).catch((err) => {
					reject(err)
				})
			})
		},
		likeIt({commit, dispatch}, {id, userId, type}) {
			// console.log({id, userId, type})
			Api_GetLikeSave({
				businessId: id,
				userId: userId,
				businessType: type, // 0:评论/回复 1:回答 2:文章 3:想法
			}).then(res => {
				if (res.statusCode === 1) {
					commit('SAVE_LIKE_STATUS', res.data)
					dispatch('getLikeStatus', id);
				}
			})
		},
		setCommentCount({commit}, num){
			commit('SAVE_COMMENT_NUM', num)
		},
		addCommentCount({commit}){
			commit('SAVE_COMMENT_NUM', 'add')
		},
		getCollection({commit}, id){
					console.log('id:'+id)
			Api_GetCollectionStatus({
					businessId: id
				}).then(res => {
				if (res.statusCode === 1) {
					console.log(res)
					commit('SAVE_COLLECTION_NUM', res.data.count)
					commit('SAVE_COLLECTION_STATUS', res.data.status?res.data.status: '1')
				}
			})
		},
		addCollection({commit, dispatch}, id){
			Api_AddCollection(id).then(res => {
				if (res.statusCode === 1) {
					dispatch('getCollection', id);
				}
			})
		}
	}
}

export default comment;
