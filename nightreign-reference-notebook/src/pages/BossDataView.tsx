import React, { useState } from 'react';
import { Table, Row, Col, Card, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { BossData } from '../types';
import bossData from '../data/zh-CN/boss_data.json';
import '../styles/bossDataView.css';

// 导入boss图片
import nightOfTheBeast from '../assets/BossRelics/night-of-the-beast.avif';
import darkNightOfTheBaron from '../assets/BossRelics/dark-night-of-the-baron.avif';
import nightOfTheWise from '../assets/BossRelics/night-of-the-wise.avif';
import nightOfTheChampion from '../assets/BossRelics/night-of-the-champion.avif';
import nightOfTheDemon from '../assets/BossRelics/night-of-the-demon.avif';
import nightOfTheFathom from '../assets/BossRelics/night-of-the-fathom.avif';
import nightOfTheMiasma from '../assets/BossRelics/night-of-the-miasma.avif';
import nightOfTheLord from '../assets/BossRelics/night-of-the-lord.avif';

// 导入Negations图片
import standardDamage from '../assets/Negations/standard-damage-damage-type-elden-ring-nightreign-wiki-guide.png';
import slashDamage from '../assets/Negations/slash-damage-damage-type-elden-ring-nightreign-wiki-guide.png';
import strikeDamage from '../assets/Negations/strike-damage-damage-type-elden-ring-nightreign-wiki-guide.png';
import pierceDamage from '../assets/Negations/pierce-damage-damage-type-elden-ring-nightreign-wiki-guide.png';
import magicDamage from '../assets/Negations/magic-upgrade-affinity-elden-ring-nightreign-wiki-guide.png';
import fireDamage from '../assets/Negations/fire-upgrade-affinity-elden-ring-nightreign-wiki-guide.png';
import lightningDamage from '../assets/Negations/lightning-upgrade-affinity-elden-ring-nightreign-wiki-guide.png';
import holyDamage from '../assets/Negations/holy-upgrade-affinity-elden-ring-nightreign-wiki-guide.png';

// 导入Resistances图片
import poisonResistance from '../assets/Resistances/poison-status-effect-elden-ring-nightreign-wiki-guide-100px.png';
import scarletRotResistance from '../assets/Resistances/scarlet-rot-status-effect-elden-ring-nightreing-wiki-guide-100px.png';
import bleedResistance from '../assets/Resistances/hemorrhage-status-effect-elden-ring-nightreign-wiki-guide-100px.png';
import frostResistance from '../assets/Resistances/frostbite-status-effect-elden-ring-nightreign-wiki-guide-100px.png';
import sleepResistance from '../assets/Resistances/sleep-status-effect-elden-ring-nightreign-wiki-guide-100px.png';
import madnessResistance from '../assets/Resistances/madness-status-effect-elden-ring-nightreign-wiki-guide-100px.png';
import deathBlightResistance from '../assets/Resistances/blight_status_effect_elden_ring_wiki_guide_100px.png';

const BossDataView: React.FC = () => {
  const [filteredData] = useState<BossData[]>(bossData);

  // Boss名称到图片的映射
  const bossImageMap: { [key: string]: string } = {
    '"黑夜野兽"格拉狄乌斯': nightOfTheBeast,
    '"黑夜之爵"艾德雷': darkNightOfTheBaron,
    '"黑夜之智"格诺斯塔': nightOfTheWise,
    '"坚盾"弗堤士': nightOfTheWise,
    '"超越之光"亚尼姆斯': nightOfTheWise,
    '"深海黑夜"玛丽斯': nightOfTheFathom,
    '"黑夜雾霾"卡莉果': nightOfTheMiasma,
    '"黑夜王"布德奇冥': nightOfTheLord,
    '"黑夜之魔"利普拉': nightOfTheDemon,
    '"黑夜光骑士"弗格尔': nightOfTheChampion,
    '黑夜轮廓': nightOfTheLord,
  };



  const defaultFooter = () => (
    <div className="footer-text">
      夜王血量计算：基础血量 × 3.54 × 玩家人数（永夜王需要再乘以对应血量加成）
    </div>
  );

  // 左侧表格列定义：血量 + 吸收
  const leftColumns: ColumnsType<BossData> = [
    {
      title: '图片',
      key: 'image',
      width: 42,
      align: 'center',
      render: (_, record) => {
        const imageSrc = bossImageMap[record.name];
        return imageSrc ? (
          <Image
            src={imageSrc}
            alt={record.name}
            width={40}
            height={40}
            className="boss-image"
            preview={false}
          />
        ) : null;
      },
      onCell: (record) => {
        // 找到相同图片的下一个boss的索引
        const currentIndex = filteredData.findIndex(item => item.name === record.name);
        const currentImage = bossImageMap[record.name];
        
        if (!currentImage) return {};
        
        // 计算相同图片的行数
        let rowSpan = 1;
        for (let i = currentIndex + 1; i < filteredData.length; i++) {
          if (bossImageMap[filteredData[i].name] === currentImage) {
            rowSpan++;
          } else {
            break;
          }
        }
        
        // 如果是相同图片组的第一行，设置rowSpan
        if (currentIndex === 0 || bossImageMap[filteredData[currentIndex - 1].name] !== currentImage) {
          return { rowSpan };
        }
        
        // 否则隐藏单元格
        return { rowSpan: 0 };
      },
    },
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
          width: 80,
          align: 'center',
          render: (value) => value.toLocaleString(),
        },
        {
          title: '永夜王加成',
          dataIndex: 'nightreignHealthMultiplier',
          key: 'nightreignHealthMultiplier',
          width: 100,
          align: 'center',
        },
      ],
    },
    {
      title: '攻击类别',
      children: [
                {
          title: (
                <div className="damage-type-container">
                  <Image src={standardDamage} alt="普通" width={18} height={18} preview={false} />
                  <span>普通</span>
                </div>
              ),
          dataIndex: 'normalAbsorption',
          key: 'normalAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span style={{ color: value > 1 ? '#52c41a' : value < 1 ? '#ff4d4f' : 'inherit' }}>
              {value}
            </span>
          ),
        },
                    {
              title: (
                <div className="damage-type-container">
                  <Image src={slashDamage} alt="斩击" width={18} height={18} preview={false} />
                  <span>斩击</span>
                </div>
              ),
          dataIndex: 'slashAbsorption',
          key: 'slashAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span style={{ color: value > 1 ? '#52c41a' : value < 1 ? '#ff4d4f' : 'inherit' }}>
              {value}
            </span>
          ),
        },
                    {
              title: (
                <div className="damage-type-container">
                  <Image src={strikeDamage} alt="打击" width={18} height={18} preview={false} />
                  <span>打击</span>
                </div>
              ),
          dataIndex: 'strikeAbsorption',
          key: 'strikeAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span style={{ color: value > 1 ? '#52c41a' : value < 1 ? '#ff4d4f' : 'inherit' }}>
              {value}
            </span>
          ),
        },
                    {
              title: (
                <div className="damage-type-container">
                  <Image src={pierceDamage} alt="突刺" width={18} height={18} preview={false} />
                  <span>突刺</span>
                </div>
              ),
          dataIndex: 'pierceAbsorption',
          key: 'pierceAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span style={{ color: value > 1 ? '#52c41a' : value < 1 ? '#ff4d4f' : 'inherit' }}>
              {value}
            </span>
          ),
        },
      ],
    },
    {
      title: '属性类别',
      children: [
                    {
              title: (
                <div className="damage-type-container">
                  <Image src={magicDamage} alt="魔力" width={18} height={18} preview={false} />
                  <span>魔力</span>
                </div>
              ),
          dataIndex: 'magicAbsorption',
          key: 'magicAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span style={{ color: value > 1 ? '#52c41a' : value < 1 ? '#ff4d4f' : 'inherit' }}>
              {value}
            </span>
          ),
        },
                    {
              title: (
                <div className="damage-type-container">
                  <Image src={fireDamage} alt="火焰" width={18} height={18} preview={false} />
                  <span>火焰</span>
                </div>
              ),
          dataIndex: 'fireAbsorption',
          key: 'fireAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span style={{ color: value > 1 ? '#52c41a' : value < 1 ? '#ff4d4f' : 'inherit' }}>
              {value}
            </span>
          ),
        },
                    {
              title: (
                <div className="damage-type-container">
                  <Image src={lightningDamage} alt="雷电" width={18} height={18} preview={false} />
                  <span>雷电</span>
                </div>
              ),
          dataIndex: 'lightningAbsorption',
          key: 'lightningAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span style={{ color: value > 1 ? '#52c41a' : value < 1 ? '#ff4d4f' : 'inherit' }}>
              {value}
            </span>
          ),
        },
                    {
              title: (
                <div className="damage-type-container">
                  <Image src={holyDamage} alt="神圣" width={18} height={18} preview={false} />
                  <span>神圣</span>
                </div>
              ),
          dataIndex: 'holyAbsorption',
          key: 'holyAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span style={{ color: value > 1 ? '#52c41a' : value < 1 ? '#ff4d4f' : 'inherit' }}>
              {value}
            </span>
          ),
        },
      ],
    },
  ];

  // 右侧表格列定义： + 韧性
  const rightColumns: ColumnsType<BossData> = [
    {
      title: '',
      key: 'image',
      width: 42,
      align: 'center',
      render: (_, record) => {
        const imageSrc = bossImageMap[record.name];
        return imageSrc ? (
          <Image
            src={imageSrc}
            alt={record.name}
            width={40}
            height={40}
            className="boss-image"
            preview={false}
          />
        ) : null;
      },
      onCell: (record) => {
        // 找到相同图片的下一个boss的索引
        const currentIndex = filteredData.findIndex(item => item.name === record.name);
        const currentImage = bossImageMap[record.name];
        
        if (!currentImage) return {};
        
        // 计算相同图片的行数
        let rowSpan = 1;
        for (let i = currentIndex + 1; i < filteredData.length; i++) {
          if (bossImageMap[filteredData[i].name] === currentImage) {
            rowSpan++;
          } else {
            break;
          }
        }
        
        // 如果是相同图片组的第一行，设置rowSpan
        if (currentIndex === 0 || bossImageMap[filteredData[currentIndex - 1].name] !== currentImage) {
          return { rowSpan };
        }
        
        // 否则隐藏单元格
        return { rowSpan: 0 };
      },
    },
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
          title: (
            <div className="resistance-type-container">
              <Image src={poisonResistance} alt="中毒" width={18} height={18} preview={false} />
              <span>中毒</span>
            </div>
          ),
          dataIndex: 'poisonResistance',
          key: 'poisonResistance',
          width: 60,
          align: 'center',
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={scarletRotResistance} alt="腐败" width={18} height={18} preview={false} />
              <span>腐败</span>
            </div>
          ),
          dataIndex: 'scarletRotResistance',
          key: 'scarletRotResistance',
          width: 60,
          align: 'center',
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={bleedResistance} alt="出血" width={18} height={18} preview={false} />
              <span>出血</span>
            </div>
          ),
          dataIndex: 'bleedResistance',
          key: 'bleedResistance',
          width: 60,
          align: 'center',
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={frostResistance} alt="冻伤" width={18} height={18} preview={false} />
              <span>冻伤</span>
            </div>
          ),
          dataIndex: 'frostResistance',
          key: 'frostResistance',
          width: 60,
          align: 'center',
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={sleepResistance} alt="睡眠" width={18} height={18} preview={false} />
              <span>睡眠</span>
            </div>
          ),
          dataIndex: 'sleepResistance',
          key: 'sleepResistance',
          width: 60,
          align: 'center',
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={madnessResistance} alt="发狂" width={18} height={18} preview={false} />
              <span>发狂</span>
            </div>
          ),
          dataIndex: 'madnessResistance',
          key: 'madnessResistance',
          width: 60,
          align: 'center',
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={deathBlightResistance} alt="咒死" width={18} height={18} preview={false} />
              <span>咒死</span>
            </div>
          ),
          dataIndex: 'deathBlightResistance',
          key: 'deathBlightResistance',
          width: 60,
          align: 'center',
        },
      ],
    },
  ];

  return (
    <div className="boss-data-view-container">

      {/* 双表格布局 */}
      <Row gutter={16}>
        {/* 上方表格：血量 + 吸收 */}
        <Col span={24}>
          <Card 
            title={<span className="table-title">Table 1</span>}
            className="boss-card"
          >
            <Table
              columns={leftColumns}
              dataSource={filteredData}
              rowKey="id"
              scroll={{ x: 800 }}
              pagination={false}
              size="small"
              bordered
              footer={defaultFooter}
            />
          </Card>
        </Col>

        {/* 下方表格：抗性 + 韧性 */}
        <Col span={24}>
          <Card 
            title={<span className="table-title">Table 2</span>}
            className="boss-card-bottom"
          >
            <Table
              columns={rightColumns}
              dataSource={filteredData}
              rowKey="id"
              scroll={{ x: 600 }}
              pagination={false}
              size="small"
              bordered
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BossDataView;
