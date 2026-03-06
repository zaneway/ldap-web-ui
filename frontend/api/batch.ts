/**
 * 审批管理 API
 */
import request from '@/utils/request';
import type {
  BatchCreateDTO,
  BatchOperationVO
} from '@/types';

/**
 * 批量操作列表
 */
export function getBatchOperations(page?: number, limit?: number) {
  return request.get<{ data: BatchOperationVO[], total: number }>('/api/v1/batch', { page, limit });
}

/**
 * 批量操作详情
 */
export function getBatchOperation(id: string) {
  return request.get<{ data: BatchOperationVO }>('/api/v1/batch/${id}');
}

/**
 * 创建批量操作
 */
export function createBatch(data: BatchCreateDTO) {
  return request.post<{ data: BatchOperationVO }>('/api/v1/batch', data);
}

/**
 * 删除批量操作记录
 */
export function deleteBatchOperation(id: string) {
  return request.delete<null>('/api/v1/batch/${id}');
}

/**
 * 获取批量操作日志
 */
export function getBatchLogs(batchId: string) {
  return request.get<{ data: any[] }>('/api/v1/batch/${id}/logs');
}

export { getBatchOperations, createBatch, deleteBatch, getBatchLogs } from './batch';
