import React, { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Input, Select, Table, Tabs, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import CustomPagination from '../components/CustomPagination';
import sorceries from '../data/zh-CN/sorceries.json';
import incantations from '../data/zh-CN/incantations.json';
import weaponArts from '../data/zh-CN/weapon_arts.json';
import uniqueWeaponArts from '../data/zh-CN/unique_weapon_arts.json';
import supportSpells from '../data/zh-CN/support_spells.json';
import weaponArtCategoryHints from '../data/zh-CN/weapon_art_category_hints.json';
import standardDamageIcon from '../assets/Negations/standard-damage-damage-type-elden-ring-nightreign-wiki-guide.png';
import strikeDamageIcon from '../assets/Negations/strike-damage-damage-type-elden-ring-nightreign-wiki-guide.png';
import slashDamageIcon from '../assets/Negations/slash-damage-damage-type-elden-ring-nightreign-wiki-guide.png';
import pierceDamageIcon from '../assets/Negations/pierce-damage-damage-type-elden-ring-nightreign-wiki-guide.png';
import magicDamageIcon from '../assets/Negations/magic-upgrade-affinity-elden-ring-nightreign-wiki-guide.png';
import fireDamageIcon from '../assets/Negations/fire-upgrade-affinity-elden-ring-nightreign-wiki-guide.png';
import lightningDamageIcon from '../assets/Negations/lightning-upgrade-affinity-elden-ring-nightreign-wiki-guide.png';
import holyDamageIcon from '../assets/Negations/holy-upgrade-affinity-elden-ring-nightreign-wiki-guide.png';

type Row = Record<string, string>;

const sorceryRows = sorceries as unknown as Row[];
const incantationRows = incantations as unknown as Row[];
const weaponArtRows = weaponArts as unknown as Row[];
const uniqueWeaponArtRows = uniqueWeaponArts as unknown as Row[];
const supportMagicRows = supportSpells['辅助魔法'] as unknown as Row[];
const supportIncantationRows = supportSpells['辅助祷告'] as unknown as Row[];
const categoryHints = weaponArtCategoryHints as Record<string, string>;

const TAB_KEYS = ['战技', '专用战技', '魔法', '祷告', '辅助类'];

const weaponArtNotes = [
  '黑夜君临 v1.01 战灰战技倍率、基础攻击力表  by: 虚空蛋黄酱',
  '部分战灰战技的模组、威力、性能与武器分类有关。武器分类及基础削韧值如下：\n轻：短剑3、长剑5、刺剑4、重刺剑5.5、曲剑5、反手剑5、刀5、槌6、连枷6、斧5、拳头5、钩爪4、鞭子4\n重：大剑5.5、大刀5.5、大曲剑5.5、大斧5.5、大槌6.5\n特大：特大剑6、特大武器7\n长柄：双头剑5、矛5、大矛5.5、戟5、镰刀5\n盾牌类：小盾5，中盾5.5，大盾6',
  'A类：攻击力完全取决于武器面板，A类战技攻击力=武器面板×攻击倍率\nB类：基础攻击力取决于武器强化等级（强化系数：白/蓝/紫/金分别为0.6/0.738/0.9/1.08），B类战灰战技使用特殊补正，基础补正系数被替换为25%（单补正）或15%（双补正），B类战技攻击力=基础值×强化系数×(1+补正倍率1+补正倍率2+...)\nA&B类：A类与B类混合型（攻击力为A部分攻击力+B部分攻击力，其中B部分没有特殊补正，攻击力以武器本身对应属性补正计算）\n其他类：无伤害成分，辅助类战技\n战技为武器附魔的攻击力全部为固定值，表中除双吻毒蛾外全部异常值均受感应补正。',
];

const uniqueWeaponArtNotes = [
  '黑夜君临 v1.01 专用战技倍率、基础攻击力表   by: 虚空蛋黄酱',
  'A类：攻击力完全取决于武器面板，A类战技攻击力=武器面板×攻击倍率\nB类：基础攻击力取决于武器强化等级（强化系数：白/蓝/紫/金分别为0.6/0.738/0.9/1.08），B类专用战技补正系数与武器一致（但有部分例外），B类战技攻击力=基础值×强化系数×(1+补正倍率1+补正倍率2+...)\nA&B类：A类与B类混合型（攻击力为A部分攻击力+B部分攻击力）\n其他类：无伤害成分，辅助类战技\n战技为武器附魔的攻击力全部为固定值，表中所有异常值均吃感应补正。',
];

const sorceryNotes = [
  '黑夜君临 v1.01 魔法基础攻击力表   by: 虚空蛋黄酱',
  'A+B代表两段伤害，可以打在同一敌人身上；A/B代表两种伤害，不能对同一敌人生效；A×n即为A+A+A+……，代表多段同类伤害重复n次。（本作没有破防率了，可以放心的将攻击力直接相加）',
  '本作法术攻击力大部分与本体不同，耗蓝与本体相同。法术的攻击力=基础威力*0.6*游戏内显示的法强%，所有异常值全部为固定值。',
];

const incantationNotes = [
  '黑夜君临 v1.01 祷告基础攻击力表   by: 虚空蛋黄酱',
  'A+B代表两段伤害，可以打在同一敌人身上；A/B代表两种伤害，不能对同一敌人生效；A×n即为A+A+A+……，代表多段同类伤害重复n次。（本作没有破防率了，可以放心的将攻击相加比较）',
  '本作祷告数值有一半左右与本体不同，耗蓝与本体相同。祷告的攻击力=基础威力*0.6*游戏内显示的法强%，所有异常值全部为固定值。',
];

const supportNotes = [
  '黑夜君临 v1.01 辅助类法术   by: 虚空蛋黄酱',
  '本作治疗量或附魔攻击力=基础值*(1+智力或信仰*1.5/99），与触媒完全无关。',
];

const NOT_IMPLEMENTED = '未实装';

const DAMAGE_TYPE_ALIASES: Record<string, string> = {
  普通: '普通',
  物: '普通',
  物理: '普通',
  挥击: '斩击',
  打击: '打击',
  斩击: '斩击',
  突刺: '突刺',
  戳击: '突刺',
  魔: '魔力',
  魔力: '魔力',
  火: '火焰',
  火焰: '火焰',
  雷: '雷电',
  雷电: '雷电',
  圣: '神圣',
  神圣: '神圣',
};

const damageTypeOption = (value: string, label: string, icon: string) => ({
  value,
  label: (
    <span className="damage-type-option">
      <img src={icon} alt="" className="damage-type-icon" />
      <span>{label}</span>
    </span>
  ),
});

const damageFilterOptions = [
  {
    label: '攻击类别',
    options: [
      damageTypeOption('普通', '普通', standardDamageIcon),
      damageTypeOption('打击', '打击', strikeDamageIcon),
      damageTypeOption('斩击', '斩击', slashDamageIcon),
      damageTypeOption('突刺', '突刺', pierceDamageIcon),
    ],
  },
  {
    label: '属性类别',
    options: [
      damageTypeOption('魔力', '魔力', magicDamageIcon),
      damageTypeOption('火焰', '火焰', fireDamageIcon),
      damageTypeOption('雷电', '雷电', lightningDamageIcon),
      damageTypeOption('神圣', '神圣', holyDamageIcon),
    ],
  },
];

const formatDamageType = (value: string) =>
  value.replace(/[^+＋/\n、,，]+/g, token => {
    const trimmed = token.trim();
    const canonical = DAMAGE_TYPE_ALIASES[trimmed];
    return canonical ? token.replace(trimmed, canonical) : token;
  });

const damageTypesOf = (row: Row): string[] => {
  const result = new Set<string>();
  [row['伤害类型'], row['物理类型']].forEach(value => {
    if (!value) return;
    value.split(/[+＋/\n、,，]+/).forEach(token => {
      const canonical = DAMAGE_TYPE_ALIASES[token.trim()];
      if (canonical) result.add(canonical);
    });
  });
  return [...result];
};

// 取行上的分类标签；战技/专用战技的 DLC 行都带「未实装」
const categoryTagsOf = (row: Row, kind?: 'weaponArt' | 'unique'): string[] => {
  const raw = row['分类'] || '';
  if (kind === 'weaponArt') {
    if (row['版本'] === 'DLC' || raw === 'DLC新增') {
      return [NOT_IMPLEMENTED];
    }
    return raw
      .split(/[、,，/]/)
      .map(item => item.replace(/战灰$/, '').trim())
      .filter(Boolean);
  }
  const tags = raw
    .split(/[、,，/]/)
    .map(item => item.replace(/类$/, '').trim())
    .filter(Boolean);
  if (row['版本'] === 'DLC') {
    tags.push(NOT_IMPLEMENTED);
  }
  return tags;
};

interface MergeRule {
  columnKey: string;
  groupKey: (row: Row) => string;
}

interface DetailConfig {
  field: string;
  linkColumnKey: string;
  title: string;
}

// 合并单元格时使用稳定行 key，避免翻页/筛选后 React 复用错误的行
const rowKeyMap = new WeakMap<Row, string>();
let rowKeySequence = 0;
const getRowKey = (row: Row) => {
  let key = rowKeyMap.get(row);
  if (!key) {
    rowKeySequence += 1;
    key = `row-${rowKeySequence}`;
    rowKeyMap.set(row, key);
  }
  return key;
};

interface DataTableProps {
  columns: ColumnsType<Row>;
  data: Row[];
  title?: string;
  searchPlaceholder: string;
  marginBottom?: number;
  pagination?: boolean;
  notes?: string[];
  skillFilterKind?: 'weaponArt' | 'unique';
  mergeRules?: MergeRule[];
  detail?: DetailConfig;
  damageFilter?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  title,
  searchPlaceholder,
  marginBottom = 24,
  pagination = true,
  notes,
  skillFilterKind,
  mergeRules,
  detail,
  damageFilter,
}) => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDamageTypes, setSelectedDamageTypes] = useState<string[]>([]);
  const [showNotImplemented, setShowNotImplemented] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const categoryOptions = useMemo(() => {
    if (!skillFilterKind) return [];
    const tags = new Set<string>();
    data.forEach(row => {
      categoryTagsOf(row, skillFilterKind).forEach(tag => tags.add(tag));
    });
    return [...tags]
      .filter(tag => tag !== NOT_IMPLEMENTED || showNotImplemented)
      .map(tag => ({ value: tag, label: tag }));
  }, [data, skillFilterKind, showNotImplemented]);

  const filteredData = useMemo(() => {
    let rows = data;

    if (skillFilterKind) {
      rows = rows.filter(row => {
        const tags = categoryTagsOf(row, skillFilterKind);
        if (!showNotImplemented && tags.includes(NOT_IMPLEMENTED)) {
          return false;
        }
        if (selectedCategories.length > 0 && !tags.some(tag => selectedCategories.includes(tag))) {
          return false;
        }
        return true;
      });
    }

    if (damageFilter && selectedDamageTypes.length > 0) {
      rows = rows.filter(row => {
        const types = damageTypesOf(row);
        return types.some(type => selectedDamageTypes.includes(type));
      });
    }

    const k = keyword.trim().toLowerCase();
    if (!k) return rows;
    return rows.filter(row =>
      Object.values(row).some(value => String(value).toLowerCase().includes(k))
      || damageTypesOf(row).some(type => type.toLowerCase().includes(k))
    );
  }, [data, damageFilter, keyword, selectedCategories, selectedDamageTypes, showNotImplemented, skillFilterKind]);

  useEffect(() => {
    setPage(1);
  }, [keyword, selectedCategories, selectedDamageTypes, showNotImplemented]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pagedData = useMemo(
    () => filteredData.slice((page - 1) * pageSize, page * pageSize),
    [filteredData, page, pageSize]
  );

  const visibleData = pagination ? pagedData : filteredData;

  const mergedColumns = useMemo(() => {
    if (!mergeRules || mergeRules.length === 0) return columns;

    const spansByColumn = new Map<string, number[]>();
    mergeRules.forEach((rule) => {
      const spans = new Array<number>(visibleData.length).fill(1);
      let start = 0;
      while (start < visibleData.length) {
        const key = rule.groupKey(visibleData[start]);
        let end = start + 1;
        while (end < visibleData.length && rule.groupKey(visibleData[end]) === key) {
          end += 1;
        }
        spans[start] = end - start;
        for (let index = start + 1; index < end; index += 1) {
          spans[index] = 0;
        }
        start = end;
      }
      spansByColumn.set(rule.columnKey, spans);
    });

    return columns.map((column) => {
      const columnKey = String(column.key);
      if (!spansByColumn.has(columnKey)) return column;
      return {
        ...column,
        onCell: (record: Row, index?: number) => {
          const rowIndex = index ?? 0;
          const previous = column.onCell?.(record, rowIndex) ?? {};
          return {
            ...previous,
            rowSpan: spansByColumn.get(columnKey)?.[rowIndex] ?? 1,
            style: { ...previous.style, verticalAlign: 'top' },
          };
        },
      };
    });
  }, [columns, mergeRules, visibleData]);

  const displayColumns = useMemo(() => {
    if (!detail) return mergedColumns;

    return mergedColumns.map((column) => {
      if (String(column.key) !== detail.linkColumnKey) return column;

      const originalRender = column.render;
      return {
        ...column,
        render: (value: unknown, record: Row, index?: number) => {
          const content = (originalRender
            ? originalRender(value, record, index ?? 0)
            : value) as React.ReactNode;
          if (!record[detail.field]) return content;

          const expanded = expandedRowKeys.includes(getRowKey(record));
          return (
            <div className="weapon-skill-detail-trigger">
              <span>{content}</span>
              <Button
                type="link"
                size="small"
                className="weapon-skill-detail-toggle"
                onClick={() => {
                  const key = getRowKey(record);
                  setExpandedRowKeys(prev =>
                    prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
                  );
                }}
              >
                {expanded ? '收起说明' : '展开说明'}
              </Button>
            </div>
          );
        },
      };
    });
  }, [detail, expandedRowKeys, mergedColumns]);

  const expandable = detail
    ? {
        expandedRowRender: (record: Row) => (
          <div className="weapon-skill-detail-panel">
            <div className="weapon-skill-detail-title">{detail.title}</div>
            <div className="weapon-skill-detail-text">{record[detail.field]}</div>
          </div>
        ),
        rowExpandable: (record: Row) => Boolean(record[detail.field]),
        expandedRowKeys,
        showExpandColumn: false,
        expandedRowClassName: () => 'weapon-skill-detail-row',
      }
    : undefined;

  return (
    <div style={{ marginBottom }}>
      {title && (
        <div
          style={{
            margin: '8px 0 12px',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--color-text-1)',
          }}
        >
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder={searchPlaceholder}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: 280 }}
        />
        {skillFilterKind && (
          <Select
            mode="multiple"
            allowClear
            placeholder="按分类筛选"
            options={categoryOptions}
            value={selectedCategories}
            onChange={setSelectedCategories}
            maxTagCount="responsive"
            style={{ minWidth: 220, maxWidth: 360 }}
          />
        )}
        {damageFilter && (
          <Select
            mode="multiple"
            allowClear
            showSearch={false}
            placeholder="按伤害类型筛选"
            options={damageFilterOptions}
            value={selectedDamageTypes}
            onChange={setSelectedDamageTypes}
            maxTagCount="responsive"
            listHeight={360}
            className="damage-type-select"
            style={{ minWidth: 250, maxWidth: 400 }}
          />
        )}
        {skillFilterKind && (
          <>
            <Checkbox
              checked={showNotImplemented}
              onChange={(e) => {
                const checked = e.target.checked;
                setShowNotImplemented(checked);
                if (!checked) {
                  setSelectedCategories(prev => prev.filter(tag => tag !== NOT_IMPLEMENTED));
                }
              }}
            >
              显示未实装
            </Checkbox>
            <Button
              onClick={() => {
                setKeyword('');
                setSelectedCategories([]);
                setSelectedDamageTypes([]);
                setShowNotImplemented(false);
                setPage(1);
              }}
            >
              清除所有
            </Button>
          </>
        )}
      </div>
      <Table<Row>
        className="weapon-skill-magic-table"
        columns={displayColumns}
        dataSource={visibleData}
        rowKey={getRowKey}
        size="small"
        bordered
        scroll={{ x: 'max-content' }}
        pagination={false}
        expandable={expandable}
        locale={{ emptyText: '没有匹配的数据' }}
      />
      {pagination && (
        <CustomPagination
          currentPage={page}
          pageSize={pageSize}
          totalItems={filteredData.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      )}
      {notes && notes.length > 0 && (
        <div className="weapon-skill-magic-notes">
          <div className="weapon-skill-magic-notes-title">说明</div>
          {notes.map((note, index) => (
            <div key={index} className="weapon-skill-magic-note">
              {note}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const textColumn = (title: string, key: string, width: number): ColumnsType<Row>[number] => ({
  title,
  dataIndex: key,
  key,
  width,
});

const damageTypeColumn = (width: number): ColumnsType<Row>[number] => ({
  title: '伤害类型',
  dataIndex: '伤害类型',
  key: '伤害类型',
  width,
  render: (value: string) => formatDamageType(value || ''),
});

const spellDetailConfig: DetailConfig = {
  field: '详情',
  linkColumnKey: '基础威力',
  title: '弹道说明',
};

const spellColumns: ColumnsType<Row> = [
  textColumn('名称', '名称', 120),
  textColumn('基础威力', '基础威力', 190),
  textColumn('耗蓝', '耗蓝', 90),
  textColumn('霸体', '霸体', 90),
  damageTypeColumn(90),
  textColumn('加成', '加成', 90),
  textColumn('削韧', '削韧', 160),
  textColumn('备注', '备注', 320),
];

const supportColumns: ColumnsType<Row> = [
  textColumn('名称', '名称', 120),
  textColumn('效果', '效果', 480),
  textColumn('耗蓝', '耗蓝', 80),
  textColumn('持续时间', '持续时间', 100),
  textColumn('备注', '备注', 280),
];

const categoryColorMap: Record<string, string> = {
  厚重: 'volcano', 锋利: 'cyan', 优质: 'green', 寒冷: 'blue', 无属性: 'default',
  毒: 'green', 血: 'red', 火焰: 'volcano', 焰术: 'orange', 神圣: 'gold',
  神秘: 'purple', 雷电: 'geekblue', 魔力: 'magenta',
  短剑: 'blue', 刺剑: 'blue', 重刺剑: 'blue', 直剑: 'blue', 大剑: 'blue',
  特大剑: 'blue', 轻大剑: 'blue', 刀: 'cyan', 大刀: 'cyan', 大曲剑: 'cyan',
  曲剑: 'cyan', 双头剑: 'cyan', 反手剑: 'cyan', 斧: 'volcano', 大斧: 'volcano',
  槌: 'volcano', 大槌: 'volcano', 特大武器: 'volcano', 矛: 'purple', 大矛: 'purple',
  戟: 'purple', 镰刀: 'purple', 鞭: 'purple', 连枷: 'purple', 盾: 'gold',
  火把: 'orange', 弓弩: 'geekblue', 拳头: 'green', 调香瓶: 'magenta',
};

const splitCategoryTags = (category: string, suffix: RegExp): string[] =>
  category
    .split(/[、,，/]/)
    .map(item => item.replace(suffix, '').trim())
    .filter(Boolean);

const renderCategoryTags = (tags: string[], hints?: Record<string, string>) => (
  <div className="weapon-skill-category-tags" style={{ display: 'flex', flexWrap: 'nowrap', gap: 4, whiteSpace: 'nowrap' }}>
    {tags.map(tag => {
      const hint = hints?.[tag];
      const tagNode = (
        <Tag
          color={tag === NOT_IMPLEMENTED ? 'orange' : (categoryColorMap[tag] || 'blue')}
          style={hint ? { cursor: 'help' } : undefined}
        >
          {tag}
        </Tag>
      );
      return hint ? (
        <Tooltip key={tag} title={hint} placement="top" mouseEnterDelay={0.15}>
          {tagNode}
        </Tooltip>
      ) : (
        <React.Fragment key={tag}>{tagNode}</React.Fragment>
      );
    })}
  </div>
);

const renderWeaponArtCategory = (_: string, record: Row) => {
  if (record['版本'] === 'DLC' || record['分类'] === 'DLC新增') {
    return renderCategoryTags([NOT_IMPLEMENTED]);
  }
  return renderCategoryTags(splitCategoryTags(record['分类'] || '', /战灰$/), categoryHints);
};

const renderUniqueCategory = (_: string, record: Row) => {
  const tags = splitCategoryTags(record['分类'] || '', /类$/);
  if (record['版本'] === 'DLC') {
    return renderCategoryTags([NOT_IMPLEMENTED, ...tags]);
  }
  return renderCategoryTags(tags);
};

const weaponArtColumns: ColumnsType<Row> = [
  {
    title: '分类',
    dataIndex: '分类',
    key: '分类',
    width: 80,
    render: renderWeaponArtCategory,
  },
  textColumn('战技', '战技', 140),
  textColumn('动作', '动作', 120),
  textColumn('耗蓝', '耗蓝', 80),
  textColumn('霸体', '霸体', 80),
  textColumn('类型', '类型', 64),
  textColumn('攻击倍率/基础攻击力', '攻击倍率/基础攻击力', 230),
  textColumn('削韧', '削韧', 170),
  textColumn('物理类型', '物理类型', 90),
  damageTypeColumn(100),
  textColumn('特殊加成', '特殊加成', 100),
  textColumn('备注', '备注', 320),
];

const uniqueWeaponArtColumns: ColumnsType<Row> = [
  {
    title: '分类',
    dataIndex: '分类',
    key: '分类',
    width: 70,
    render: renderUniqueCategory,
  },
  textColumn('武器', '武器', 130),
  textColumn('战技', '战技', 130),
  textColumn('补正', '补正', 140),
  textColumn('动作', '动作', 120),
  textColumn('耗蓝', '耗蓝', 70),
  textColumn('霸体', '霸体', 70),
  textColumn('类型', '类型', 60),
  textColumn('攻击倍率/基础攻击力', '攻击倍率/基础攻击力', 220),
  textColumn('特殊加成', '特殊加成', 100),
  textColumn('削韧', '削韧', 180),
  damageTypeColumn(110),
  textColumn('备注', '备注', 320),
];

const mergeKey = (...parts: string[]) => parts.join('\u0000');

// 战技：同一分类下的同一个战技，合并“分类”和“战技”列
const weaponArtMergeRules: MergeRule[] = [
  {
    columnKey: '分类',
    groupKey: (row) => mergeKey(row['版本'] || '', row['分类'] || '', row['战技'] || ''),
  },
  {
    columnKey: '战技',
    groupKey: (row) => mergeKey(row['版本'] || '', row['分类'] || '', row['战技'] || ''),
  },
];

// 专用战技：同一个武器/战技组，合并“分类 / 武器 / 补正 / 战技”
const uniqueWeaponArtMergeRules: MergeRule[] = [
  {
    columnKey: '分类',
    groupKey: (row) => mergeKey(row['版本'] || '', row['分类'] || '', row['武器'] || ''),
  },
  {
    columnKey: '武器',
    groupKey: (row) => mergeKey(row['版本'] || '', row['分类'] || '', row['武器'] || ''),
  },
  {
    columnKey: '补正',
    groupKey: (row) => mergeKey(row['版本'] || '', row['分类'] || '', row['武器'] || ''),
  },
  {
    columnKey: '战技',
    groupKey: (row) => mergeKey(row['版本'] || '', row['分类'] || '', row['武器'] || '', row['战技'] || ''),
  },
];

interface WeaponSkillMagicViewProps {
  activeSubTab?: string;
}

const WeaponSkillMagicView: React.FC<WeaponSkillMagicViewProps> = ({ activeSubTab }) => {
  const [activeTab, setActiveTab] = useState('战技');

  useEffect(() => {
    if (activeSubTab && TAB_KEYS.includes(activeSubTab)) {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  return (
    <div className="content-wrapper">
      <Tabs
        type="card"
        style={{ marginTop: '20px' }}
        activeKey={activeTab}
        onChange={setActiveTab}
        className="custom-tabs"
        items={[
          {
            key: '战技',
            label: '⚔️ 战技',
            children: (
              <div id="weapon-skills">
                <DataTable
                  columns={weaponArtColumns}
                  data={weaponArtRows}
                  searchPlaceholder="搜索战技 / 动作 / 分类 / 备注"
                  notes={weaponArtNotes}
                  skillFilterKind="weaponArt"
                  mergeRules={weaponArtMergeRules}
                  damageFilter
                />
              </div>
            ),
          },
          {
            key: '专用战技',
            label: '🗡️ 专用战技',
            children: (
              <div id="unique-weapon-skills">
                <DataTable
                  columns={uniqueWeaponArtColumns}
                  data={uniqueWeaponArtRows}
                  searchPlaceholder="搜索武器 / 战技 / 动作 / 备注"
                  notes={uniqueWeaponArtNotes}
                  skillFilterKind="unique"
                  mergeRules={uniqueWeaponArtMergeRules}
                  damageFilter
                />
              </div>
            ),
          },
          {
            key: '魔法',
            label: '🔮 魔法',
            children: (
              <div id="sorceries">
                <DataTable
                  columns={spellColumns}
                  data={sorceryRows}
                  searchPlaceholder="搜索魔法 / 伤害类型 / 备注"
                  notes={sorceryNotes}
                  detail={spellDetailConfig}
                  damageFilter
                />
              </div>
            ),
          },
          {
            key: '祷告',
            label: '🙏 祷告',
            children: (
              <div id="incantations">
                <DataTable
                  columns={spellColumns}
                  data={incantationRows}
                  searchPlaceholder="搜索祷告 / 伤害类型 / 备注"
                  notes={incantationNotes}
                  damageFilter
                />
              </div>
            ),
          },
          {
            key: '辅助类',
            label: '✨ 辅助类',
            children: (
              <div id="support-skills">
                <DataTable
                  title="辅助魔法"
                  columns={supportColumns}
                  data={supportMagicRows}
                  searchPlaceholder="搜索辅助魔法 / 效果 / 备注"
                  marginBottom={24}
                  pagination={false}
                  notes={supportNotes}
                />
                <DataTable
                  title="辅助祷告"
                  columns={supportColumns}
                  data={supportIncantationRows}
                  searchPlaceholder="搜索辅助祷告 / 效果 / 备注"
                  marginBottom={0}
                  pagination={false}
                  notes={supportNotes}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default WeaponSkillMagicView;
