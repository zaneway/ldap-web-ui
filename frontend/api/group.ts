/**
 * 组管理 API */
import request from '@/utils/request';
import type {
  GroupQueryDTO,
  GroupCreateDTO,
  GroupUpdateDTO,
  PageResult,
  GroupVO
} from '@/types/global';

/**
 * 组列表（分页）
 */
export function getGroups(params: GroupQueryDTO) {
  return request.get<PageResult<GroupVO>>('/api/v1/groups', { params });
}

/**
 * 获取组详情
 */
export function getGroup(dn: string) {
  return request.get<GroupVO>(`/api/v1/groups/${dn}`);
}

/**
 * 创建组
 */
export function createGroup(data: GroupCreateDTO) {
  return request.post<GroupVO>('/api/v1/groups', data);
}

/**
 * 更新组
 */
export function updateGroup(dn: string, data: GroupUpdateDTO) {
  return request.put<GroupVO>(`/api/v1/groups/${dn}`, data);
}

/**
 * 删除组
 */
export function deleteGroup(dn: string) {
  return request.delete<void>(`/api/v1/groups/${dn}`);
}

/**
 * 添加成员
 */
export function addMembers(groupDn: string, memberDns: string[]) {
  return request.post<void>(`/api/v1/groups/${groupDn}/members`, { memberDns });
}

/**
 * 移除成员
 */
export function removeMembers(groupDn: string, memberDns: string[]) {
  return request.delete<void>(`/api/v1/groups/${groupDn}/members`, { memberDns });
}
