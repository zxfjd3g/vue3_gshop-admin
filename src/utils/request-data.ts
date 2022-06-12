import axios, { type AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';

/* 定义response对象的data接口 */
interface ResponseData<T> {
  code: number;
  data: T;
}

// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: '/mock',
	timeout: 50000,
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		return config;
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	async (response: AxiosResponse<ResponseData<any>>) => {
		return response.data.data;
	},

	(error) => {
		ElMessage.error('请求出错');
		return Promise.reject(error);
	}
);

export default service;
