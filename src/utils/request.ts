import axios from 'axios'

const instance = axios.create({
    baseURL: '/api', // api base_url
    timeout: 6000, // 请求超时时间
})

// 请求拦截
instance.interceptors.request.use((config) => {
    return config
})

// 返回拦截
instance.interceptors.response.use((response) => {
    return response.data
})

export default instance
