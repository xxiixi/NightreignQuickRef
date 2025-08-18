import React, { useState } from 'react';
import { Table, Card, Image, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { BossData } from '../types';
import bossData from '../data/zh-CN/boss_data.json';
import sinnerList from '../data/zh-CN/sinner_list.json';
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

  // 根据抗性数值返回CSS类名
  const getResistanceClass = (value: number | string): string => {
    if (value === '-' || value === null || value === undefined) {
      return '';
    }
    
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    
    if (numValue <= 154) {
      return 'resistance-low'; // 低抗性 - 绿色
    } else if (numValue <= 252) {
      return 'resistance-medium'; // 中等抗性 - 橙色
    } else if (numValue <= 542) {
      return 'resistance-high'; // 高抗性 - 红色
    } else {
      return ''; 
    }
  };

  // 根据吸收数值返回CSS类名
  const getAbsorptionClass = (value: number): string => {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (value > 1) {
      return 'absorption-weak'; // 弱吸收 - 绿色（容易受到伤害）
    } else if (value < 1) {
      return 'absorption-strong'; // 强吸收 - 红色（抗性较强）
    } else {
      return ''; // 正常吸收 - 默认颜色
    }
  };

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

  const resistanceFooter = () => (
    <div className="footer-text">
      抗性：' - ' 表示对该Boss无效 (即boss不吃该属性异常)
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
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
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
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
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
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
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
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
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
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
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
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
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
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
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
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
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
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
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
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
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
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
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
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
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
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
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
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
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
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
        },
      ],
    },
  ];

  // 定义罪人数据类型
  interface SinnerData {
    key: string;
    characterName: string;
    buildIndex: number;
    leftHand: string;
    rightHand: string;
    consumable: string;
  }

  // 处理罪人数据，转换为表格格式
  const processSinnerData = (): SinnerData[] => {
    const sinnerTableData: SinnerData[] = [];
    
    Object.entries(sinnerList).forEach(([characterName, builds]) => {
      builds.forEach((build: { 左手: string | string[]; 右手: string | string[]; 消耗品: string }, index: number) => {
        sinnerTableData.push({
          key: `${characterName}-${index}`,
          characterName,
          buildIndex: index + 1,
          leftHand: Array.isArray(build.左手) ? build.左手.join(' + ') : build.左手,
          rightHand: Array.isArray(build.右手) ? build.右手.join(' + ') : build.右手,
          consumable: build.消耗品
        });
      });
    });
    
    return sinnerTableData;
  };

  // 罪人装备配置表格列定义
  const sinnerColumns: ColumnsType<SinnerData> = [
    {
      title: '角色名称',
      dataIndex: 'characterName',
      key: 'characterName',
      width: 100,
      align: 'center',
      render: (text) => <strong>{text}</strong>,
      onCell: (record) => {
        const currentIndex = processSinnerData().findIndex(item => 
          item.characterName === record.characterName && item.buildIndex === record.buildIndex
        );
        
        // 计算相同角色的行数
        let rowSpan = 1;
        const allData = processSinnerData();
        for (let i = currentIndex + 1; i < allData.length; i++) {
          if (allData[i].characterName === record.characterName) {
            rowSpan++;
          } else {
            break;
          }
        }
        
        // 如果是相同角色的第一行，设置rowSpan
        if (currentIndex === 0 || allData[currentIndex - 1]?.characterName !== record.characterName) {
          return { rowSpan };
        }
        
        // 否则隐藏单元格
        return { rowSpan: 0 };
      },
    },
    {
      title: '配置',
      dataIndex: 'buildIndex',
      key: 'buildIndex',
      width: 60,
      align: 'center',
      render: (text) => `配置${text}`,
    },
    {
      title: '左手装备',
      dataIndex: 'leftHand',
      key: 'leftHand',
      width: 200,
      align: 'center',
    },
    {
      title: '右手装备',
      dataIndex: 'rightHand',
      key: 'rightHand',
      width: 200,
      align: 'center',
    },
    {
      title: '消耗品',
      dataIndex: 'consumable',
      key: 'consumable',
      width: 120,
      align: 'center',
    },
  ];

  const sinnerFooter = () => (
    <div className="footer-text">
      *双人1.1倍血量/三人1.2倍血量 *每个NPC基础数据均为满级 *每个NPC自带仇恨-6的BUFF
    </div>
  );

  return (
    <div className="boss-data-view-container">
      <Card className="boss-card">
        <Tabs
          defaultActiveKey="boss-data"
          items={[
            {
              key: 'boss-data',
              label: '🌙 夜王基础数据',
              children: (
                <>
                  <Table
                    columns={leftColumns}
                    dataSource={filteredData}
                    rowKey="id"
                    scroll={{ x: 800 }}
                    pagination={false}
                    size="small"
                    bordered
                    footer={defaultFooter}
                    style={{ marginBottom: '24px' }}
                  />
                  <Table
                    columns={rightColumns}
                    dataSource={filteredData}
                    rowKey="id"
                    scroll={{ x: 600 }}
                    pagination={false}
                    size="small"
                    bordered
                    footer={resistanceFooter}
                  />
                </>
              ),
            },
            {
              key: 'sinner-data',
              label: '🐐 永夜山羊召唤罪人详情',
              children: (
                <Table
                  columns={sinnerColumns}
                  dataSource={processSinnerData()}
                  rowKey="key"
                  scroll={{ x: 700 }}
                  pagination={false}
                  size="small"
                  bordered
                  footer={sinnerFooter}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default BossDataView;
