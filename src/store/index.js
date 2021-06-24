import { createStore } from 'vuex'
const store = createStore({
	state: {
		//用户信息
		userInfo: {
			userName: "",
			userIcon: "",
			isValidate: false,
			token: ""
		},
		thisdjs: "",
		menulists: [],
	},
	getters: {
		token: (state) => {
			return state.userInfo.token
		}
	},
	mutations: {
		updateUserInfo(state, user) {
			state.userInfo.userName = user.user.userName
			console.log(user.user.userName);
			state.userInfo.userIcon = user.user.userIcon
			state.userInfo.isValidate = true
			state.userInfo.token = user.token
			sessionStorage.setItem('state', JSON.stringify(state))
		},
		updatetime(state, djs) {
			state.thisdjs = djs.thisdjs
			sessionStorage.setItem('djs', state.thisdjs)
		},
		//角色菜单权限列表
		setmenulists(state, data) {
			sessionStorage.removeItem('menulists')
			state.menulists = data
			sessionStorage.setItem('menulists', JSON.stringify(data))
		},
	}
})
export default store