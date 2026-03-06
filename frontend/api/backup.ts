/**
 * 备份管理 API
 */
import request from '@/utils/request';
import type {
  BackupCreateDTO,
  BackupRecordVO,
  BackupScheduleDTO,
  PageResult
} from '@/types';

/**
 * 备份列表
 */
export function getBackups(page = 1, limit = 20, status?: string) {
  return request.get<PageResult<BackupRecordVO>>('/api/v1/backups', { params: { page, limit, status } });
}

/**
 * 创建备份
 */
export function createBackup(data: BackupCreateDTO) {
  return request.post<BackupRecordVO>('/api/v1/backups', data);
}

/**
 * 删除备份
 */
export function deleteBackup(id: number) {
  return request.delete<void>(`/api/v1/backups/${id}`);
}

/**
 * 恢复备份
 */
export function restoreBackup(id: number) {
  return request.post<BackupRecordVO>('/api/v1/backups/${id}/restore', { });
}

/**
 * 备份计划列表
 */
export function getBackupSchedules(page = 1, limit = 20, enabled?: boolean) {
  return request.get<PageResult<BackupScheduleVO>>('/api/v1/backup-schedules', { params: { page, limit, enabled } });
}

/**
 * 创建备份计划
 */
export function createBackupSchedule(data: BackupScheduleDTO) {
  return request.post<BackupScheduleVO>('/api/v1/backup-schedules', data);
}

/**
 * 更新备份计划
 */
export function updateBackupSchedule(id: number, data: BackupScheduleDTO) {
  return request.put<BackupScheduleVO>('/api/v1/backup-schedules/${id}', data);
}

/**
 * 删除备份计划
 */
export function deleteBackupSchedule(id: number) {
  return request.delete<void>(`/api/v1/backup-schedules/${id}`);
}

export { getBackups, createBackup, deleteBackup, restoreBackup, getBackupSchedules, createBackupSchedule, updateBackupSchedule, deleteBackupSchedule } from './backup';
