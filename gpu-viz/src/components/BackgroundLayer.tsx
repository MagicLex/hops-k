import React from 'react';
import { NodeProps } from 'reactflow';

interface BackgroundLayerData {
  label: string;
  width: number;
  height: number;
  color: string;
  stats?: {
    count: number;
    totalGPU?: number;
    usedGPU?: number;
    description: string;
  };
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
        pointerEvents: 'none',
        padding: '8px'
      }}
    >
      <div style={{ 
        position: 'absolute', 
        top: '12px', 
        left: '12px',
        width: '300px',
        display: 'flex', 
        flexDirection: 'column',
        gap: '6px'
      }}>
        <span style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: '#6b7280', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}>
          {data.label}
        </span>
        
        {data.stats && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '3px', 
            fontSize: '10px', 
            color: '#9ca3af'
          }}>
            <div style={{ fontWeight: '500' }}>{data.stats.count} items</div>
            {data.stats.totalGPU && (
              <div>{data.stats.totalGPU} GPU allocated</div>
            )}
            {data.stats.usedGPU && (
              <div>{data.stats.usedGPU.toFixed(1)} GPU used</div>
            )}
            <div style={{ fontStyle: 'italic', color: '#6b7280' }}>• {data.stats.description}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundLayer;