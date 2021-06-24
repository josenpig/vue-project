import store from "../store"
import { ElMessage } from 'element-plus'
export default (Vue) => {
    /**自定义按钮权限指令 */
    Vue.directive('has', {
        mounted(el, binding) {
            btnPermsArr = []
            importComponent(store.state.menulists)
            //获取按钮权限
            // if (btnPermsArr.indexOf(binding.value.action) == -1) {
            //     //移除不匹配的按钮
            //     el.parentNode.removeChild(el)
            // }
            el.addEventListener("click", () => {
                if (btnPermsArr.indexOf(binding.value.action) == -1) {
                    ElMessage.error('抱歉！你暂不具备该权限');
                    event.stopPropagation()
                }
            })
        },
    })
}
var btnPermsArr = []
//查询用户按钮权限
function importComponent(routerList) {
    routerList.forEach((route) => {
        if (route.menuType == "F") {
            btnPermsArr.push(route.perms)
        }
        if (route.childMenu && route.childMenu.length) {
            importComponent(route.childMenu)
        }
    })
}