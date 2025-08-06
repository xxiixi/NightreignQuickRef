import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

interface OtherFunctionViewProps {
  functionName: string;
}

const OtherFunctionView: React.FC<OtherFunctionViewProps> = ({ functionName }) => {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <Title level={3}>{functionName}</Title>
      <Text type="secondary">此功能正在开发中...</Text>
    </div>
  );
};

export default OtherFunctionView; 