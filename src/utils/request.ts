import { CustomResponse } from '@/types'
import axios, { AxiosRequestConfig } from 'axios'

const instance = axios.create({
    baseURL: '/api', // api base_url
    timeout: 6000, // 请求超时时间
})

const request = async <T>(
    config: AxiosRequestConfig
): Promise<CustomResponse<T>> => {
    const { data } = await instance.request<CustomResponse<T>>(config)
    data.code === 0
        ? console.log(data.msg) // 成功消息提示
        : console.error(data.msg) // 失败消息提示
    return data
}

// 请求拦截
instance.interceptors.request.use((config) => {
    return config
})

// 返回拦截
instance.interceptors.response.use((response) => {
    return response.data
})

export default request
