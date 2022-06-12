import axios, { type AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import pinia from '@/stores/index';
import { useUserInfoStore } from '../stores/userInfo';

/* 定义response对象的data接口 */
interface ResponseData<T> {
  code: number;
  data: T;
  message: string;
}

// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: import.meta.env.VITE_API_URL as any,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
    const storeUserInfo = useUserInfoStore(pinia)
		// 在发送请求之前做些什么 token
		if (storeUserInfo.token) {
			(<any>config.headers).common['token'] = storeUserInfo.token;
		}
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
  /* 约束一下response */
	async (response: AxiosResponse<ResponseData<any>>) => {
		// 对响应数据做点什么
		const res = response.data;
		// if (res.code && res.code !== 0) {
    if (res.code !== 20000 && res.code !== 200) { /* 成功数据的code值为20000/200 */
      
      ElMessage({
        message: (typeof res.data=='string' && res.data) || res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

			// `token` 过期或者账号已在别处登录
			if (res.code === 401 || res.code === 4001) {
        const storeUserInfo = useUserInfoStore(pinia)
				await storeUserInfo.reset()
				window.location.href = '/'; // 去登录页
				ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
					.then(() => {})
					.catch(() => {});
			}
			return Promise.reject(service.interceptors.response);
		} else {
			// return response.data;
      return res.data; /* 返回成功响应数据中的data属性数据 */
		}
	},
	(error) => {
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			if (error.response.data) ElMessage.error(error.response.statusText);
			else ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);

// 导出 axios 实例
export default service;
