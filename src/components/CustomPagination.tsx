import React from 'react';
import { Button, Select } from 'antd';

export interface CustomPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}

// 词条详情页 / 武器战技页共用的分页条
const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  loading = false,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (loading || totalItems === 0) {
    return null;
  }

  return (
    <div
      className="custom-pagination-row"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '15px',
        padding: '0 16px',
      }}
    >
      <div
        className="page-size-controls"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span style={{ color: 'var(--theme-text-secondary)', fontSize: '14px' }}>
          每页显示
        </span>
        <Select
          value={pageSize.toString()}
          onChange={(value) => {
            onPageSizeChange(Number(value));
            onPageChange(1);
          }}
          options={[
            { value: '15', label: '15 条' },
            { value: '20', label: '20 条' },
            { value: '30', label: '30 条' },
            { value: '50', label: '50 条' },
            { value: '80', label: '80 条' },
            { value: '100', label: '100 条' },
          ]}
          size="small"
          style={{ width: '100px' }}
        />
        <span style={{ color: 'var(--theme-text-secondary)', fontSize: '14px' }}>
          共 {totalItems} 条记录
        </span>
      </div>

      <div
        className="page-nav-controls"
        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          size="middle"
        >
          上一页
        </Button>

        <span
          style={{
            margin: '0 15px',
            color: 'var(--theme-text-secondary)',
            fontSize: '14px',
          }}
        >
          第 {currentPage} 页，共 {totalPages} 页
        </span>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          size="middle"
        >
          下一页
        </Button>
      </div>
    </div>
  );
};

export default CustomPagination;
