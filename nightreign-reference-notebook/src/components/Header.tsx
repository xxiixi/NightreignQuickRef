import React from 'react';
import { useVercount } from 'vercount-react';
import { Typography, Space, Button, Tooltip, Popover } from 'antd';
import { MoonOutlined, SunOutlined, FireOutlined, ReadOutlined, BaiduOutlined, BilibiliOutlined, LinkOutlined, ArrowRightOutlined, GithubOutlined, PushpinOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  // onToggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = React.memo(({
  isDarkMode,
  onToggleTheme,
  // onToggleLanguage
}) => {
  const { sitePv, siteUv, pagePv } = useVercount();

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="top-bar-right">
            <Space size="small">
              <Tooltip title={isDarkMode ? "切换到亮色模式" : "切换到暗色模式"} placement="bottom">
                <Button
                  type="text"
                  icon={isDarkMode ? <MoonOutlined /> : <SunOutlined />}
                  onClick={onToggleTheme}
                  className="theme-toggle-btn"
                />
              </Tooltip>

              <Tooltip title={"点击跳转【地图种子筛选器】"} placement="bottom">
                <Button
                  type="text"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-map" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.5.5 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103M10 1.91l-4-.8v12.98l4 .8zm1 12.98 4-.8V1.11l-4 .8zm-6-.8V1.11l-4 .8v12.98z" />
                  </svg>}
                  onClick={() => window.open('https://xxiixi.github.io/NightreignMapFilter/', '_blank')}
                  className="theme-toggle-btn"
                />
              </Tooltip>

              <Tooltip title="查看访问量" placement="bottom" className="theme-toggle-btn">
                <Popover
                  content={
                    <div style={{ padding: '5px' }}>
                      <div style={{ fontSize: '13px', marginBottom: '8px', fontWeight: 'bold', borderBottom: '1px solid rgba(198, 198, 198, 0.2)', paddingBottom: '4px' }}>
                        访问量统计 🔥
                      </div>
                      <div style={{ fontSize: '12px' }}>
                        本站总访客数 <span style={{ color: '#1890ff' }}>{siteUv}</span> 人
                      </div>
                      <div style={{ fontSize: '12px' }}>
                        本站总访问量 <span style={{ color: '#1890ff' }}>{sitePv}</span> 次
                      </div>
                      <div style={{ fontSize: '12px' }}>
                        数据查询页访问量 <span style={{ color: '#1890ff' }}>{pagePv}</span> 次
                      </div>
                      <div style={{
                        marginTop: '8px',
                        borderTop: '1px solid rgba(198, 198, 198, 0.2)',
                        paddingTop: '8px',
                        fontSize: '10px',
                        color: '#999'
                      }}>
                        统计服务: Vercount
                      </div>
                    </div>
                  }
                  placement="bottom"
                  trigger="click"
                >
                  <Button
                    type="text"
                    icon={<FireOutlined />}
                    className="visits-counter-btn"
                  />
                </Popover>
              </Tooltip>

              <Tooltip title="查看数据来源" placement="bottom" className="theme-toggle-btn">
                <Popover
                  content={
                    <div style={{ padding: '8px', maxWidth: '250px' }}>
                      <div style={{ fontSize: '13px', marginBottom: '8px', fontWeight: 'bold', borderBottom: '1px solid rgba(198, 198, 198, 0.2)', paddingBottom: '8px' }}>
                        数据来源链接 🔗
                      </div>
                      {/* Baidu  */}
                      <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                        <div style={{ marginBottom: '4px' }}>
                          <BaiduOutlined style={{ marginRight: '4px' }} />
                          黑夜君临 v1.01数据汇总
                          <a
                            href="https://tieba.baidu.com/p/9906444262?pid=152430482433&cid=#152430482433"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <BaiduOutlined style={{ marginRight: '4px' }} />
                          黑夜君临 新词条数据一览
                          <a
                            href="https://tieba.baidu.com/p/9935090782?pid=152476350171&cid=#152476350171"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <BaiduOutlined style={{ marginRight: '4px' }} />
                          全传说武器庇佑效果
                          <a
                            href="https://tieba.baidu.com/p/9889921465?pid=152403477340&cid=#152403477340"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <BaiduOutlined style={{ marginRight: '4px' }} />
                          黑夜君临1.02.2部分详细更新内容（包含深夜模式改动）
                          <a
                            href="https://tieba.baidu.com/p/10026641416?pid=152611338073&cid=#152611338073"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <BaiduOutlined style={{ marginRight: '4px' }} />
                          剑骸马雷1.02.2具体成长曲线
                          <a
                            href="https://tieba.baidu.com/p/10027082782?share=9105&fr=sharewise&see_lz=0"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>

                        <div style={{ marginBottom: '0px', borderTop: '1px solid rgba(198, 198, 198, 0.2)', paddingTop: '8px' }} />

                        {/* Bilibili  */}
                        <div style={{ marginBottom: '4px' }}>
                          <BilibiliOutlined style={{ marginRight: '4px' }} />
                          【艾尔登法环：黑夜君临】全词条汇总！遗物+护符+武器固有效果+武器随机buff
                          <a
                            href="https://www.bilibili.com/video/BV1GfMSzvE3V"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <BilibiliOutlined style={{ marginRight: '4px' }} />
                          【艾尔登法环：黑夜君临】全角色回避翻滚动作，无敌帧分析对比！
                          <a
                            href="https://www.bilibili.com/video/BV1LvuVzuEqo"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <BilibiliOutlined style={{ marginRight: '4px' }} />
                          【黑夜君临】圣杯瓶恢复、缓回、群回机制解析及常见误区
                          <a
                            href="https://www.bilibili.com/video/BV1M18jzQE9X"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <BilibiliOutlined style={{ marginRight: '4px' }} />
                          黑夜君临 永夜山羊罪人NPC预设一览+部分buff/debuff数值
                          <a
                            href="https://www.bilibili.com/video/BV1wzvNzREYQ/?spm_id_from=333.1387.upload.video_card.click&vd_source=37640654dbdd4ab80b471a16ac6da3c0"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <BilibiliOutlined style={{ marginRight: '4px' }} />
                          【黑夜君临】局内减伤词条叠加测试
                          <a
                            href="https://www.bilibili.com/opus/1100871642065666054"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <BilibiliOutlined style={{ marginRight: '4px' }} />
                          黑夜君临：渡夜者各等级属性点数一览
                          <a
                            href="https://www.bilibili.com/video/BV1p5ThzfEy7"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <BilibiliOutlined style={{ marginRight: '4px' }} />
                          黑夜君临：复活机制解析
                          <a
                            href="https://www.bilibili.com/video/BV1TnNLzXESx"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <BilibiliOutlined style={{ marginRight: '4px' }} />
                          【艾尔登法环：黑夜君临】深夜模式，全词条！（遗物+武器+负面词条机制）
                          <a
                            href="https://www.bilibili.com/video/BV1JLpxzmEdv"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <BilibiliOutlined style={{ marginRight: '4px' }} />
                          【艾尔登法环：黑夜君临】DLC全词条！（遗物+改动词条+可叠加性）见弃空洞者
                          <a
                            href="https://www.bilibili.com/video/BV1sQmTBmEGP"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>

                        <div style={{ marginBottom: '0px', borderTop: '1px solid rgba(198, 198, 198, 0.2)', paddingTop: '8px' }} />
                        <div style={{ marginBottom: '4px' }}>
                          <LinkOutlined style={{ marginRight: '4px' }} />
                          每日缩圈时间
                          <a
                            href="https://mobalytics.gg/elden-ring-nightreign/guides/day-length"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <LinkOutlined style={{ marginRight: '4px' }} />
                          角色升级所需卢恩
                          <a
                            href="https://game8.co/games/Elden-Ring-Nightreign/archives/522643"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <LinkOutlined style={{ marginRight: '4px' }} />
                          官方 Wiki
                          <a
                            href="https://eldenringnightreign.wiki.fextralife.com/Elden+Ring+Nightreign+Wiki"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ArrowRightOutlined />
                          </a>
                        </div>
                      </div>
                    </div>
                  }
                  placement="bottom"
                  trigger="click"
                >
                  <Button
                    type="text"
                    icon={<ReadOutlined />}
                    className="visits-counter-btn"
                  />
                </Popover>
              </Tooltip>
              {/* <Tooltip title="网站声明" placement="bottom" className="theme-toggle-btn">
                <Popover
                  content={
                    <div style={{ padding: '8px', maxWidth: '250px', width: '250px' }}>
                      <div style={{ fontSize: '13px', marginBottom: '8px', fontWeight: 'bold', borderBottom: '1px solid rgba(198, 198, 198, 0.2)', paddingBottom: '8px' }}>
                        网站声明 📜
                      </div>
                      <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                        <div style={{ marginBottom: '6px' }}>
                          📕 本网站为个人制作，非官方授权网站;
                        </div>
                        <div style={{ marginBottom: '6px' }}>
                          📘 数据由个人收集整理，可能存在错误或遗漏，请以数据来源的原数据为准;
                        </div>
                        <div style={{ marginBottom: '6px' }}>
                          📗 点击左侧 <ReadOutlined /> 按钮可查看具体数据来源链接;
                        </div>
                      </div>
                    </div>
                  }
                  placement="bottom"
                  trigger="click"
                >
                  <Button
                    type="text"
                    icon={<RobotOutlined />}
                    className="visits-counter-btn"
                  />
                </Popover>
              </Tooltip> */}
              <Tooltip title="查看更新记录和计划" placement="bottom" className="theme-toggle-btn">
                <Popover
                  content={
                    <div style={{ padding: '8px', maxWidth: '280px' }}>
                      <div style={{ fontSize: '13px', marginBottom: '8px', fontWeight: 'bold', borderBottom: '1px solid rgba(198, 198, 198, 0.2)', paddingBottom: '8px' }}>
                        更新记录 & 计划 📋
                      </div>
                      <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                        {/* 最新更新 */}
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }}>
                            ✅ 最新更新
                          </div>
                          <div style={{ marginLeft: '12px', marginBottom: '2px' }}>
                            • 添加了DLC新词条数据；<br />
                            • 添加了1.03.1版本更新后的新词条数据；<br />
                            • 添加了DLC角色雷达图数据；
                          </div>
                        </div>

                        <div style={{ marginBottom: '8px', borderTop: '1px solid rgba(198, 198, 198, 0.2)', paddingTop: '8px' }}>
                          <div style={{ fontWeight: 'bold', color: '#52c41a', marginBottom: '4px' }}>
                            🔧 TODO
                          </div>
                          <div style={{ marginLeft: '12px', marginBottom: '2px' }}>
                            • 添加新夜王、DLC新敌人数据<br />
                            • 更新新角色等级、闪避面板<br />
                            • 夜雨伤害数据待更新(无数据来源)
                          </div>
                        </div>

                        {/* <div style={{ marginBottom: '0px', borderTop: '1px solid rgba(198, 198, 198, 0.2)', paddingTop: '8px' }}>
                          <div style={{ fontWeight: 'bold', color: '#fa8c16', marginBottom: '4px' }}>
                            🐛 已知问题
                          </div>
                          <div style={{ marginLeft: '12px', marginBottom: '2px' }}>
                            • 部分数据可能存在版本差异，发现后会尽快修正
                          </div>
                        </div> */}
                      </div>
                    </div>
                  }
                  placement="bottom"
                  trigger="click"
                >
                  <Button
                    type="text"
                    icon={<PushpinOutlined />}
                    className="visits-counter-btn"
                  />
                </Popover>
              </Tooltip>
              <Tooltip title="查看本项目" placement="bottom" className="theme-toggle-btn">
                <Popover
                  content={
                    <div style={{ padding: '8px', maxWidth: '200px' }}>
                      <div style={{ fontSize: '13px', marginBottom: '8px', fontWeight: 'bold' }}>
                        <GithubOutlined style={{ marginRight: '4px' }} /> GitHub仓库
                      </div>
                      <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                        <a
                          href="https://github.com/xxiixi/NightreignQuickRef"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="header-link"
                        >
                          NightreignQuickRef
                        </a>
                      </div>
                      <div style={{
                        marginTop: '8px',
                        borderTop: '1px solid rgba(198, 198, 198, 0.2)',
                        paddingTop: '8px',
                        fontSize: '10px',
                        color: '#999'
                      }}>
                        🙏 求个Star ⭐️ 感谢支持 🙏
                      </div>
                    </div>
                  }
                  placement="bottom"
                  trigger="click"
                >
                  <Button
                    type="text"
                    icon={<GithubOutlined />}
                    className="visits-counter-btn"
                  />
                </Popover>
              </Tooltip>
              {/* <Tooltip title="切换语言功能尚未开发" placement="bottom">
                <Button
                  type="text"
                  icon={<TranslationOutlined />}
                  onClick={onToggleLanguage}
                  className="language-toggle-btn"
                />
              </Tooltip> */}
            </Space>
          </div>
        </div>
      </div>

      <div className="header">
        <Title level={1} className="main-title">
          黑夜君临速查手册
        </Title>
        <Space direction="vertical" size="small" className="subtitle">
          <Text type="secondary" className="subtitle-text version-info">
            黑夜君临版本: v1.03.1 | Dec 4 2025
          </Text>
          <Text type="secondary" className="subtitle-text">
            个人收集/整理的黑夜君临数据、机制速查网页，可快速检索条目信息，后续会添加更多内容
          </Text>
        </Space>
      </div>
    </>
  );
});

export default Header; 