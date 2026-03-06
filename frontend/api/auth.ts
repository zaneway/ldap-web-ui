/**
 * 认证相关 API
 */
import request from '@/utils/request';
import type { LoginDTO, LoginVO } from '@/types/auth';
import type { ApiResponse } from '@/types/global';

/**
 * 用户登录
 */
export function login(data: LoginDTO) {
  return request.post<ApiResponse<LoginVO>>('/api/v1/auth/login', data);
}

/**
 * 刷新 Token
 */
export function refreshToken(refreshToken: string) {
  return request.post<ApiResponse<LoginVO>>('/api/v1/auth/refresh', { refreshToken: refreshToken });
}

/**
 * 用户登出
 */
export function logout() {
  return request.post<ApiResponse<null>>('/api/v1/auth/logout');
}

/**
 * 修改密码
 */
export function changePassword(data: { oldPassword: string; newPassword: string }) {
  return request.post<ApiResponse<null>>('/api/v1/auth/change-password', data);
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  return request.get<ApiResponse<any>>('/api/v1/auth/current');
}
