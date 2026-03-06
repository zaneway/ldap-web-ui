/**
 * 通用 API 响应类型
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  limit: number
  pages: number
}
