/**
 * OU 管理 API */
import request from '@/utils/request';
import type { OuQueryDTO, OuCreateDTO, OuUpdateDTO } from '@/types';
import type {
  OuTreeNodeVO,
  OuVO,
  PageResult
} from '@/types';

/**
 * 获取 OU 树
 */
export function getOuTree(baseDn = 'dc=example,dc=com') {
  return request.get<{
    data: OuTreeNodeVO[]
  }>('/api/v1/ous/tree', { baseDn });
}

/**
 * OU 列表（分页）
 */
export function getOus(params: OuQueryDTO) {
  return request.get<{
    data: OuVO[]
  }>('/api/v1/ous', { params });
}

/**
 * 获取 OU 详情
 */
export function getOuByDn(dn: string) {
  return request.get<{
    data: OuVO
  }>('/api/v1/ous/${dn}`);
}

/**
 * 创建 OU
 */
export function createOu(data: OuCreateDTO) {
  return request.post<{
    data: OuVO
}>('/api/v1/ous', data);
}

/**
 * 更新 OU
 */
export function updateOu(dn: string, data: OuUpdateDTO) {
  return request.put<{
    data: OuVO
}>('/api/v1/ous/${dn}', data);
}

/**
 * 删除 OU
 */
export function deleteOu(dn: string, recursive = false) {
  return request.delete<{
    data: null
}>('/api/v1/ous/${dn}?recursive=${recursive}`);
}

/**
 * 批量删除 OU
 */
export function batchDeleteOus(dns: string[], recursive = false) {
  return request.post<{ data: { deletedCount: number } }>('/api/v1/ous/batch-delete', { dns, recursive });
}

export { getOuTree, getOus, getOuByDn, createOu, updateOu, deleteOu, batchDeleteOus } from './ou';
