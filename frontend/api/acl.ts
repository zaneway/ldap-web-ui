/**
 * LDAP 权限 (ACI/ACL) API */
import request from '@/utils/request';
import type { AclCreateDTO, AclEntryVO, AclPreviewVO, PageResult } from '@/types';

/**
 * 列出指定 DN 下的 ACI
 */
export function listAcl(baseDn?: string) {
  return request.get<PageResult<AclEntryVO>>(
    '/api/v1/acl',
    { params: { baseDn } }
  );
}

/**
 * 获取单条 ACI
 */
export function getAcl(entryDn: string, aciName: string) {
  return request.get<AclEntryVO>(`/api/v1/acl`, {
    params: { entryDn, aciName }
  });
}

/**
 * 创建/添加 ACI
 */
export function createAcl(data: AclCreateDTO) {
  return request.post<AclEntryVO>('/api/v1/acl', data);
}

/**
 * 更新指定条目的 ACI
 */
export function updateAcl(entryDn: string, aciName: string, data: AclUpdateDTO) {
  return request.put<AclEntryVO>(`/api/v1/acl/${encodeURIComponent(entryDn)}`, data);
}

/**
 * 删除指定 ACI
 */
export function deleteAcl(entryDn: string, aciName: string) {
  return request.delete<void>(`/api/v1/acl/${encodeURIComponent(entryDn)}?aciName=${aciName}`);
}

/**
 * 解析并预览 ACI 语义
 */
export function previewAcl(aciString: string) {
  return request.post<AclPreviewVO>('/api/v1/acl/preview', { aciString });
}

/**
 * 将 ACI 应用到子树
 */
export function applyAclToSubtree(data: { baseDn: string; aciString: string }) {
  return request.post<{ appliedCount: number }>('/api/v1/acl/apply-subtree', data);
}

export { listAcl, getAcl, createAcl, updateAcl, deleteAcl, previewAcl, applyAclToSubtree } from './acl';
