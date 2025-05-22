import React from 'react';
import { NodeProps } from 'reactflow';

interface BackgroundLayerData {
  label: string;
  width: number;
  height: number;
  color: string;
}

const BackgroundLayer: React.FC<NodeProps<BackgroundLayerData>> = ({ data, zIndex }) => {
  return (
    <div 
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '1px',
        backgroundColor: data.color,
        width: data.width,
        height: data.height,
        zIndex: zIndex || -10,
        position: 'relative',
        pointerEvents: 'none', // Allow clicks to pass through to cards
        padding: '8px'
      }}
    >
      <div className="absolute top-3 left-6">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {data.label}
        </span>
      </div>
    </div>
  );
};

export default BackgroundLayer;