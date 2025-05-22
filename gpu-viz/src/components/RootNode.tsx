import React from 'react';
import { Handle, Position } from 'reactflow';

interface RootNodeProps {
  data: {
    name: string;
    totalGPU: number;
    usedGPU: number;
    height?: number;
  };
}

const RootNode: React.FC<RootNodeProps> = ({ data }) => {
  const usagePercent = (data.usedGPU / data.totalGPU) * 100;
  
  return (
    <div 
      style={{
        backgroundColor: 'white',
        border: '1px solid #d1d5db',
        borderRadius: '2px',
        padding: '12px',
        minWidth: '160px',
        height: data.height || 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '11px'
      }}
    >
      <Handle type="source" position={Position.Bottom} style={{ background: '#6B7280' }} />
      
      {/* Header */}
      <div style={{ fontWeight: '600', color: '#111827', textAlign: 'center', fontSize: '14px' }}>
        {data.name}
      </div>
      
      {/* Total GPU line */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#6b7280' }}>Total GPU:</span>
        <span style={{ fontWeight: '600', color: '#111827', fontSize: '12px' }}>{data.totalGPU}</span>
      </div>
      
      {/* Usage line with progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
          <span style={{ color: '#6b7280' }}>Used:</span>
          <span style={{ fontWeight: '600', color: '#111827' }}>{data.usedGPU.toFixed(1)}</span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '1px',
          border: '1px solid #9ca3af',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${usagePercent}%`,
            height: '100%',
            backgroundColor: '#16a34a',
            borderRadius: '1px',
            position: 'absolute',
            top: '0',
            left: '0'
          }}></div>
        </div>
      </div>
      
      {/* Utilization percentage */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        fontSize: '10px',
        color: '#059669',
        fontWeight: '500'
      }}>
        <span>{usagePercent.toFixed(1)}% utilized</span>
      </div>
    </div>
  );
};

export default RootNode;