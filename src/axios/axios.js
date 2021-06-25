import axios from 'axios';
import router from '../router';
import { ElMessage } from "element-plus";
//axios配置
axios.defaults.timeout = 8000;
axios.defaults.baseURL = 'http://127.0.0.1:8085';
//请求拦截http request拦截器
axios.interceptors.request.use(config => {
    if (localStorage.token) { //判断token是否存在
        config.headers.Authorization = localStorage.token;  //将token设置成请求头
    }
    return config;
}, err => {
    return Promise.reject(err)
}
)

//响应拦截http response拦截器
axios.interceptors.response.use(response => {
    var result = response.data;
    if (result.code == 700 && !result.success) {
        ElMessage.warning({
            message: "警告登录已失效!请重新登录!",
            type: "warning",
        });
        setTimeout(() => {
            router.push({ name: "Login" });
        }, 2000);
    } else if (result.code != 200) {
        ElMessage.error({
            message: '错误提示：' + response.data.code + "," + response.data.message + "请联系管理员！",
            type: "error",
        });
        console.log(response.data);
    }
    return response;
}, error => {
    console.log(error);
    return Promise.reject(error)
})

export default axios;