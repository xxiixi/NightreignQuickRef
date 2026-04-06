import React from 'react';
import { useVercount } from 'vercount-react';
import { Typography, Space, Button, Tooltip, Popover } from 'antd';
import { MoonOutlined, SunOutlined, FireOutlined, ReadOutlined, ArrowRightOutlined, GithubOutlined, PushpinOutlined, BaiduOutlined, BilibiliOutlined, LinkOutlined } from '@ant-design/icons';
import { getVersionDisplayText, getVersionNumber } from '../config/versionConfig';
import { DATA_SOURCE_CONFIG } from '../config/dataSourceConfig';
import type { DataSourceIcon } from '../config/dataSourceConfig';

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
  const { siteUv, pagePv } = useVercount();

  // 根据图标类型获取对应的图标组件
  const getDataSourceIcon = (iconType: DataSourceIcon): React.ReactNode => {
    switch (iconType) {
      case 'baidu':
        return <BaiduOutlined style={{ marginRight: '4px' }} />;
      case 'bilibili':
        return <BilibiliOutlined style={{ marginRight: '4px' }} />;
      case 'link':
        return <LinkOutlined style={{ marginRight: '4px' }} />;
      default:
        return null;
    }
  };

  // 渲染数据来源内容
  const renderDataSourceContent = () => {
    return (
      <div style={{ padding: '8px', maxWidth: '250px' }}>
        <div style={{ fontSize: '13px', marginBottom: '8px', fontWeight: 'bold', borderBottom: '1px solid rgba(198, 198, 198, 0.2)', paddingBottom: '8px' }}>
          数据来源链接 🔗
        </div>
        <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
          {DATA_SOURCE_CONFIG.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {group.showDivider && groupIndex > 0 && (
                <div style={{ marginBottom: '0px', borderTop: '1px solid rgba(198, 198, 198, 0.2)', paddingTop: '8px' }} />
              )}
              {group.items.map((item, itemIndex) => (
                <div key={itemIndex} style={{ marginBottom: '4px' }}>
                  {getDataSourceIcon(item.icon)}
                  {item.title}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowRightOutlined />
                  </a>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

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
                        总访客数 <span style={{ color: '#1890ff' }}>{siteUv}</span> 人
                      </div>
                      {/* <div style={{ fontSize: '12px' }}>
                        本站总访问量 <span style={{ color: '#1890ff' }}>{sitePv}</span> 次
                      </div> */}
                      <div style={{ fontSize: '12px' }}>
                        总访问量 <span style={{ color: '#1890ff' }}>{pagePv}</span> 次
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
                  content={renderDataSourceContent()}
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
                            • 添加了DLC新夜王数据；<br />
                            • 添加了DLC新词条数据；<br />
                            • 添加了{getVersionNumber()}版本更新后的新词条数据；<br />
                            • 添加了DLC角色雷达图数据；
                          </div>
                        </div>

                        <div style={{ marginBottom: '8px', borderTop: '1px solid rgba(198, 198, 198, 0.2)', paddingTop: '8px' }}>
                          <div style={{ fontWeight: 'bold', color: '#52c41a', marginBottom: '4px' }}>
                            🔧 TODO
                          </div>
                          <div style={{ marginLeft: '12px', marginBottom: '2px' }}>
                            • 添加DLC新敌人数据<br />
                            • 更新新角色等级、闪避面板<br />
                            • 夜雨伤害数据待更新(无数据来源)
                          </div>
                        </div>
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
            {getVersionDisplayText()}
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