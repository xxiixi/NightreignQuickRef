import React from 'react';
import { Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface DataSourceTooltipProps {
  links: Array<{
    text: string;
    url: string;
  }>;
  className?: string;
  style?: React.CSSProperties;
}

const DataSourceTooltip: React.FC<DataSourceTooltipProps> = ({ 
  links,
  className = '', 
  style = {} 
}) => {
  const content = (
    <div style={{ maxWidth: '350px' }}>
      <div style={{ fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' }}>
        数据来源 🔗
      </div>
      <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
        {links.map((link, index) => (
          <div key={index} style={{ marginBottom: index < links.length - 1 ? '6px' : '0' }}>
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
              style={{ color: '#1890ff', textDecoration: 'none' }}
            >
              {link.text}
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      placement="bottomLeft"
      trigger="hover"
      mouseEnterDelay={0.5}
    >
      <QuestionCircleOutlined
        className={`data-source-icon ${className}`}
        style={{
          fontSize: '14px',
          color: '#8c8c8c',
          cursor: 'pointer',
          ...style
        }}
      />
    </Popover>
  );
};

export default DataSourceTooltip;
