import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, G } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const d = (size: number, color: string, sw: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: color,
  strokeWidth: sw,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function IconHome({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <Path d="M9 21V12h6v9" />
    </Svg>
  );
}

export function IconArrowUpDown({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M7 3l-4 4 4 4M3 7h18M17 21l4-4-4-4M21 17H3" />
    </Svg>
  );
}

export function IconCreditCard({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <Path d="M1 10h22" />
    </Svg>
  );
}

export function IconSend({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M12 19V5M5 12l7-7 7 7" />
    </Svg>
  );
}

export function IconPlus({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconConvert({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
    </Svg>
  );
}

export function IconMore({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Circle cx="5" cy="12" r="1" fill={color} stroke="none" />
      <Circle cx="12" cy="12" r="1" fill={color} stroke="none" />
      <Circle cx="19" cy="12" r="1" fill={color} stroke="none" />
    </Svg>
  );
}

export function IconPerson({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export function IconEye({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function IconClose({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M18 6L6 18M6 6l12 12" />
    </Svg>
  );
}

export function IconChevronRight({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M9 18l6-6-6-6" />
    </Svg>
  );
}

export function IconLock({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <Path d="M7 11V7a5 5 0 0110 0v4" />
    </Svg>
  );
}

export function IconPeople({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </Svg>
  );
}

export function IconDoc({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </Svg>
  );
}

export function IconChart({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M3 3v18h18" />
      <Path d="M18 9l-5 5-4-4-3 3" />
    </Svg>
  );
}

export function IconBell({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </Svg>
  );
}

export function IconBuilding({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
    </Svg>
  );
}

export function IconPhone({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </Svg>
  );
}

export function IconList({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Rect x="3" y="3" width="18" height="18" rx="2" />
      <Path d="M8 7h8M8 12h8M8 17h5" />
    </Svg>
  );
}

export function IconGift({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
    </Svg>
  );
}

export function IconMessage({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </Svg>
  );
}

export function IconLocation({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <Circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

export function IconMobile({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <Path d="M12 18h.01" />
    </Svg>
  );
}

export function IconHelp({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
    </Svg>
  );
}

export function IconLogOut({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </Svg>
  );
}

export function IconCashOut({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...d(size, color, strokeWidth)}>
      <Path d="M2 12h20M12 2v4M8 6l4-4 4 4" />
      <Rect x="2" y="12" width="20" height="10" rx="2" />
      <Path d="M12 16v2M8 16h8" />
    </Svg>
  );
}
