import React from 'react';
import { Popover, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

interface InfoPopoverProps {
  title?: string;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
  trigger?: 'hover' | 'focus' | 'click';
  className?: string;
  style?: React.CSSProperties;
}

const InfoPopover: React.FC<InfoPopoverProps> = ({
  title = '参考信息',
  content,
  placement = 'rightBottom',
  trigger = 'click',
  className,
  style
}) => {
  return (
    <Popover
      content={content}
      title={title}
      trigger={trigger}
      placement={placement}
      overlayClassName="info-popover-overlay"
    >
      <Button
        type="text"
        icon={<InfoCircleOutlined />}
        size="small"
        className={`info-popover-trigger ${className || ''}`}
        style={{
          padding: '0px',
          height: 'auto',
          border: 'none',
          boxShadow: 'none',
          transition: 'color 0.3s ease',
          ...style
        }}
      />
    </Popover>
  );
};

export default InfoPopover;
