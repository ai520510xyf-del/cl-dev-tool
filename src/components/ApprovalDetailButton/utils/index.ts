/**
 * 审批组件工具函数
 */

import { TERMINAL_STATUSES } from '../constants';
import type {
  ApprovalStatus,
  DisplayStatus,
  TimelineData,
  ProcessedNode,
  CCNode,
  UnifiedTimelineNode,
} from '../types/approval.types';

/**
 * 判断审批状态是否为终态
 * @param status 审批状态（支持英文和中文状态）
 */
export function isTerminalStatus(
  status: ApprovalStatus | '已通过' | '已拒绝' | '已撤销' | '进行中'
): boolean {
  // 中文状态映射到英文状态
  const statusMap: Record<string, ApprovalStatus> = {
    已通过: 'APPROVED',
    已拒绝: 'REJECTED',
    已撤销: 'CANCELED',
    进行中: 'PENDING',
  };

  // 如果是中文状态，先转换为英文状态
  const normalizedStatus = statusMap[status] || (status as ApprovalStatus);

  return TERMINAL_STATUSES.includes(normalizedStatus);
}

/**
 * 将审批状态转换为显示状态
 * @param status 审批状态
 */
export function toDisplayStatus(status: ApprovalStatus): DisplayStatus {
  const statusLower = status.toLowerCase();
  if (statusLower === 'approved') {
    return 'approved';
  }
  if (statusLower === 'rejected') {
    return 'rejected';
  }
  return 'pending';
}

/**
 * 获取状态徽章类名
 * @param status 状态字符串（支持英文和中文）
 */
export function getStatusBadgeClass(status: string): string {
  const upperStatus = status.toUpperCase();
  if (
    upperStatus === 'APPROVED' ||
    status === '已完成' ||
    status === '已通过'
  ) {
    return 'approved';
  }
  if (upperStatus === 'REJECTED' || status === '已拒绝') {
    return 'rejected';
  }
  if (upperStatus === 'CANCELED' || status === '已撤销') {
    return 'canceled';
  }
  // PENDING, 审批中, 进行中
  return 'pending';
}

/**
 * 获取状态文本
 * @param status 状态字符串（支持英文和中文）
 */
export function getStatusText(status: string): string {
  const upperStatus = status.toUpperCase();
  if (
    upperStatus === 'APPROVED' ||
    status === '已完成' ||
    status === '已通过'
  ) {
    return '✓ 审批通过';
  }
  if (upperStatus === 'REJECTED' || status === '已拒绝') {
    return '✗ 审批拒绝';
  }
  if (upperStatus === 'CANCELED' || status === '已撤销') {
    return '⊘ 已撤销';
  }
  // PENDING, 审批中, 进行中
  return '⏳ 审批进行中';
}

/**
 * 获取节点徽章类名
 * @param status 节点状态
 * @param nodeType 节点类型
 */
export function getNodeBadgeClass(status: string, nodeType: string): string {
  if (nodeType === 'cc') return 'cc';
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  return 'pending';
}

/**
 * 获取节点徽章文本
 * @param status 节点状态
 * @param nodeType 节点类型
 */
export function getNodeBadgeText(status: string, nodeType: string): string {
  if (nodeType === 'cc') return '📧 已抄送';
  if (status === 'approved') return '✓ 已通过';
  if (status === 'rejected') return '✗ 已拒绝';
  return '⏳ 待处理';
}

/**
 * 格式化显示时间
 * @param time 时间字符串
 * @param type 节点类型
 */
export function formatDisplayTime(
  time?: string,
  type: 'completed' | 'pending' | 'cc' = 'completed'
): string {
  if (!time) {
    return type === 'pending' ? '等待中...' : '';
  }
  if (time === 'PENDING') {
    return '待处理';
  }
  return time;
}

/**
 * 规范化时间线节点：将 ProcessedNode 和 CCNode 转换为 UnifiedTimelineNode
 * @param timeline 时间线数据
 */
export function normalizeTimelineNodes(timeline: TimelineData): {
  completed: UnifiedTimelineNode[];
  pending: UnifiedTimelineNode[];
} {
  const completedNodes = timeline.completed || [];
  const ccNodes = timeline.cc || [];
  const pendingNodes = timeline.pending || [];

  // 合并已完成节点和抄送节点
  const allCompletedNodes: UnifiedTimelineNode[] = [
    ...completedNodes.map((node: ProcessedNode) => ({
      id: node.id,
      nodeName: node.nodeName,
      nodeType: 'completed' as const,
      approverName: node.approverName,
      approverDept: node.approverDept,
      time: node.time,
      status: node.status,
      comment: node.comment,
      isTimeClose: node.isTimeClose,
    })),
    ...ccNodes.map((node: CCNode) => ({
      id: node.id,
      nodeName: node.ccNodeName || '抄送',
      nodeType: 'cc' as const,
      approverName: node.ccPersonName,
      approverDept: node.ccPersonDept,
      time: '',
      ccTime: node.ccTime || '',
      status: 'cc' as const,
      comment: undefined,
      isTimeClose: false,
      ccNodeName: node.ccNodeName,
      ccPersonName: node.ccPersonName,
    })),
  ];

  // 按时间排序（最早的在前面）
  allCompletedNodes.sort((a, b) => {
    const timeA = new Date(a.time || a.ccTime || '').getTime();
    const timeB = new Date(b.time || b.ccTime || '').getTime();
    return timeA - timeB;
  });

  // 待审批节点
  const allPendingNodes: UnifiedTimelineNode[] = pendingNodes.map(
    (node: ProcessedNode) => ({
      id: node.id,
      nodeName: node.nodeName,
      nodeType: 'pending' as const,
      approverName: node.approverName,
      approverDept: node.approverDept,
      time: node.time,
      status: node.status,
      comment: node.comment,
      isTimeClose: node.isTimeClose,
    })
  );

  return { completed: allCompletedNodes, pending: allPendingNodes };
}
