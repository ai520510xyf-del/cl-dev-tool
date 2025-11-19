import React from 'react';
import PropTypes from 'prop-types';
import type { UnifiedTimelineNode } from '../../types/approval.types';
import { LABEL_TEXT } from '../../constants';
import {
  formatDisplayTime,
  getNodeBadgeClass,
  getNodeBadgeText,
} from '../../utils';
import styles from './index.module.less';

export interface TimelineItemProps {
  /** 节点数据 */
  node: UnifiedTimelineNode;
  /** 是否是最后一个节点（用于隐藏连接线） */
  isLast: boolean;
  /** 节点类型（可选，默认使用 node.nodeType） */
  nodeType?: 'completed' | 'pending' | 'cc';
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  node,
  isLast,
  nodeType = node.nodeType,
}) => {
  const badgeClass = getNodeBadgeClass(node.status, nodeType);
  const badgeText = getNodeBadgeText(node.status, nodeType);
  const displayTime = formatDisplayTime(node.time || node.ccTime, nodeType);
  const labelText = node.status === 'cc' ? LABEL_TEXT.CC : LABEL_TEXT.APPROVER;

  return (
    <div className={`${styles.timelineNode} ${isLast ? styles.lastNode : ''}`}>
      <div className={`${styles.nodeDot} ${styles[nodeType]}`}></div>
      <div className={`${styles.nodeContent} ${styles[nodeType]}`}>
        <div className={styles.nodeHeader}>
          <div className={styles.nodeTitle}>
            <span>{node.nodeName}</span>
            <span className={`${styles.nodeBadge} ${styles[badgeClass]}`}>
              {badgeText}
            </span>
            {node.isTimeClose && (
              <span className={styles.timeCloseHint}>⚡ 几乎同时</span>
            )}
          </div>
          {displayTime && <div className={styles.nodeTime}>{displayTime}</div>}
        </div>
        <div className={styles.nodeInfo}>
          <div className={styles.nodeInfoRow}>
            <span className={styles.nodeInfoLabel}>{labelText}</span>
            <span>
              {node.approverName}
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

TimelineItem.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nodeName: PropTypes.string.isRequired,
    nodeType: PropTypes.oneOf(['completed', 'pending', 'cc'] as const)
      .isRequired,
    approverName: PropTypes.string.isRequired,
    approverDept: PropTypes.string,
    time: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['approved', 'rejected', 'pending', 'cc'] as const)
      .isRequired,
    comment: PropTypes.string,
    isTimeClose: PropTypes.bool,
  }).isRequired as PropTypes.Validator<UnifiedTimelineNode>,
  isLast: PropTypes.bool.isRequired,
  nodeType: PropTypes.oneOf(['completed', 'pending', 'cc'] as const),
};

export default TimelineItem;
