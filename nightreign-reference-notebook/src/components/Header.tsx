import React from 'react';
import { useVercount } from 'vercount-react';
import { Typography, Space, Button, Tooltip, Popover } from 'antd';
import { MoonOutlined, SunOutlined, FireOutlined, ReadOutlined, RobotOutlined, StarOutlined } from '@ant-design/icons';

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
            <Space size="middle">
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
                      <div style={{ fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' }}>
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
                    <div style={{ padding: '8px', maxWidth: '300px' }}>
                      <div style={{ fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' }}>
                        数据来源链接 🔗
                      </div>
                      <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                        <div style={{ marginBottom: '4px' }}>
                          <a
                            href="https://www.bilibili.com/video/BV1GfMSzvE3V"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-link"
                          >
                            📋 全词条汇总
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <a
                            href="https://www.bilibili.com/video/BV1LvuVzuEqo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-link"
                          >
                            🎯 翻滚/闪避无敌帧分析
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <a
                            href="https://api.xiaoheihe.cn/v3/bbs/app/api/web/share?link_id=758970790a0a"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-link"
                          >
                            🧙‍♂️ 隐士出招表
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <a
                            href="https://mobalytics.gg/elden-ring-nightreign/guides/day-length"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-link"
                          >
                            ⏰ 每日缩圈时间
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <a
                            href="https://game8.co/games/Elden-Ring-Nightreign/archives/522643"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-link"
                          >
                            💰 角色升级所需卢恩
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <a
                            href="https://www.bilibili.com/video/BV1M18jzQE9X"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-link"
                          >
                            🏺 血量恢复计算器
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <a
                            href="https://www.bilibili.com/video/BV1wzvNzREYQ/?spm_id_from=333.1387.upload.video_card.click&vd_source=37640654dbdd4ab80b471a16ac6da3c0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-link"
                          >
                            🔰 局内减伤词条叠加性
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <a
                            href="https://www.bilibili.com/opus/1100871642065666054"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-link"
                          >
                            🐐 永夜山羊罪人NPC预设一览
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <a
                            href="https://www.bilibili.com/video/BV1p5ThzfEy7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-link"
                          >
                            📊 角色各等级属性点数
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <a
                            href="https://www.bilibili.com/video/BV1TnNLzXESx"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-link"
                          >
                            💀 复活机制解析
                          </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <a
                            href="https://eldenringnightreign.wiki.fextralife.com/Elden+Ring+Nightreign+Wiki"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-link"
                          >
                            📚 官方 Wiki
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
              <Tooltip title="网站声明" placement="bottom" className="theme-toggle-btn">
                <Popover
                  content={
                    <div style={{ padding: '8px', maxWidth: '250px', width: '250px' }}>
                      <div style={{ fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' }}>
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
              </Tooltip>
              <Tooltip title="查看原项目" placement="bottom" className="theme-toggle-btn">
                <Popover
                  content={
                    <div style={{ padding: '8px', maxWidth: '200px', width: '180px' }}>
                      <div style={{ fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' }}>
                        本项目GitHub仓库
                      </div>
                      <div>
                        <a
                          href="https://github.com/xxiixi/NightreignQuickRef"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="footer-link"
                        >
                          点击跳转
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
                    icon={<StarOutlined />}
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
          黑夜君临版本: v1.02.02 | 更新时间：2025.9.13 | 更新内容：深夜模式局外词条
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