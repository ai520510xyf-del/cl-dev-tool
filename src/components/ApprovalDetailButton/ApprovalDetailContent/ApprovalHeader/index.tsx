import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import type { ApprovalHeader as ApprovalHeaderType } from '../../types/approval.types';
import { toDisplayStatus } from '../../utils';
import StatusBadge from '../../common/StatusBadge';
import styles from './index.module.less';

/**
 * ApprovalHeader 组件
 * 显示审批头部信息
 */
export interface ApprovalHeaderProps {
  /** 审批头部数据 */
  header: ApprovalHeaderType;
}

const ApprovalHeader: React.FC<ApprovalHeaderProps> = ({ header }) => {
  const displayStatus = useMemo(() => {
    // 处理中文状态
    const statusMap: Record<string, 'approved' | 'rejected' | 'pending'> = {
      已通过: 'approved',
      已拒绝: 'rejected',
      已撤销: 'pending',
      进行中: 'pending',
    };

    if (statusMap[header.status]) {
      return statusMap[header.status];
    }

    return toDisplayStatus(
      header.status as
        | 'PENDING'
        | 'APPROVED'
        | 'REJECTED'
        | 'CANCELED'
        | 'DELETED'
    );
  }, [header.status]);

  return (
    <div className={styles.container}>
      {header.serialNumber && (
        <div className={styles.serialNumber}>
          审批单号: {header.serialNumber}
        </div>
      )}
      <div className={styles.info}>
        <div className={styles.infoItem}>
          <span className={styles.label}>申请人:</span>
          <span className={styles.value}>
            {header.applicant}
            {header.applicantDept && ` (${header.applicantDept})`}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>申请时间:</span>
          <span className={styles.value}>{header.applyTime}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>状态:</span>
          <StatusBadge status={displayStatus} />
        </div>
      </div>
    </div>
  );
};

// Props 校验：PropTypes + TypeScript 类型
ApprovalHeader.propTypes = {
  header: PropTypes.shape({
    instanceId: PropTypes.string.isRequired,
    approvalName: PropTypes.string.isRequired,
    serialNumber: PropTypes.string,
    applicant: PropTypes.string.isRequired,
    applicantDept: PropTypes.string,
    applyTime: PropTypes.string.isRequired,
    status: PropTypes.oneOf([
      'PENDING',
      'APPROVED',
      'REJECTED',
      'CANCELED',
      'DELETED',
    ]).isRequired,
  }).isRequired as PropTypes.Validator<ApprovalHeaderType>,
};

export default ApprovalHeader;
