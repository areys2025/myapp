
import React from 'react';

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'path'> {
  // Fix: Renamed 'path' to 'svgPathData' to avoid conflict with React.SVGProps<SVGSVGElement>
  svgPathData: string | string[]; // SVG path data or array of paths
  size?: number | string;
  viewBox?: string;
}

const Icon: React.FC<IconProps> = ({ svgPathData, size = 24, viewBox = "0 0 24 24", className = "w-6 h-6", ...rest }) => {
  const paths = Array.isArray(svgPathData) ? svgPathData : [svgPathData];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      {...rest}
    >
      {paths.map((p, index) => (
        <path key={index} d={p} />
      ))}
    </svg>
  );
};

export default Icon;