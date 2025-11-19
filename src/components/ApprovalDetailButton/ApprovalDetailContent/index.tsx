import React, { useMemo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useApprovalData } from '../hooks/useApprovalData';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { LABEL_TEXT } from '../constants';
import {
  isTerminalStatus,
  getStatusBadgeClass,
  getStatusText,
  getNodeBadgeClass,
  getNodeBadgeText,
  formatDisplayTime,
  normalizeTimelineNodes,
} from '../utils';
import Skeleton from '../common/Skeleton';
import ErrorState from '../common/ErrorState';
import CloseButton from '../common/CloseButton';
import type {
  TimelineData,
  ProcessedNode,
  CCNode,
  ArrayTimelineItem,
  UnifiedTimelineNode,
} from '../types/approval.types';
import styles from './index.module.less';

/**
 * ApprovalDetailContent 组件
 * 审批详情内容组件
 */
export interface ApprovalDetailContentProps {
  /** 审批实例 code */
  code: string;
  /** 系统 code */
  systemCode: string;
  /** 系统密钥 */
  systemKey: string;
  /** 错误回调 */
  onError?: (error: Error) => void;
  /** 关闭回调 */
  onClose?: () => void;
}

const ApprovalDetailContent: React.FC<ApprovalDetailContentProps> = ({
  code,
  systemCode,
  systemKey,
  onError,
  onClose,
}) => {
  const { data, loading, error, refetch } = useApprovalData(
    code,
    systemCode,
    systemKey
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  // 规范化 timeline 数据：兼容数组和对象两种格式
  const normalizedTimeline = useMemo<TimelineData>(() => {
    if (!data?.timeline) {
      return { completed: [], pending: [], cc: [] };
    }

    // 如果是数组格式，需要转换为对象格式
    if (Array.isArray(data.timeline)) {
      const completed: ProcessedNode[] = [];
      const pending: ProcessedNode[] = [];
      const cc: CCNode[] = [];

      data.timeline.forEach((item: ArrayTimelineItem) => {
        const nodeName = item.name || item.nodeName || '未知节点';
        const approverName =
          item.user || item.approverName || item.approver || '未知';
        const time = item.time || item.timestamp || '';
        const hasTime = Boolean(time); // 有 time 字段说明已完成

        // 根据 type 和 status 字段分类
        if (item.type === 'cc') {
          // CC 类型
          cc.push({
            id: item.id,
            ccNodeName: nodeName,
            ccPersonName: approverName,
            ccPersonDept: item.dept || item.approverDept,
            ccTime: time,
          });
        } else if (item.status === 'approved' || item.status === 'rejected') {
          // 已完成的状态（优先判断 status）
          completed.push({
            id: item.id,
            nodeName: nodeName,
            approverName: approverName,
            approverDept: item.dept || item.approverDept,
            time: time,
            status: item.status === 'approved' ? 'approved' : 'rejected',
            comment: item.comment,
            nodeType: 'APPROVAL',
          });
        } else if (item.status === 'pending') {
          // 待处理的状态
          pending.push({
            id: item.id,
            nodeName: nodeName,
            approverName: approverName,
            approverDept: item.dept || item.approverDept,
            time: time || 'PENDING',
            status: 'pending',
            comment: item.comment,
            nodeType: 'APPROVAL',
          });
        } else if (hasTime) {
          // 有 time 字段说明已完成（数组格式通常只有 type，没有 status）
          completed.push({
            id: item.id,
            nodeName: nodeName,
            approverName: approverName,
            approverDept: item.dept || item.approverDept,
            time: time,
            status: 'approved',
            comment: item.comment,
            nodeType: 'APPROVAL',
          });
        } else if (item.type === 'submit' || item.status === 'completed') {
          // submit 类型或已完成，放入 completed
          completed.push({
            id: item.id,
            nodeName: nodeName,
            approverName: approverName,
            approverDept: item.dept || item.approverDept,
            time: time,
            status: 'approved',
            comment: item.comment,
            nodeType: 'APPROVAL',
          });
        } else {
          // 没有 time 字段，可能是待处理，放入 pending
          pending.push({
            id: item.id,
            nodeName: nodeName,
            approverName: approverName,
            approverDept: item.dept || item.approverDept,
            time: time || 'PENDING',
            status: 'pending',
            comment: item.comment,
            nodeType: 'APPROVAL',
          });
        }
      });

      return { completed, pending, cc };
    }

    // 如果已经是对象格式，直接返回
    return {
      completed: data.timeline.completed || [],
      pending: data.timeline.pending || [],
      cc: data.timeline.cc || [],
    };
  }, [data]);

  // 判断是否应该自动刷新
  const shouldAutoRefresh = useMemo(() => {
    if (!data) return false;

    const isTerminalState = isTerminalStatus(data.header.status);
    const noPendingNodes = normalizedTimeline.pending.length === 0;

    return !(isTerminalState && noPendingNodes);
  }, [data, normalizedTimeline]);

  // 合并标题:审批详情 - 【审批流程名称】
  const pageTitle = useMemo(
    () => (data ? `审批详情 - ${data.header.approvalName}` : '审批详情'),
    [data]
  );

  const handleRefetch = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  useAutoRefresh(shouldAutoRefresh, handleRefetch);

  // 错误处理
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // 渲染时间线节点
  const renderTimelineNode = (
    node: UnifiedTimelineNode,
    type: 'completed' | 'pending' | 'cc'
  ) => {
    const displayTime = formatDisplayTime(node.time || node.ccTime, type);
    const displayNodeName =
      type === 'cc'
        ? node.ccNodeName || node.nodeName || '抄送'
        : node.nodeName || '未知节点';
    const displayPersonName = node.approverName || node.ccPersonName || '未知';
    const badgeClass = getNodeBadgeClass(node.status, type);
    const badgeText = getNodeBadgeText(node.status, type);

    return (
      <div key={`${type}-${node.id}`} className={styles.timelineNode}>
        <div className={`${styles.nodeDot} ${styles[type]}`}></div>
        <div className={`${styles.nodeContent} ${styles[type]}`}>
          <div className={styles.nodeHeader}>
            <div className={styles.nodeTitle}>
              <span>{displayNodeName}</span>
              <span className={`${styles.nodeBadge} ${styles[badgeClass]}`}>
                {badgeText}
              </span>
              {node.isTimeClose && (
                <span className={styles.timeCloseHint}>⚡ 几乎同时</span>
              )}
            </div>
            <div className={styles.nodeTime}>{displayTime}</div>
          </div>
          <div className={styles.nodeInfo}>
            <div className={styles.nodeInfoRow}>
              <span className={styles.nodeInfoLabel}>
                {type === 'cc' ? LABEL_TEXT.CC : LABEL_TEXT.APPROVER}
              </span>
              <span>
                {displayPersonName}
                {node.approverDept && ` (${node.approverDept})`}
              </span>
            </div>
          </div>
          {node.comment && (
            <div className={styles.nodeComment}>{node.comment}</div>
          )}
        </div>
      </div>
    );
  };

  // 渲染分隔线
  const renderDivider = () => (
    <div className={styles.dividerLine}>
      <span className={styles.dividerText}>以下为待审批节点</span>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.wrapper}>
        {onClose && <CloseButton onClick={onClose} />}
        <div className={styles.loadingContainer}>
          <Skeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        {onClose && <CloseButton onClick={onClose} />}
        <div className={styles.errorContainer}>
          <ErrorState message={error.message} onRetry={refetch} />
        </div>
      </div>
    );
  }

  if (!data) return null;

  // 使用工具函数规范化时间线节点
  const { completed: allCompletedNodes, pending: allPendingNodes } =
    normalizeTimelineNodes(normalizedTimeline);

  const statusBadgeClass = getStatusBadgeClass(data.header.status);
  const statusText = getStatusText(data.header.status);

  return (
    <div className={styles.wrapper}>
      {onClose && <CloseButton onClick={onClose} />}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>{pageTitle}</h1>
          <button
            className={styles.refreshButton}
            onClick={handleRefetch}
            disabled={isRefreshing}
            title="刷新数据"
          >
            {isRefreshing ? '🔄' : '↻'}
          </button>
        </div>
        <div className={styles.headerInfo}>
          {(data.header.serialNumber || data.header.instanceId) && (
            <div className={styles.headerInfoItem}>
              <span className={styles.headerInfoLabel}>申批单号:</span>
              <span className={styles.headerInfoValue}>
                {data.header.serialNumber || data.header.instanceId}
              </span>
            </div>
          )}
          <div className={styles.headerInfoItem}>
            <span className={styles.headerInfoLabel}>申请人:</span>
            <span className={styles.headerInfoValue}>
              {data.header.applicant}
            </span>
          </div>
          <div className={styles.headerInfoItem}>
            <span className={styles.headerInfoLabel}>申请时间:</span>
            <span className={styles.headerInfoValue}>
              {data.header.applyTime}
            </span>
          </div>
          <div className={styles.headerInfoItem}>
            <span className={styles.headerInfoLabel}>状态:</span>
            <span
              className={`${styles.headerStatusBadge} ${styles[statusBadgeClass]}`}
            >
              {statusText}
            </span>
          </div>
        </div>
      </div>

      {/* 统一时间线 */}
      <div className={styles.container}>
        <div className={styles.unifiedTimeline}>
          {allCompletedNodes.length === 0 && allPendingNodes.length === 0 ? (
            <div className={styles.emptyState}>暂无审批节点数据</div>
          ) : (
            <>
              {/* 已完成和抄送节点 */}
              {allCompletedNodes.map(node =>
                renderTimelineNode(node, node.nodeType)
              )}

              {/* 分隔线（如果有待审批节点） */}
              {allPendingNodes.length > 0 &&
                allCompletedNodes.length > 0 &&
                renderDivider()}

              {/* 待审批节点 */}
              {allPendingNodes.map(node => renderTimelineNode(node, 'pending'))}
            </>
          )}
        </div>

        {/* 底部说明 */}
        <div className={styles.footerNote}>
          * 审批节点按时间顺序排列
          <br />* 时间接近的节点可能为并行审批或快速连续审批
        </div>
      </div>
    </div>
  );
};

// Props 校验：PropTypes + TypeScript 类型
ApprovalDetailContent.propTypes = {
  code: PropTypes.string.isRequired,
  systemCode: PropTypes.string.isRequired,
  systemKey: PropTypes.string.isRequired,
  onError: PropTypes.func,
  onClose: PropTypes.func,
};

export default ApprovalDetailContent;
