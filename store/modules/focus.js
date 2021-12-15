import {
	Api_GetAttentionAdd
} from "@/api/faq.js";

const focus = {
	state: {
		id: '',
		isFocus: false
	},
	mutations: {
		SAVE_ISFOCUS: (state) => {
			state.isFocus = !state.isFocus
		},
		SAVE_ID: (state, id) => {
			state.id = id
		},
	},
	actions: {
		clickBtn({commit}) {
			commit('SAVE_ISFOCUS')
		},
		setId({commit}, id) {
			commit('SAVE_ID', id)
		}
	}
}

export default focus;
