/**
 * 审计日志 API
 */
import request from '@/utils/request';
import type {
  AuditQueryDTO,
  AuditLogVO,
  StatisticsResult
} from '@/types';

/**
 * 审计日志列表（分页）
 */
export function getLogs(params: AuditQueryDTO) {
  return request.get<{ data: AuditLogVO[], total: number }>(
    '/api/v1/audit/logs',
    { params }
  );
}

/**
 * 审计日志详情
 */
export function getLogById(id: number) {
  return request.get<AuditLogVO>(`/api/v1/audit/logs/${id}`);
}

/**
 * 操作统计
 */
export function getStatistics(startTime?: string, endTime?: string) {
  return request.get<StatisticsResult>(
    '/api/v1/audit/statistics',
    { params: { startTime, endTime } }
  );
}

export { getLogs, getLogById, getStatistics } from './audit';
