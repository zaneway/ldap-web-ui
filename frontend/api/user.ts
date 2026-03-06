/**
 * 用户管理 API */
import request from '@/utils/request';
import type {
  UserQueryDTO,
  UserCreateDTO,
  UserUpdateDTO,
  UserVO,
  PageResult
} from '@/types';

/**
 * 用户列表（分页）
 */
export function getUsers(params: UserQueryDTO) {
  return request.get<PageResult<UserVO>>('/api/v1/users', { params });
}

/**
 * 搜索用户
 */
export function searchUsers(keyword: string) {
  return request.get<UserVO[]>('/api/v1/users/search', { params: { keyword } });
}

/**
 * 获取用户详情
 */
export function getUserByDn(dn: string) {
  return request.get<UserVO>(`/api/v1/users/${dn}`);
}

/**
 * 创建用户
 */
export function createUser(data: UserCreateDTO) {
  return request.post<UserVO>('/api/v1/users', data);
}

/**
 * 更新用户
 */
export function updateUser(dn: string, data: UserUpdateDTO) {
  return request.put<UserVO>(`/api/v1/users/${dn}`, data);
}

/**
 * 删除用户
 */
export function deleteUser(dn: string) {
  return request.delete(`/api/v1/users/${dn}`);
}

/**
 * 重置密码
 */
function resetPassword(dn: string, newPassword: string) {
  return request.post<void>(`/api/v1/users/${dn}/password/reset`, { newPassword });
}

/**
 * 导入用户
 */
function importUsers(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request.post<{ total: number; successCount: number; failedCount: number }>('/api/v1/users/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

/**
 * 导出用户
 */
export function exportUsers(dns: string[]) {
  return request.post<Blob>('/api/v1/users/export', { dns }, {
    responseType: 'blob'
  });
}

export { resetPassword, importUsers, exportUsers } from './user';
