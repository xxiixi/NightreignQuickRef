import React from 'react';
import { Modal } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import Giscus from '@giscus/react';

interface GiscusCommentsProps {
    visible: boolean;
    onClose: () => void;
}

const GiscusComments: React.FC<GiscusCommentsProps> = ({ visible, onClose }) => {
    // 检测当前主题
    const isDarkMode = document.body.getAttribute('tomato-theme') === 'dark' ||
        document.documentElement.getAttribute('data-theme') === 'dark';
    const theme = isDarkMode ? 'dark' : 'light_protanopia';

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <MessageOutlined style={{ marginRight: '8px' }} />
                        评论与讨论
                    </span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width="90%"
            style={{ maxWidth: '800px' }}
            styles={{
                body: {
                    padding: '20px',
                    maxHeight: '70vh',
                    overflow: 'auto'
                }
            }}
            destroyOnHidden={true}
        >
            {visible && (
                <Giscus
                    id="comments"
                    repo="xxiixi/NightreignQuickRef"
                    repoId="R_kgDOPXY8wA"
                    category="Announcements"
                    categoryId="DIC_kwDOPXY8wM4Cv62K"
                    mapping="pathname"
                    strict="0"
                    reactionsEnabled="1"
                    emitMetadata="0"
                    inputPosition="bottom"
                    theme={theme}
                    lang="zh-CN"
                    loading="lazy"
                />
            )}
        </Modal>
    );
};

export default GiscusComments;
