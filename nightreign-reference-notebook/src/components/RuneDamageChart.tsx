import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必需的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
]);

// 羊头诅咒事件数据
const curseData = [
  { rune: 0, damageIncrease: 0 },
  { rune: 1000, damageIncrease: 0.4 },
  { rune: 2000, damageIncrease: 0.8 },
  { rune: 5000, damageIncrease: 2 },
  { rune: 10000, damageIncrease: 4 },
  { rune: 20000, damageIncrease: 8 },
  { rune: 30000, damageIncrease: 12 },
  { rune: 50000, damageIncrease: 20 },
  { rune: 60000, damageIncrease: 22 },
  { rune: 80000, damageIncrease: 26 },
  { rune: 100000, damageIncrease: 30 },
  { rune: 150000, damageIncrease: 33.75 },
  { rune: 200000, damageIncrease: 37.5 },
  { rune: 300000, damageIncrease: 45 },
  { rune: 500000, damageIncrease: 60 },
  { rune: 700000, damageIncrease: 75 },
  { rune: 900000, damageIncrease: 90 },
  { rune: 1000000, damageIncrease: 91.2 },
  { rune: 1100000, damageIncrease: 92.42 },
  { rune: 1500000, damageIncrease: 97.26 },
];

export default function RuneDamageChart() {
  // 用 useMemo 缓存配置项（避免重复渲染）
  const option = useMemo(() => ({
    title: { 
      text: '羊头诅咒事件 - 卢恩增伤关系图',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'var(--theme-text-primary)'
      }
    },
    xAxis: {
      type: 'value',
      name: '卢恩值',
      nameLocation: 'center',
      nameGap: 30,
      nameTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'var(--theme-text-primary)'
      },
      axisLabel: {
        color: 'var(--theme-text-secondary)',
        formatter: (value: number) => {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
          } else if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'K';
          }
          return value.toString();
        }
      },
      axisLine: {
        lineStyle: {
          color: 'var(--theme-border)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'var(--theme-border)',
          type: 'dashed'
        }
      }
    },
    yAxis: { 
      type: 'value', 
      name: '增伤 (%)',
      nameLocation: 'center',
      nameGap: 40,
      nameTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'var(--theme-text-primary)'
      },
      axisLabel: {
        color: 'var(--theme-text-secondary)',
        formatter: (value: number) => value + '%'
      },
      axisLine: {
        lineStyle: {
          color: 'var(--theme-border)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'var(--theme-border)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '增伤曲线',
        type: 'line',
        data: curseData.map(item => [item.rune, item.damageIncrease]),
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#5B8FF9'
        },
        itemStyle: {
          color: '#5B8FF9',
          borderColor: '#fff',
          borderWidth: 2
        },
        smooth: true,
        showSymbol: true,
        emphasis: {
          itemStyle: {
            color: '#5B8FF9',
            borderColor: '#fff',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(91, 143, 249, 0.3)'
          }
        }
      },
    ],
    // 缩放配置（滑动条）
    dataZoom: [
      {
        type: 'slider', // 底部滑动条
        start: 0,
        end: 100,
        bottom: 10,
        height: 20,
        borderColor: 'var(--theme-border)',
        backgroundColor: 'var(--theme-background)',
        fillerColor: 'rgba(91, 143, 249, 0.1)',
        handleStyle: {
          color: '#5B8FF9',
          borderColor: '#5B8FF9'
        },
        textStyle: {
          color: 'var(--theme-text-secondary)'
        }
      },
    ],
    // 悬停提示
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'var(--theme-background)',
      borderColor: 'var(--theme-border)',
      textStyle: {
        color: 'var(--theme-text-primary)'
      },
      formatter: (params: Array<{ value: [number, number] }>) => {
        const item = params[0];
        const runeValue = item.value[0];
        const damageValue = item.value[1];
        
        let runeText = '';
        if (runeValue >= 1000000) {
          runeText = (runeValue / 1000000).toFixed(1) + 'M';
        } else if (runeValue >= 1000) {
          runeText = (runeValue / 1000).toFixed(0) + 'K';
        } else {
          runeText = runeValue.toString();
        }
        
        return `
          <div style="padding: 8px;">
            <div style="margin-bottom: 8px; font-weight: bold;">羊头诅咒事件</div>
            <div style="margin-bottom: 4px;">卢恩: <span style="color: #5B8FF9; font-weight: bold;">${runeText}</span></div>
            <div>增伤: <span style="color: #5B8FF9; font-weight: bold;">${damageValue.toFixed(2)}%</span></div>
          </div>
        `;
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '15%',
      bottom: '15%'
    },
    backgroundColor: 'transparent'
  }), []);

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '500px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
