import { useState } from 'react';
import { Tabs, Table, Typography, Space, Tag, Button } from 'antd';
import type { TabsProps, TableColumnsType } from 'antd';
import { geekblue } from '@ant-design/colors';
import { BulbOutlined, BulbFilled, GlobalOutlined } from '@ant-design/icons';
import outsiderEntries from './data/outsider_entries_zh-CN.json';
import talismanEntries from './data/talisman_entries_zh-CN.json';
import inGameEntries from './data/in-game_entries_zh-CN.json';
import './App.css';

const { Title, Text } = Typography;

// 定义数据接口
interface EntryData {
  entry_id: string;
  entry_name: string;
  entry_type?: string | null;
  explanation: string | null;
  superposability?: string | null
  talisman?: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('局外词条');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);

  // 局外词条表格列定义
  const outsiderColumns: TableColumnsType<EntryData> = [
    {
      title: '词条名称',
      dataIndex: 'entry_name',
      key: 'entry_name',
      width: 150,
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
      title: '词条类型',
      dataIndex: 'entry_type',
      key: 'entry_type',
      width: 50,
      render: (text) => text || '-',
    },
    {
      title: '可叠加性',
      dataIndex: 'superposability',
      key: 'superposability',
      width: 55,
      render: (text) => text || '-',
    },
    {
      title: '词条ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: 50,
    },
  ];

  // 护符词条表格列定义
  const talismanColumns: TableColumnsType<EntryData> = [
    {
      title: '护符',
      dataIndex: 'talisman',
      key: 'talisman',
      width: 100,
      render: (text) => text || '-',
    },
    {
      title: '词条名称',
      dataIndex: 'entry_name',
      key: 'entry_name',
      width: 150,
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
      title: '词条ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: 50,
    },
  ];

  // 局内词条表格列定义
  const inGameColumns: TableColumnsType<EntryData> = [

    {
      title: '词条名称',
      dataIndex: 'entry_name',
      key: 'entry_name',
      width: 150,
    },
    {
      title: '解释',
      dataIndex: 'explanation',
      key: 'explanation',
      width: 400,
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: '词条ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: 50,
    },
  ];

  // 标签页配置
  const tabItems: TabsProps['items'] = [
    {
      key: '局外词条',
      label: '局外词条',
      children: (
        <Table
          columns={outsiderColumns}
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
      key: '护符词条',
      label: '护符词条',
      children: (
        <Table
          columns={talismanColumns}
          dataSource={talismanEntries as EntryData[]}
          rowKey="entry_id"
          pagination={{ 
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 800 }}
          size="middle"
        />
      ),
    },
    {
      key: '局内词条',
      label: '局内词条',
      children: (
        <Table
          columns={inGameColumns}
          dataSource={inGameEntries as EntryData[]}
          rowKey="entry_id"
          pagination={{ 
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 700 }}
          size="middle"
        />
      ),
    },
  ];

  return (
    <div className="app-container">
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="top-bar-left">
            {/* 左侧可以放置其他内容 */}
          </div>
          <div className="top-bar-right">
            <Space size="middle">
              <Button
                type="text"
                icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="theme-toggle-btn"
              />
              <Button
                type="text"
                icon={<GlobalOutlined />}
                onClick={() => setIsEnglish(!isEnglish)}
                className="language-toggle-btn"
              />
            </Space>
          </div>
        </div>
      </div>

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
