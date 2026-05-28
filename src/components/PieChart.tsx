import React from 'react';
import { View } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

interface Slice {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: Slice[];
  size?: number;
  innerRadius?: number;
}

const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  const a = ((angleDeg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
};

const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, 'Z'].join(' ');
};

export const PieChart: React.FC<PieChartProps> = ({ data, size = 160, innerRadius = 40 }) => {
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1;
  let acc = 0;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  return (
    <View>
      <Svg width={size} height={size}>
        <G>
          {data.map((d, i) => {
            const startAngle = (acc / total) * 360;
            acc += d.value;
            const endAngle = (acc / total) * 360;
            const path = describeArc(cx, cy, r, startAngle, endAngle);
            return <Path key={d.label + i} d={path} fill={d.color} />;
          })}

          {/* cutout for inner radius */}
          {innerRadius > 0 && (
            <Path
              d={describeArc(cx, cy, innerRadius, 0, 360)}
              fill="#0F172A"
            />
          )}

          {/* optional center label: total */}
          <SvgText x={cx} y={cy + 4} fontSize={12} fill="#FFF" fontWeight="700" textAnchor="middle">
            {total}
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

export default PieChart;
