import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import type { TimelineData } from '../../types/approval.types';
import { normalizeTimelineNodes } from '../../utils';
import TimelineItem from '../TimelineItem';
import styles from './index.module.less';

/**
 * ApprovalTimeline 组件
 * 显示完整的审批时间线（统一格式，按时间排序）
 */
export interface ApprovalTimelineProps {
  /** 时间线数据 */
  timeline: TimelineData;
}

const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({ timeline }) => {
  // 使用工具函数规范化时间线节点
  const unifiedNodes = useMemo(() => {
    return normalizeTimelineNodes(timeline);
  }, [timeline]);

  // 如果所有节点都为空，显示空状态
  if (
    unifiedNodes.completed.length === 0 &&
    unifiedNodes.pending.length === 0
  ) {
    return <div className={styles.emptyState}>暂无审批节点数据</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.unifiedTimeline}>
        {/* 已完成和抄送节点 */}
        {unifiedNodes.completed.map((node, index) => (
          <TimelineItem
            key={node.id}
            node={node}
            isLast={
              index === unifiedNodes.completed.length - 1 &&
              unifiedNodes.pending.length === 0
            }
            nodeType={node.nodeType}
          />
        ))}

        {/* 分隔线（如果有待审批节点） */}
        {unifiedNodes.pending.length > 0 &&
          unifiedNodes.completed.length > 0 && (
            <div className={styles.divider}>
              <span className={styles.dividerText}>以下为待审批节点</span>
            </div>
          )}

        {/* 待审批节点 */}
        {unifiedNodes.pending.map((node, index) => (
          <TimelineItem
            key={node.id}
            node={node}
            isLast={index === unifiedNodes.pending.length - 1}
            nodeType={node.nodeType}
          />
        ))}
      </div>

      {/* 底部说明 */}
      <div className={styles.footerNote}>
        * 审批节点按时间顺序排列
        <br />* 时间接近的节点可能为并行审批或快速连续审批
      </div>
    </div>
  );
};

// Props 校验：PropTypes + TypeScript 类型
ApprovalTimeline.propTypes = {
  timeline: PropTypes.shape({
    completed: PropTypes.array.isRequired,
    pending: PropTypes.array.isRequired,
    cc: PropTypes.array.isRequired,
  }).isRequired as PropTypes.Validator<TimelineData>,
};

export default ApprovalTimeline;
