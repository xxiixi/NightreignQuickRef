import React, { useState } from 'react';
import { Tabs, Table, Typography, Space, Tag } from 'antd';
import type { TabsProps, TableColumnsType } from 'antd';
import outsiderEntries from './data/outsider_entries_zh-CN.json';
import './App.css';

const { Title, Text } = Typography;

// 定义数据接口
interface EntryData {
  entry_id: string;
  entry_name: string;
  entry_type: string | null;
  explanation: string | null;
  superposability: string | null;
}

// 可叠加性 Tag 配置
const getSuperposabilityTag = (superposability: string | null) => {
  if (!superposability) {
    return <Tag color="default">未知</Tag>;
  }
  
  switch (superposability) {
    case '相同词条可叠加':
      return <Tag color="success">可叠加</Tag>;
    case '相同词条不可叠加':
      return <Tag color="error">不可叠加</Tag>;
    case '叠加性未知':
      return <Tag color="warning">未知</Tag>;
    default:
      return <Tag color="default">不同"不甘"可以叠加</Tag>;
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('局外词条');

  // 表格列定义
  const columns: TableColumnsType<EntryData> = [
    {
      title: '词条ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: 120,
    },
    {
      title: '词条名称',
      dataIndex: 'entry_name',
      key: 'entry_name',
      width: 150,
    },
    {
      title: '词条类型',
      dataIndex: 'entry_type',
      key: 'entry_type',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: '解释',
      dataIndex: 'explanation',
      key: 'explanation',
      width: 300,
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: '可叠加性',
      dataIndex: 'superposability',
      key: 'superposability',
      width: 120,
      render: (text) => getSuperposabilityTag(text),
    },
  ];

  // 标签页配置
  const tabItems: TabsProps['items'] = [
    {
      key: '局外词条',
      label: '局外词条',
      children: (
        <Table
          columns={columns}
          dataSource={outsiderEntries as EntryData[]}
          rowKey="entry_id"
          pagination={{ 
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 900 }}
          size="middle"
        />
      ),
    },
    {
      key: '局内词条',
      label: '局内词条',
      children: <div>局内词条内容</div>,
    },
    {
      key: 'TODO 1',
      label: 'TODO 1',
      children: <div>TODO 1 内容</div>,
    },
    {
      key: 'TODO 2',
      label: 'TODO 2',
      children: <div>TODO 2 内容</div>,
    },
    {
      key: 'TODO 3',
      label: 'TODO 3',
      children: <div>TODO 3 内容</div>,
    },
  ];

  return (
    <div className="app-container">
        <div className="header">
          <Title level={1} className="main-title">
            nightreign reference notebook
          </Title>
          <Space direction="vertical" size="small" className="subtitle">
            <Text type="secondary" className="footer-text">
              based on version 1.0.0 | created by xxiixi
            </Text>
          </Space>
        </div>
      <div className="content-wrapper">

        
        <div className="tabs-container">
          <Tabs
            activeKey={activeTab}
            items={tabItems}
            onChange={setActiveTab}
            className="main-tabs"
          />
        </div>


      </div>
      <div className="footer">
          <Space direction="vertical" size="small" align="center">
            <Text type="secondary" className="footer-text">
              Check out the project or report an issue on{' '}
              <a 
                href="https://github.com/xxiixi/NightreignQuickRef" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Github
              </a>
            </Text>
          </Space>
        </div>
    </div>
  );
}

export default App;
