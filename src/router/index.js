import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import LoginView from "../components/Login.vue"//登录
import HomePageView from "../components/HomePage.vue"//首页
import PersonalCenterView from "../components/personalCenter/PersonalCenter.vue"//个人中心
import messageNotificationView from "../components/personalCenter/messageNotification.vue"//通知中心
import store from "../store"
const routes = [
	{
		path: '/',
		redirect: '/Login',
	},
	// 登录
	{
		path: '/Login',
		name: 'Login',
		component: LoginView
	},
	// 首页导航
	{
		path: '/HomePage',
		name: 'HomePage',
		component: HomePageView,
		children: [
			//个人中心
		{
		path:'/PersonalCenter',
		name:'PersonalCenter',
		component : PersonalCenterView,
		},
		{
		path:'/messageNotification',
		name:'messageNotification',
		component : messageNotificationView,
		},
			]
	},
	
]
const router = createRouter({
	history: createWebHistory(),
	routes, // `routes: routes` 的缩写
})

//全局前置守卫，可用作前端权限验证的简单实现
router.beforeEach(function (to, from, next) {
	if ((to.name !== 'Login' && store.state == null)
		|| (to.name !== 'Login' && !store.state.userInfo.isValidate)
	) {
		next({ name: 'Login' })
	} else {
		if (to.path != "/Login") {
			sessionStorage.removeItem("djs")
		}
		//防止页面刷新路由丢失
		if (to.matched.length == 0) {
			initDynamicRoutes();
			next({ path: to.path })
		} else {
			next()
		}
	}
})

const modules = import.meta.glob('../components/**/*.vue');
// 动态添加路由
export function initDynamicRoutes() {
	//添加404页面
	router.addRoute({
		path: '/:pathMatch(.*)',
		component: () => import('../components/404.vue')
	})
	importComponent(store.state.menulists)
}
//添加子路由
function importComponent(routerList) {
	routerList.forEach((route) => {
		if (route.path != null) {
			let cpath = '../components/'+route.component
			const rouc = { path:route.path, name:route.name,component:modules[`${cpath}`]}
			router.addRoute('HomePage',rouc)
		}
		if (route.childMenu && route.childMenu.length) {
			importComponent(route.childMenu)
		}
	})
}
//输出router
export default router