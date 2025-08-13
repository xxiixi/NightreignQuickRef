import React from 'react';
import { useVercount } from 'vercount-react';
import { Typography, Space, Button, Tooltip, Popover } from 'antd';
import { MoonOutlined, SunOutlined, TranslationOutlined, SmileOutlined, ReadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = React.memo(({
  isDarkMode,
  onToggleTheme,
  onToggleLanguage
}) => {
  const { sitePv, pagePv, siteUv } = useVercount();

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
              <Tooltip title="查看访问量" placement="bottom" className="theme-toggle-btn">
                <Popover
                  content={
                    <div style={{ padding: '5px' }}>
                      <div style={{ fontSize: '12px' }}>
                        本站总访客数 <span style={{ color: '#1890ff' }}>{siteUv}</span> 人
                      </div>
                      <div style={{ fontSize: '12px' }}>
                        本站总访问量 <span style={{ color: '#1890ff' }}>{sitePv}</span> 次
                      </div>
                      <div style={{ fontSize: '12px' }}>
                        本页访问量 <span style={{ color: '#1890ff' }}>{pagePv}</span> 次
                      </div>
                      <div style={{ 
                        marginTop: '4px', 
                        borderTop: '1px solid rgba(198, 198, 198, 0.2)', 
                        paddingTop: '4px', 
                        fontSize: '12px', 
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
                    icon={<SmileOutlined />}
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
              <Tooltip title="切换语言功能尚未开发" placement="bottom">
                <Button
                  type="text"
                  icon={<TranslationOutlined />}
                  onClick={onToggleLanguage}
                  className="language-toggle-btn"
                />
              </Tooltip>
          </Space>
        </div>
      </div>
    </div>

      <div className="header">
        <Title level={1} className="main-title">
          Nightreign Reference Notebook
        </Title>
        <Space direction="vertical" size="small" className="subtitle">
          <Text type="secondary" className="subtitle-text">
            黑夜君临内容速查工具，可快速检索条目信息，后续会添加更多内容
          </Text>
        </Space>
      </div>
    </>
  );
});

export default Header; 