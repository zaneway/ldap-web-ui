/**
 * 审批管理 API
 */
import request from '@/utils/request';
import { ApprovalCreateDTO, ApprovalActionDTO, PageResult, ApprovalVO } from '@/types';

/**
 * 待审批列表
 */
export function getPendingApprovals(page?: number, limit?: number) {
  return request.get<PageResult<ApprovalVO>>(
    '/api/v1/approvals/pending',
    { params: { page, limit } }
  );
}

/**
 * 审批历史
 */
export function getApprovalHistory(page?: number, limit?: number, status?: string) {
  return request.get<PageResult<ApprovalVO>>(
    '/api/v1/approvals/history',
    { params: { page, limit, status } }
  );
}

/**
 * 获取审批详情
 */
export function getApprovalById(id: string) {
  return request.get<ApprovalVO>(
    `/api/v1/approvals/${id}`
  );
}

/**
 * 创建审批
 */
export function createApproval(data: ApprovalCreateDTO) {
  return request.post<ApprovalVO>(
    '/api/v1/approvals',
    { data }
  );
}

/**
 * 审批通过
 */
export function approveApproval(id: string, data: ApprovalActionDTO) {
  return request.post<ApprovalVO>(
    `/api/v1/approvals/${id}/approve`,
    { data }
  );
}

/**
 * 审批拒绝
 */
export function rejectApproval(id: string, reason: string) {
  return request.post<ApprovalVO>(
    `/api/v1/approvals/${id}/reject`,
    { data: { reason } }
  );
}

export { getPendingApprovals, getApprovalHistory, createApproval, approve, reject } from './approval';
