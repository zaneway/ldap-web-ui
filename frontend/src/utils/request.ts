import axios from 'axios'

export const request = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// 阶段二：添加 JWT 拦截器
// request.interceptors.request.use(config => { ... })
// request.interceptors.response.use(...)
