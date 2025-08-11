import React, { useState } from 'react';
import { Table, Row, Col, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { BossData } from '../types';
import bossData from '../data/zh-CN/boss_data.json';

const BossDataView: React.FC = () => {
  const [filteredData] = useState<BossData[]>(bossData);

  // 行样式函数 - 普通隔行变色
  const getRowClassName = (record: BossData, index: number): string => {
    return index !== undefined && index % 2 === 0 ? 'table-row-even' : 'table-row-odd';
  };

  // 左侧表格列定义：血量 + 吸收
  const leftColumns: ColumnsType<BossData> = [
    {
      title: 'Boss名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      align: 'center',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '血量',
      children: [
        {
          title: '基础血量',
          dataIndex: 'baseHealth',
          key: 'baseHealth',
          width: 60,
          align: 'center',
          render: (value) => value.toLocaleString(),
        },
        {
          title: '永夜王血量加成',
          dataIndex: 'nightreignHealthMultiplier',
          key: 'nightreignHealthMultiplier',
          width: 120,
          align: 'center',
        },
      ],
    },
    {
      title: '吸收',
      children: [
        {
          title: '物理',
          children: [
                    {
          title: '普通',
          dataIndex: 'normalAbsorption',
          key: 'normalAbsorption',
          width: 60,
          align: 'center',
        },
            {
              title: '斩击',
              dataIndex: 'slashAbsorption',
              key: 'slashAbsorption',
              width: 60,
              align: 'center',
            },
            {
              title: '打击',
              dataIndex: 'strikeAbsorption',
              key: 'strikeAbsorption',
              width: 60,
              align: 'center',
            },
            {
              title: '突刺',
              dataIndex: 'pierceAbsorption',
              key: 'pierceAbsorption',
              width: 60,
              align: 'center',
            },
          ],
        },
        {
          title: '属性',
          children: [
            {
              title: '魔力',
              dataIndex: 'magicAbsorption',
              key: 'magicAbsorption',
              width: 60,
              align: 'center',
            },
            {
              title: '火焰',
              dataIndex: 'fireAbsorption',
              key: 'fireAbsorption',
              width: 60,
              align: 'center',
            },
            {
              title: '雷电',
              dataIndex: 'lightningAbsorption',
              key: 'lightningAbsorption',
              width: 60,
              align: 'center',
            },
            {
              title: '神圣',
              dataIndex: 'holyAbsorption',
              key: 'holyAbsorption',
              width: 60,
              align: 'center',
            },
          ],
        },
      ],
    },
  ];

  // 右侧表格列定义： + 韧性
  const rightColumns: ColumnsType<BossData> = [
    {
      title: 'Boss名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      align: 'center',
      ellipsis: true,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '基础韧性',
      dataIndex: 'basePoise',
      key: 'basePoise',
      width: 70,
      align: 'center',
    },
    {
      title: '抗性',
      children: [
        {
          title: '中毒',
          dataIndex: 'poisonResistance',
          key: 'poisonResistance',
          width: 60,
          align: 'center',
        },
        {
          title: '腐败',
          dataIndex: 'scarletRotResistance',
          key: 'scarletRotResistance',
          width: 60,
          align: 'center',
        },
        {
          title: '出血',
          dataIndex: 'bleedResistance',
          key: 'bleedResistance',
          width: 60,
          align: 'center',
        },
        {
          title: '咒死',
          dataIndex: 'deathBlightResistance',
          key: 'deathBlightResistance',
          width: 60,
          align: 'center',
        },
        {
          title: '冻伤',
          dataIndex: 'frostResistance',
          key: 'frostResistance',
          width: 60,
          align: 'center',
        },
        {
          title: '睡眠',
          dataIndex: 'sleepResistance',
          key: 'sleepResistance',
          width: 60,
          align: 'center',
        },
        {
          title: '发狂',
          dataIndex: 'madnessResistance',
          key: 'madnessResistance',
          width: 60,
          align: 'center',
        },
      ],
    },
  ];

  return (
    <div style={{ padding: '24px' }}>

      {/* 双表格布局 */}
      <Row gutter={16}>
        {/* 上方表格：血量 + 吸收 */}
        <Col span={24}>
          <Card 
            title={<span style={{ textAlign: 'center', fontSize: '16px' }}>💖 血量与吸收</span>}
            style={{ maxWidth: '1000px', margin: '0 auto' }}
          >
            <Table
              columns={leftColumns}
              dataSource={filteredData}
              rowKey="id"
              scroll={{ x: 800 }}
              pagination={false}
              size="small"
              bordered
              rowClassName={getRowClassName}
            />
          </Card>
        </Col>

        {/* 下方表格：抗性 + 韧性 */}
        <Col span={24}>
          <Card 
            title={<span style={{ textAlign: 'center', fontSize: '16px' }}>🛡️ 抗性与韧性</span>}
            style={{ maxWidth: '1000px', margin: '0 auto', marginTop: '24px' }}
          >
            <Table
              columns={rightColumns}
              dataSource={filteredData}
              rowKey="id"
              scroll={{ x: 600 }}
              pagination={false}
              size="small"
              bordered
              rowClassName={getRowClassName}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BossDataView;
