import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.less';

/**
 * CloseButton 组件
 * 关闭按钮组件，用于弹窗等场景
 */
export interface CloseButtonProps {
  /** 点击回调 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick, className }) => {
  return (
    <button
      className={`${styles.closeBtn} ${className || ''}`}
      onClick={onClick}
      aria-label="关闭"
    >
      ✕
    </button>
  );
};

// Props 校验：PropTypes + TypeScript 类型
CloseButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default CloseButton;
