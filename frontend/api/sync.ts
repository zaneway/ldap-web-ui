/**
 * 主从同步 (Syncrepl) API
 */
import request from '@/utils/request';
import { CreateConsumerDTO, UpdateConsumerDTO, SyncReplConfigVO, SyncReplStatusVO } from '@/types';

/**
 * 消费者配置列表
 */
export function getConsumers() {
  return request.get<PageResult<SyncReplConfigVO>>('/api/v1/sync/consumers');
}

/**
 * 获取消费者配置详情
 */
export function getConsumerByDn(dn: string) {
  return request.get<SyncReplConfigVO>(`/api/v1/sync/consumers/${dn}`);
}

/**
 * 创建从节点配置
 */
export function createConsumer(data: CreateConsumerDTO) {
  return request.post<SyncReplConfigVO>('/api/v1/sync/consumers', data);
}

/**
 * 更新从节点
 */
export function updateConsumer(dn: string, data: UpdateConsumerDTO) {
  return request.put<SyncReplConfigVO>(`/api/v1/sync/consumers/${dn}`, data);
}

/**
 * 删除从节点配置
 */
export function deleteConsumer(dn: string) {
  return request.delete<void>(`/api/v1/sync/consumers/${dn}`);
}

/**
 * 获取同步状态
 */
export function getSyncStatus(dn: string) {
  return request.get<SyncReplStatusVO>(`/api/v1/sync/consumers/${dn}/status`);
}

/**
 * 触发立即刷新
 */
export function triggerRefresh(dn: string) {
  return request.post<SyncReplStatusVO>(`/api/v1/sync/consumers/${dn}/refresh`, {});
}
